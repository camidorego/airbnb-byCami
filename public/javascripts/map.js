mapboxgl.accessToken = mapToken;
const misCoord = stay.geometry.coordinates
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: misCoord, // starting position [lng, lat]
    zoom: 9, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
    .setLngLat(misCoord)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<h3>${stay.title}</h3><p>${stay.location}</p>`)
    )
    .addTo(map)