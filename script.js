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

function hilsetid(){
    const now = new Date();
    if (now.getHours() > 6 && now.getHours() <= 8){
        hilse.innerHTML = "God morgen"
    }
    else if(now.getHours() > 8 && now.getHours() <= 11){
        hilse.innerHTML = "God formiddag"
    }
    else if(now.getHours() > 11 && now.getHours() <= 18){
        hilse.innerHTML = "God ettermiddag"
    }
    else if(now.getHours() > 18 && now.getHours() <= 24){
        hilse.innerHTML = "God kveld"
    }
    else{
        hilse.innerHTML = "God aften"
    }
}
setInterval(hilsetid, 1000)

function visvaeret(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            posisjon => {
                const lat = posisjon.coords.latitude;
                const lon = posisjon.coords.longitude;

                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        const weather = data.current_weather;
                        vaerElm.innerHTML = `Temperatur: ${weather.temperature}°C<br>Vind: ${weather.windspeed} m/s`;
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
    const apiKey = "759422acb48ef91454e1cd6e43c6c34e"; 
    const url = fetch(`https://gnews.io/api/v4/top-headlines?topic=technology&lang=no&max=5&token=${apiKey}`);

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.status === "ok") {
                let nyhetsHtml = "<h3>Nyheter</h3><ul>";
                data.articles.slice(0, 5).forEach(artikkel => {
                    nyhetsHtml += `<li><a href="${artikkel.url}" target="_blank">${artikkel.title}</a></li>`;
                });
                nyhetsHtml += "</ul>";
                // Opprett et element i HTML med id="nyheter" for å vise nyhetene
                document.getElementById("nyheter").innerHTML = nyhetsHtml;
            } else {
                document.getElementById("nyheter").innerHTML = "Klarte ikke å hente nyheter.";
            }
        })
        .catch(error => {
            document.getElementById("nyheter").innerHTML = "Feil ved henting av nyheter.";
        });
}
nyheter();