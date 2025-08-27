mapboxgl.accessToken =mapToken;

const map = new mapboxgl.Map({
container: 'map', // container ID
style:'mapbox://styles/mapbox/streets-v12', //style URL
center:listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
zoom: 9 // starting zoom
});

//goto--> https://docs.mapbox.com/mapbox-gl-js/example/add-a-marker/
//we can add multiplae marker like marker1 marker2
    const marker = new mapboxgl.Marker({ color: 'red'})
        .setLngLat(listing.geometry.coordinates)
        .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h6>${listing.title}</h6> <p>Exact location will be provided after booking! You'll be living here!</P>`
        ))
        .addTo(map);
