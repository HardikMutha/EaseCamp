maptilersdk.config.apiKey = mapToken;
var map = new maptilersdk.Map({
container: 'map',
zoom: 1,
center: [0, 20],
style: maptilersdk.MapStyle.DATAVIZ.BRIGHT
});
console.log(all);

map.on('load', function () {
// add a clustered GeoJSON source for a sample set of Campgrounds
map.addSource('Campgrounds', {
    'type': 'geojson',
    'data': all, //all refers to data of all campgrounds recieved from index.ejs
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
});

map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'Campgrounds',
    filter: ['has', 'point_count'],
    paint: {
    // Use step expressions (https://docs.maptiler.com/gl-style-specification/expressions/#step)
    // with three steps to implement three types of circles:
    //   * Blue, 20px circles when point count is less than 100
    //   * Yellow, 30px circles when point count is between 100 and 750
    //   * Pink, 40px circles when point count is greater than or equal to 750
    'circle-color': [
        'step',
        ['get', 'point_count'],
        '#03A9F4',
        10,
        '#2196F3',
        45,
        '#f28cb1'
    ],
    'circle-radius': [
        'step',
        ['get', 'point_count'],
        17,
        10,
        30,
        25,
        35
    ]
    }
});

map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'Campgrounds',
    filter: ['has', 'point_count'],
    layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12
    }
});

map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'Campgrounds',
    filter: ['!', ['has', 'point_count']],
    paint: {
    'circle-color': '#11b4da',
    'circle-radius': 4,
    'circle-stroke-width': 1,
    'circle-stroke-color': '#fff'
    }
});

// inspect a cluster on click
map.on('click', 'clusters', function (e) {
    var features = map.queryRenderedFeatures(e.point, {
    layers: ['clusters']
    });
    var clusterId = features[0].properties.cluster_id;
    map.getSource('Campgrounds').getClusterExpansionZoom(
    clusterId,
    function (err, zoom) {
        if (err) return;
        map.easeTo({
        center: features[0].geometry.coordinates,
        zoom: zoom
        });
    }
    );
});

// When a click event occurs on a feature in
// the unclustered-point layer, open a popup at
// the location of the feature, with
// description HTML from its properties.
map.on('click', 'unclustered-point', function (e) {
    var coordinates = e.features[0].geometry.coordinates;
    console.log(coordinates);
    var location = e.features[0];
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) 
    {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    new maplibregl.Popup()
    .setLngLat(coordinates)
    .setHTML(`${e.features[0].properties.getPopUpTextForMap}`)
    .addTo(map);
});

map.on('mouseenter', 'clusters', function () {
    map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'clusters', function () {
    map.getCanvas().style.cursor = '';
});
});
