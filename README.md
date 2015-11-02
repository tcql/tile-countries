
A small utility to generate tile cover for all countries in the world. This is useful for reducing the amount of work required to run a global [tile-reduce](https://github.com/mapbox/tile-reduce) job, by focusing only on tiles that fall over land.

## install

```
npm install
```

## usage

```
node index.js --basezoom=8 --detailzoom=10 --output=geojson
```

- **basezoom** *(required)* the lowest zoom tiles allowed in the tile-cover result
- **detailzoom** *(required)* the highest zoom tiles allowed in the tile-cover result
- **output** controls the output type. one of `geojson`, `bbox`, or `tile`. If not provided, `tile` is assumed

