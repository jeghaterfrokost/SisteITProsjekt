//npm install --save @polygon.io/client-js

const klokke = document.getElementById("klokke")
const hilse = document.getElementById("hilse")
const vaerfeil = document.getElementById("vaerfeil")
const vaerElm = document.getElementById("vaer")

function vistid() {
    const now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();

    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }

    const hourMinute = hour + ":" + minute;
    klokke.innerHTML = hourMinute;
}

setInterval(vistid, 1000)

function hilsetid() {
    const now = new Date();
    if (now.getHours() > 6 && now.getHours() <= 8) {
        hilse.innerHTML = "God morgen"
    }
    else if (now.getHours() > 8 && now.getHours() <= 11) {
        hilse.innerHTML = "God formiddag"
    }
    else if (now.getHours() > 11 && now.getHours() <= 18) {
        hilse.innerHTML = "God ettermiddag"
    }
    else if (now.getHours() > 18 && now.getHours() <= 24) {
        hilse.innerHTML = "God kveld"
    }
    else {
        hilse.innerHTML = "God aften"
    }
}
setInterval(hilsetid, 1000)

function visvaeret() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            posisjon => {
                const lat = posisjon.coords.latitude;
                const lon = posisjon.coords.longitude;

                const vaerurl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
                console.log(vaerurl);

                fetch(vaerurl)
                    .then(response => response.json())
                    .then(data => {
                        const weather = data.current_weather;
                        const vind = weather.windspeed / 3.6
                        vaerElm.innerHTML = `Temperatur: ${weather.temperature}°C<br>Vind: ${vind.toFixed(1)} m/s`;
                        vaerfeil.innerHTML = "";
                    })
                    .catch(error => {
                        vaerfeil.innerHTML = "Klarte ikke å hente værdata";
                        vaerElm.innerHTML = "";
                    });
            },
            error => {
                vaerfeil.innerHTML = "Feil ved posisjonering";
                vaerElm.innerHTML = "";
            }
        );
    } else {
        vaerfeil.innerHTML = "Geolokasjon støttes ikke av nettleseren";
        vaerElm.innerHTML = "";
    }
}
visvaeret();

function nyheter() {
    const apiKeyVaer = "759422acb48ef91454e1cd6e43c6c34e";
    const nyheturl = (`https://gnews.io/api/v4/top-headlines?topic=technology&lang=no&max=5&token=${apiKeyVaer}`);
    console.log(nyheturl);

    fetch(nyheturl)
        .then(response => response.json())
        .then(data => {
            if (data.articles && data.articles.length > 0) {
                let nyhetsHtml = "<h3>Nyheter</h3><ul>";
                data.articles.slice(0, 5).forEach(artikkel => {
                    nyhetsHtml += `<li><a href="${artikkel.url}" target="_blank">${artikkel.title}</a></li>`;
                });
                nyhetsHtml += "</ul>";
                document.getElementById("nyheter").innerHTML = nyhetsHtml;
            } else {
                document.getElementById("nyheter").innerHTML = "Klarte ikke å hente nyheter.";
                console.log("Feil ved henting av nyheter:", data.status);

            }
        })
        .catch(error => {
            document.getElementById("nyheter").innerHTML = "Feil ved henting av nyheter.";
        });

}

nyheter()

function getAksjer(fetchFresh = false) {
    const key = "ltmUVNj0Wwz7hdWiEXoiWy216jkP5EI4";
    const aksjer = [
        { symbol: "AAPL", elm: "appleverdielm" },
        { symbol: "TSLA", elm: "teslaverdielm" },
        { symbol: "AMZN", elm: "amazonverdielm" },
        { symbol: "NVDA", elm: "nvidiaverdielm" },
        { symbol: "GOOGL", elm: "googleverdielm" },
        { symbol: "MSFT", elm: "microsoftverdielm" },
        { symbol: "META", elm: "metaverdielm" }
    ];

    // Hent lagrede verdier fra localStorage
    let lagret = {};
    try {
        lagret = JSON.parse(localStorage.getItem("aksjeverdier")) || {};
    } catch (e) {
        lagret = {};
    }

    aksjer.forEach(aksje => {
        const elm = document.getElementById(aksje.elm);

        if (!fetchFresh && lagret[aksje.symbol]) {
            // Vis lagret verdi
            if (elm) elm.innerHTML = lagret[aksje.symbol];
            return;
        }

        // Hent ny verdi fra API
        fetch(`https://api.polygon.io/v1/indicators/sma/${aksje.symbol}?timespan=day&adjusted=true&window=1&series_type=close&order=desc&limit=1&apikey=${key}`)
            .then(response => {
                if (response.status === 429) {
                    if (elm) elm.innerHTML = "For mange requests";
                    return {};
                }
                return response.json();
            })
            .then(data => {
                if (data.results && data.results.values && data.results.values[0]) {
                    const verdi = data.results.values[0].value;
                    if (elm) elm.innerHTML = verdi;
                    lagret[aksje.symbol] = verdi;
                    // Oppdater localStorage
                    localStorage.setItem("aksjeverdier", JSON.stringify(lagret));
                } else {
                    if (elm) elm.innerHTML = "Feil";
                }
            })
            .catch(error => {
                if (elm) elm.innerHTML = "Feil";
            });
    });
}

// Tider for oppdatering (norsk tid): 15:30, 19:00, 22:30
const updateTimes = [
    { hour: 15, minute: 30 },
    { hour: 19, minute: 0 },
    { hour: 22, minute: 30 }
];

// Sjekk om det er tid for oppdatering
function shouldUpdateNow() {
    const now = new Date();
    return updateTimes.some(t => now.getHours() === t.hour && now.getMinutes() === t.minute);
}

// Planlegg oppdatering ved de faste tidene
function scheduleAksjeUpdates() {
    function getNextTimeout(targetHour, targetMinute) {
        const now = new Date();
        const next = new Date();
        next.setHours(targetHour, targetMinute, 0, 0);
        if (next <= now) {
            next.setDate(next.getDate() + 1);
        }
        return next - now;
    }

    updateTimes.forEach(time => {
        function schedule() {
            const timeout = getNextTimeout(time.hour, time.minute);
            setTimeout(() => {
                getAksjer(true); // Hent ferske verdier og lagre
                schedule(); // Planlegg neste gang
            }, timeout);
        }
        schedule();
    });
}

// Ved lasting: vis lagrede verdier
getAksjer(false);
// Planlegg oppdateringer
scheduleAksjeUpdates();