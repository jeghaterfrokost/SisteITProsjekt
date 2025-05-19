
const h1 = document.getElementById("h1")
const h2 = document.getElementById("h2")

function vistid(){
    const now = new Date();
    let hourMinute = now.getHours() + ":"
    if (now.getMinutes < 10){
        hourMinute += "0"
    }
    hourMinute += now.getMinutes()
    console.log("HourMinute:", hourMinute)
    h1.innerHTML =  hourMinute
}
setInterval(vistid, 1000)

function hilsetid(){
    const now = new Date();
    if (now.getHours() > 6 && now.getHours() <= 8){
        h2.innerHTML = "God morgen"
    }
    else if(now.getHours() > 8 && now.getHours() <= 12){
        h2.innerHTML = "God formiddag"
    }
    else if(now.getHours() > 12 && now.getHours() <= 18){
        h2.innerHTML = "God ettermiddag"
    }
    else if(now.getHours() > 18 && now.getHours() <= 24){
        h2.innerHTML = "God kveld"
    }
    else{
        h2.innerHTML = "God aften"
    }
}
setInterval(hilsetid, 1000)

function visevaeret(){
    const response = await fetch()
    if(response.status == 200){
    console.log(response)
    const funfactJSON = await response.json()}

}

