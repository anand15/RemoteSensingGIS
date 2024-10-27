
//YEAR 2024

// Step 1: Load Sentinel-2 Data and Filter by Date and Cloud Coverage
var sentinel2_2024 = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
  .filterBounds(uttarkashi_dist)
  .filterDate('2024-03-01', '2024-04-30')
  .median();
print(sentinel2_2024)

// Step 2: Select Relevant Bands for Classification for 2024
var bands = ['B2', 'B3', 'B4', 'B5', 'B8', 'B11', 'B12'];
var sentinel_2024_image = sentinel2_2024.select(bands);
var ndvi = sentinel_2024_image.normalizedDifference(['B8', 'B4']).rename('NDVI');
sentinel_2024_image = sentinel_2024_image.addBands(ndvi);
print('Sentinel-2 Image with Selected Bands and NDVI', sentinel_2024_image);


// Step 3: Training and test data preperation. split land cover data into train and test
// Define the unique land cover categories
var landcover_categories_2024 = [1, 2, 5, 7, 8,9];

// Initialize empty FeatureCollections to store the combined training and test data
var training_data_combined_2024 = ee.FeatureCollection([]);
var test_data_combined_2024 = ee.FeatureCollection([]);

// Split the data for each category
landcover_categories_2024.forEach(function(category) {
  // Filter the FeatureCollection for the current land cover category
  var category_fc = uk_lc_label_2024.filter(ee.Filter.eq('DN', category));
  
  // Add a random value column to the FeatureCollection for random splitting
  var category_fc_random = category_fc.randomColumn('random');
  
  // Split into training and test data for the current category
  var training_data = category_fc_random.filter(ee.Filter.lt('random', 0.7));
  var test_data = category_fc_random.filter(ee.Filter.gte('random', 0.3));
  
  // Merge with the combined training and test data FeatureCollections
  training_data_combined_2024 = training_data_combined_2024.merge(training_data);
  test_data_combined_2024 = test_data_combined_2024.merge(test_data);
});

// Step 4: Print the combined training and test data to the console to verify the split
print('Combined Training Data 2024:', training_data_combined_2024);
print('Combined Test Data 2024:', test_data_combined_2024);


// Step 5: Sample Sentinel-2 Image Data Using Training Points
var training_samples_2024 = sentinel_2024_image.sampleRegions({
  collection: training_data_combined_2024,
  properties: ['DN'],
  scale: 10
});

print(training_samples_2024)

// Step 6: Train a Gradient Boosted Trees Classifier Using the Training Data
var classifier_2024 = ee.Classifier.smileGradientTreeBoost(100).train({
  features: training_samples_2024,
  classProperty: 'DN',
  inputProperties: bands.concat('NDVI')
});

// Step 7: Apply the Classifier to Classify the Land Cover
var classified_image_2024 = sentinel_2024_image.classify(classifier_2024);

//accuracy assessment

// Step 1: Sample the classified image using the same points as the training samples
var validation_samples_2024 = classified_image_2024.sampleRegions({
  collection: test_data_combined_2024,
  properties: ['DN'],  // This should be the numeric label property
  scale: 10
});

// Step 2: Print the validation samples to ensure they have the 'DN' property and the 'classification' property
print('Validation samples 2024', validation_samples_2024);

// Step 3: Create a confusion matrix
var confusionMatrix_2024 = validation_samples_2024.errorMatrix('DN', 'classification');

// Step 4: Print the confusion matrix
print('Confusion Matrix 2024', confusionMatrix_2024);

// Step 5: Calculate accuracy metrics
print('Overall Accuracy 2024:', confusionMatrix_2024.accuracy());
print('Kappa Coefficient 2024:', confusionMatrix_2024.kappa());
print('Producer\'s Accuracy 2024:', confusionMatrix_2024.producersAccuracy());
print('User\'s Accuracy 2024:', confusionMatrix_2024.consumersAccuracy());


Export.image.toDrive({
  image: classified_image_2024,
  description: 'uk_classified_image_2024_v3',
  fileNamePrefix: 'uk_classified_image_2024_v3',
  region:uttarkashi_dist,
  maxPixels: 1e13,
  scale: 10
})

// YEAR 2018

// Step 1: Load the Sentinel-2 Image Collection for 2018 and Filter by AOI and Date
var sentinel2_2018 = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
  .filterBounds(uttarkashi_dist)
  .filterDate('2018-03-01', '2018-04-30');

// Step 2: Harmonize Bands Across the Collection
var harmonizeBands = function(image) {
  // Select only the common bands: B1, B2, B3, ..., B12
  var commonBands = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B9', 'B10', 'B11', 'B12'];
  return image.select(commonBands);
};

// Apply harmonization to the ImageCollection
var sentinel2_2018_harmonized = sentinel2_2018.map(harmonizeBands);

// Step 3: Apply median reduction after harmonizing bands
var sentinel2_2018_median = sentinel2_2018_harmonized.median();
print(sentinel2_2018_median, 'Harmonized Sentinel-2 2018 Median Image');

// Step 4: Select Relevant Bands for Classification
var bands = ['B2', 'B3', 'B4', 'B5', 'B8', 'B11', 'B12'];
var sentinel_2018_image = sentinel2_2018_median.select(bands);

// Step 5: Add NDVI as an additional band
var ndvi = sentinel_2018_image.normalizedDifference(['B8', 'B4']).rename('NDVI');
sentinel_2018_image = sentinel_2018_image.addBands(ndvi);

// Print the final image with selected bands and NDVI
print('Sentinel-2 Image with Selected Bands and NDVI', sentinel_2018_image);


// Define the unique land cover categories
var landcover_categories_2018 = [1, 2, 5, 7, 8,9];

// Initialize empty FeatureCollections to store the combined training and test data
var training_data_combined_2018 = ee.FeatureCollection([]);
var test_data_combined_2018 = ee.FeatureCollection([]);

// Split the data for each category
landcover_categories_2018.forEach(function(category) {
  // Filter the FeatureCollection for the current land cover category
  var category_fc = uk_lc_label_2018.filter(ee.Filter.eq('DN', category));
  
  // Add a random value column to the FeatureCollection for random splitting
  var category_fc_random = category_fc.randomColumn('random');
  
  // Split into training and test data for the current category
  var training_data = category_fc_random.filter(ee.Filter.lt('random', 0.7));
  var test_data = category_fc_random.filter(ee.Filter.gte('random', 0.3));
  
  // Merge with the combined training and test data FeatureCollections
  training_data_combined_2018 = training_data_combined_2018.merge(training_data);
  test_data_combined_2018 = test_data_combined_2018.merge(test_data);
});

// Step 4: Print the combined training and test data to the console to verify the split
print('Combined Training Data 2018:', training_data_combined_2018);
print('Combined Test Data 2018:', test_data_combined_2018);


var training_samples_2018 = sentinel_2018_image.sampleRegions({
  collection: training_data_combined_2018,
  properties: ['DN'],
  scale: 10
});

var classifier_2018 = ee.Classifier.smileGradientTreeBoost(100).train({
  features: training_samples_2018,
  classProperty: 'DN',
  inputProperties: bands.concat('NDVI')
});

var classified_image_2018 = sentinel_2018_image.classify(classifier_2018);

// Accuracy assessment for the year 2018


// Step 1: Sample the classified image using the same points as the training samples
var validation_samples_2018 = classified_image_2018.sampleRegions({
  collection: test_data_combined_2018,
  properties: ['DN'],  // This should be the numeric label property
  scale: 10
});


// Step 2: Print the validation samples to ensure they have the 'DN' property and the 'classification' property
print('Validation samples 2018', validation_samples_2018);


// Step 3: Create a confusion matrix
var confusionMatrix_2018 = validation_samples_2018.errorMatrix('DN', 'classification');

// Step 4: Print the confusion matrix
print('Confusion Matrix 2018', confusionMatrix_2018);

// Step 5: Calculate accuracy metrics
print('Overall Accuracy 2018:', confusionMatrix_2018.accuracy());
print('Kappa Coefficient 2018:', confusionMatrix_2018.kappa());
print('Producer\'s Accuracy 2018:', confusionMatrix_2018.producersAccuracy());
print('User\'s Accuracy 2018:', confusionMatrix_2018.consumersAccuracy());



Export.image.toDrive({
  image: classified_image_2018,
  description: 'classified_image_2018_v3',
  fileNamePrefix: 'classified_image_2018_v3',
  region:uttarkashi_dist,
  maxPixels: 196979130,
  scale: 10
})



Map.addLayer(classified_image_2018, {}, 'Sentinel classified 2018');
Map.addLayer(classified_image_2024, {}, 'Sentinel classified 2024');
Map.addLayer(uttarkashi_dist, {color: 'blue'}, 'AOI');

// Center the map on the AOI
Map.centerObject(uttarkashi_dist, 8);  // Adjust zoom level as needed


//////////////

// Define a generic function to calculate area for each class
var calculateClassArea = function(image, roi, classValues, scale) {
  // Function to calculate area for a specific class
  var calculateAreaForClass = function(classValue) {
    // Mask the image for the specific class
    var classMask = image.eq(classValue);
    
    // Calculate pixel area (in square meters)
    var pixelArea = ee.Image.pixelArea();
    
    // Mask the pixel area by the class mask
    var maskedArea = pixelArea.updateMask(classMask);
    
    // Reduce the masked area to the region of interest
    var area = maskedArea.reduceRegion({
      reducer: ee.Reducer.sum(),
      geometry: roi,
      scale: scale,  // Set scale according to image resolution
      maxPixels: 1e13
    });
    
    // Convert area from square meters to square kilometers
    var areaInKm2 = ee.Number(area.get('area')).divide(1e6);
    
    // Return a feature with the class and its area
    return ee.Feature(null, {
      class: classValue,
      area_km2: areaInKm2
    });
  };
  
  // Map over each class to calculate the area for each one
  var areas = classValues.map(function(classValue) {
    return calculateAreaForClass(classValue);
  });
  
  // Convert to a FeatureCollection
  return ee.FeatureCollection(areas);
};


// Define class values and region of interest
var classValues = [1, 2, 5, 7, 8, 9];  // Classes you want to calculate area for
var roi = uttarkashi_dist;  // Define your region of interest
var scale = 10;  // Set scale according to image resolution

// Apply the generic function to the first image
var areaImage1 = calculateClassArea(classified_image_2018, roi, classValues, scale);
print('Area for Image 1 (km²):', areaImage1);

// Apply the generic function to the second image
var areaImage2 = calculateClassArea(classified_image_2024, roi, classValues, scale);
print('Area for Image 2 (km²):', areaImage2);

