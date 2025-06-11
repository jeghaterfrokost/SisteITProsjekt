npm install --save @polygon.io/client-js

const h1 = document.getElementById("h1")
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
    h1.innerHTML = hourMinute;
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
nyheter();

function aksjer() {
    const apiKeyAksjer = "ltmUVNj0Wwz7hdWiEXoiWy216jkP5EI4";
    const aksjeurl = `https://api.polygon.io/v3/reference/dividends?apiKey=${apiKeyAksjer}`;
    console.log(aksjeurl);

    fetch(aksjeurl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Nettverksfeil: " + response.status);
            }
            return response.json();
        })
        .then(data => {

            data.results.forEach(aksje => {
                console.log("Aksje:", aksje.id, "Utbytte:", aksje.cash_amount, "Dato:", aksje.pay_date);
            })

        })
        .catch(error => {
            console.error("Feil ved henting av aksjedata:", error);
        });
}

aksjer();