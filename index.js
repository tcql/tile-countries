var argv = require('minimist')(process.argv.slice(2)),
  tilecover = require('tile-cover'),
  tilebelt = require('tilebelt'),
  bboxPolygon = require('turf-bbox-polygon'),
  xyz = require('geojson-xyz');


xyz('ne_50m_admin_0_countries.geojson', function (err, result) {
  if (err) throw new Error(err);

  var countries = result.geojson;
  var rings = [];

  // First, join all countries into a single multipolygon so that we can run 
  // simultaneous tile cover for the whole world.
  countries.features.forEach(function(c) {
    if (c.properties.name === 'Antarctica') return;

    if (c.geometry.type === 'Polygon') {
      rings.push(c.geometry.coordinates);
    } else if (c.geometry.type === 'MultiPolygon') {
      rings = rings.concat(c.geometry.coordinates);
    }
  });

  var poly = {'type': 'MultiPolygon', 'coordinates': rings};

  // Run tilecover on our massive multipolygon 
  if (argv.output === 'geojson') {
    var geom = tilecover.geojson(poly, {min_zoom: argv.basezoom, max_zoom: argv.detailzoom});
    console.log(JSON.stringify(geom));
  } else {
    var tiles = tilecover.tiles(poly, {min_zoom: argv.basezoom, max_zoom: argv.detailzoom});

    if (argv.output === 'bbox') {
      tiles = tiles.map(function (tile) { return tilebelt.tileToBBOX(tile); });
    }

    tiles.forEach(function (tile) {
      console.log(JSON.stringify(tile));
    });
  }
});
