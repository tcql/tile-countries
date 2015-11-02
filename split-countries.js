var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var tilecover = require('tile-cover');
var tilebelt = require('tilebelt');
var bboxPolygon = require('turf-bbox-polygon');

var countries = JSON.parse(fs.readFileSync(__dirname+'/ne_50m_admin_0_countries.geojson'));

var rings = [];

// First, tile each country individually. This helps us cut down on
// vertices to be handled all at once
countries.features.forEach(function(c) {
  if (c.properties.name === 'Antarctica') return;

  var cover = tilecover.tiles(c.geometry, {min_zoom: argv.basezoom, max_zoom: argv.detailzoom});
  // Convert each tile into a polygon ring
  cover.forEach(function (t) { 
    rings.push(bboxPolygon(tilebelt.tileToBBOX(t)).geometry.coordinates);
  });
});

// Convert all polygon's rings into a single multipolygon
var poly = {'type': 'MultiPolygon', 'coordinates': rings};

// Rerun tilecover. Now tiles can expand beyond country borders and we can fit larger tiles
var geom = tilecover.geojson(poly, {min_zoom: argv.basezoom, max_zoom: argv.detailzoom});
console.log(JSON.stringify(geom));
