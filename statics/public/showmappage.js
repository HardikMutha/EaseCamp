maptilersdk.config.apiKey = mapToken;
console.log(campground);
const map = new maptilersdk.Map({
    container: 'map',
    style: maptilersdk.MapStyle.BRIGHT,
    center: campground.geometry.coordinates,
    zoom: 15
});

const marker = new maptilersdk.Marker({
    color:'red'
}).setLngLat(campground.geometry.coordinates).setPopup(new maptilersdk.Popup().setHTML(`<h6>${campground.title}</h6>`))
.addTo(map);

console.log(marker.getPopup());