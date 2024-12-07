# This script takes a folder containing land cover tif files and a shapefile and calculate the area 
# of each class of land cover for each polygon in shapefile.

# Load required libraries
library(terra)
library(sf)
library(exactextractr)

# Load required libraries
library(terra)

# Set folder paths
tif_folder <- "path\\to\\folder"  # Folder containing .tif files
shapefile_path <- "path\\to\\shapefile"  # Path to shapefile

# Read the shapefile
shapefile <- vect(shapefile_path)  # Read shapefile using terra

# Initialize a data frame to store results
results <- data.frame(ID = shapefile$pc11_id)  # Use 'pc11_id' from shapefile as the ID column

# List all .tif files in the folder
tif_files <- list.files(tif_folder, pattern = "\\.tif$", full.names = TRUE)

# Iterate over each .tif file
for (tif_file in tif_files) {
  # Read the MODIS raster
  modis_raster <- rast(tif_file)
  
  # Reproject shapefile to match the CRS of the MODIS raster if necessary
  if (!crs(modis_raster) == crs(shapefile)) {
    shapefile <- project(shapefile, crs(modis_raster))
  }
  
  # Extract unique land cover classes
  landcover_classes <- unique(terra::values(modis_raster))
  landcover_classes <- landcover_classes[!is.na(landcover_classes)]  # Remove NA values
  
  # Process each land cover class
  for (class in landcover_classes) {
    # Filter raster for the current land cover class
    masked_raster <- modis_raster == class  # Create a binary mask for the class
    
    # Extract the masked raster values for each polygon
    area_class <- terra::extract(masked_raster, shapefile, fun = "sum", na.rm = TRUE)
    
    # Convert raster cell counts to area (assuming MODIS 500m resolution)
    area_in_sq_km <- area_class[, 2] * 0.23  # Extract the second column and convert to square km. Here the area of each pixel is 0.23 square kilometers
    
    # Store the result as a new column in the data frame
    column_name <- paste0("Class_", class, "_", tools::file_path_sans_ext(basename(tif_file)))
    results[[column_name]] <- area_in_sq_km
  }
}

# Save the results to a CSV file
write.csv(results, "path\\to\\results.csv", row.names = FALSE)
