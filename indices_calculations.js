

// Load the Sentinel-2 image collection
var sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(aoi)                             // Filter to the AOI
  .filterDate('2018-03-01', '2018-04-30')        // Filter by date range
  //.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10));  // Filter by cloud cover

// Calculate the median image to reduce multiple images into one composite
var medianImage = sentinel2.median();

// Calculate NDVI using the formula (NIR - Red) / (NIR + Red)
var ndvi = medianImage.normalizedDifference(['B8', 'B4']).rename('NDVI');


// Clip NDVI layer to the AOI
var ndvi_clipped = ndvi.clip(aoi);
// Set visualization parameters for NDVI (green for vegetation)
var ndviVis = {
  min: -1,
  max: 1,
  palette: ['blue', 'white', 'green']
};

// Clip NDVI layer to the AOI
var ndvi_clipped = ndvi.clip(aoi);

// Add the NDVI layer to the map
Map.centerObject(aoi, 10);  // Center the map on the AOI
Map.addLayer(ndvi_clipped, ndviVis, 'NDVI');
Map.addLayer(aoi)


// Export the NDVI image to Google Drive
Export.image.toDrive({
  image: ndvi_clipped,
  description: 'Uttarkashi_NDVI_Mar_Apr_2018',
  scale: 10,
  region: aoi.geometry(),
  crs: 'EPSG:32644',
  maxPixels: 1e13
});


////


// Select the NIR (B8) and SWIR (B11) bands
var nir = sentinel2.select('B8');  // Near Infrared (NIR)
var swir = sentinel2.select('B11'); // Shortwave Infrared (SWIR)

// Calculate the NDBI using the formula similar to NDVI
var ndbi = medianImage.normalizedDifference(['B11', 'B8']).rename('NDBI');

// Define visualization parameters for NDBI
var ndbiVis = {
  min: -1,
  max: 1,
  palette: ['blue', 'white', 'red']  // Barren, neutral, built-up
};

// Add the NDBI layer to the map
Map.centerObject(aoi, 10);
Map.addLayer(ndbi.clip(aoi), ndbiVis, 'NDBI');

// Export the NDBI image to Google Drive
Export.image.toDrive({
  image: ndbi.clip(aoi),
  description: 'Uttarkashi_NDBI_Mar_Apr_2018',
  scale: 10,
  region: aoi.geometry(),
  fileFormat: 'GeoTIFF',
  maxPixels: 196979130
});

//////////


// Load Sentinel-2 Image Collection
var sentinel2 = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
                  .filterBounds(aoi)
                  .filterDate('2018-03-01', '2018-04-30')
                  //.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
                  .median();

// Select the necessary bands
var blue = sentinel2.select('B2');  // Blue
var red = sentinel2.select('B4');   // Red
var nir = sentinel2.select('B8');   // Near Infrared (NIR)
var swir = sentinel2.select('B11'); // Shortwave Infrared (SWIR)

// Calculate the BSI using the formula
var bsi = swir.add(red).subtract(nir.add(blue))
              .divide(swir.add(red).add(nir.add(blue)))
              .rename('BSI');

// Define visualization parameters for BSI
var bsiVis = {
  min: -1,
  max: 1,
  palette: ['blue', 'white', 'brown'] // Lower values to higher BSI values
};

// Add the BSI layer to the map
Map.centerObject(aoi, 10);
Map.addLayer(bsi.clip(aoi), bsiVis, 'BSI');

// Export the BSI image to Google Drive
Export.image.toDrive({
  image: bsi.clip(aoi),
  description: 'Uttarkashi_BSI_Mar_Apr_2018',
  scale: 10,
  region: aoi.geometry(),
  crs: 'EPSG:32644',
  fileFormat: 'GeoTIFF',
  maxPixels:1e13
});

/////////////////

/////////////////



// Load the Sentinel-2 image collection
var sentinel2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(aoi)                             // Filter to the AOI
  .filterDate('2024-03-01', '2024-04-30')        // Filter by date range
  //.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10));  // Filter by cloud cover

// Calculate the median image to reduce multiple images into one composite
var medianImage = sentinel2.median();

// Calculate NDVI using the formula (NIR - Red) / (NIR + Red)
var ndvi = medianImage.normalizedDifference(['B8', 'B4']).rename('NDVI');


// Clip NDVI layer to the AOI
var ndvi_clipped = ndvi.clip(aoi);
// Set visualization parameters for NDVI (green for vegetation)
var ndviVis = {
  min: -1,
  max: 1,
  palette: ['blue', 'white', 'green']
};

// Clip NDVI layer to the AOI
var ndvi_clipped = ndvi.clip(aoi);

// Add the NDVI layer to the map
Map.centerObject(aoi, 10);  // Center the map on the AOI
Map.addLayer(ndvi_clipped, ndviVis, 'NDVI');
Map.addLayer(aoi)


// Export the NDVI image to Google Drive
Export.image.toDrive({
  image: ndvi_clipped,
  description: 'Uttarkashi_NDVI_Mar_Apr_2024',
  scale: 10,
  region: aoi.geometry(),
  crs: 'EPSG:32644',
  maxPixels: 1e13
});


////


// Select the NIR (B8) and SWIR (B11) bands
var nir = sentinel2.select('B8');  // Near Infrared (NIR)
var swir = sentinel2.select('B11'); // Shortwave Infrared (SWIR)

// Calculate the NDBI using the formula similar to NDVI
var ndbi = medianImage.normalizedDifference(['B11', 'B8']).rename('NDBI');

// Define visualization parameters for NDBI
var ndbiVis = {
  min: -1,
  max: 1,
  palette: ['blue', 'white', 'red']  // Barren, neutral, built-up
};

// Add the NDBI layer to the map
Map.centerObject(aoi, 10);
Map.addLayer(ndbi.clip(aoi), ndbiVis, 'NDBI');

// Export the NDBI image to Google Drive
Export.image.toDrive({
  image: ndbi.clip(aoi),
  description: 'Uttarkashi_NDBI_Mar_Apr_2024',
  scale: 10,
  region: aoi.geometry(),
  fileFormat: 'GeoTIFF',
  maxPixels: 196979130
});

//////////


// Load Sentinel-2 Image Collection
var sentinel2 = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
                  .filterBounds(aoi)
                  .filterDate('2024-01-01', '2024-06-30')
                  //.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
                  .median();

// Select the necessary bands
var blue = sentinel2.select('B2');  // Blue
var red = sentinel2.select('B4');   // Red
var nir = sentinel2.select('B8');   // Near Infrared (NIR)
var swir = sentinel2.select('B11'); // Shortwave Infrared (SWIR)

// Calculate the BSI using the formula
var bsi = swir.add(red).subtract(nir.add(blue))
              .divide(swir.add(red).add(nir.add(blue)))
              .rename('BSI');

// Define visualization parameters for BSI
var bsiVis = {
  min: -1,
  max: 1,
  palette: ['blue', 'white', 'brown'] // Lower values to higher BSI values
};

// Add the BSI layer to the map
Map.centerObject(aoi, 10);
Map.addLayer(bsi.clip(aoi), bsiVis, 'BSI');

// Export the BSI image to Google Drive
Export.image.toDrive({
  image: bsi.clip(aoi),
  description: 'Uttarkashi_BSI_Mar_Apr_2024',
  scale: 10,
  region: aoi.geometry(),
  crs: 'EPSG:32644',
  fileFormat: 'GeoTIFF',
  maxPixels:1e13
});

