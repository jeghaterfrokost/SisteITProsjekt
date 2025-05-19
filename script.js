
const h1 = document.getElementById("h1")

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

