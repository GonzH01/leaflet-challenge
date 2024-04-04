// Initialize the map
var myMap = L.map("map", {
    center: [37.09, -95.71], // Central location of the map
    zoom: 5 // Initial zoom level
  });
  
  // Add a base map layer
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  // Fetch Earthquake Data
  var geojsonDataUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"; 
  
  fetch(geojsonDataUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(earthquakeData) {
      createFeatures(earthquakeData.features);
    });
  
  // Function to create features
  function createFeatures(earthquakeData) {
  
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
        "<hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }
  
    function pointToLayer(feature, latlng) {
      var geojsonMarkerOptions = {
        radius: 4 * feature.properties.mag, // Radius proportional to magnitude
        fillColor: getColor(feature.geometry.coordinates[2]), // Color by depth
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      };
      return L.circleMarker(latlng, geojsonMarkerOptions);
    }
  
    var earthquakes = L.geoJSON(earthquakeData, {
      onEachFeature: onEachFeature,
      pointToLayer: pointToLayer
    });
  
    earthquakes.addTo(myMap);
  }
  
  // Function to determine marker color based on depth
  function getColor(depth) {
    return depth > 90 ? 'Red' :
           depth > 70  ? 'OrangeRed' :
           depth > 50  ? 'Orange' :
           depth > 30  ? 'Yellow' :
           depth > 10   ? 'YellowGreen' :
                         'LimeGreen';
  }
  
// Define legend content
var legendContent = '<strong> Depth (km)</strong><br>' +
    '<i style="background: LimeGreen"></i> -10-10<br>' +
    '<i style="background: YellowGreen"></i> 10-30<br>' +
    '<i style="background: Yellow"></i> 30-50<br>' +
    '<i style="background: Orange"></i> 50-70<br>' +
    '<i style="background: OrangeRed"></i> 70-90<br>' +
    '<i style="background: Red"></i> 90+';

// Create legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = legendContent;

    // Style the legend div
    div.style.backgroundColor = 'white';   
    div.style.padding = '6px';             
    div.style.border = '1px solid #ccc';   

    return div;
};

legend.addTo(myMap);

// Style Legend
var legendStyle = document.createElement('style');
legendStyle.innerHTML = '.legend i { display: inline-block; width: 20px; height: 20px; margin-right: 8px; }';
document.getElementsByTagName('head')[0].appendChild(legendStyle);