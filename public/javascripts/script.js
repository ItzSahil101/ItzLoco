const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude, longitude} = position.coords;
        console.log(latitude, longitude);
        
        socket.emit("send-location", {latitude, longitude})
    }, (err)=>{
        console.log(err);
    }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    })
}
else{
    console.error("This browser doesnt support this website! Please open it on another browser")
}

const map = L.map("map").setView([0,0], 16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "Itz Map"
}).addTo(map)

const markers = {};

socket.on("receive-location", (data)=>{
    const {id, latitude, longitude} = data;
    console.log(id, latitude, longitude);
    
    map.setView([latitude, longitude])
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude])
    }else{
        markers[id] = L.marker([latitude, longitude]).addTo(map)
    }
})

socket.on("user-disconnected", (id)=>{
  if(markers[id]){
    map.removeLayer(markers[id])
    delete markers[id]
  }
})