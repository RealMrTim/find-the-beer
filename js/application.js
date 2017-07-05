const MAP_CONTAINER_ID = "map-container";

//
// Entry point for client application.
//
class Application {

    static run () {
        // Create a new MapComponent.
        this._mapComponent = new MapComponent(MAP_CONTAINER_ID);
    }

    static findTheBeer () {
        var query = this._mapComponent.queryFeatureName("Deep Creek Brewery");

        query.then((result) => {
            if (result.features.length == 0) {
                console.warn("No features returned from query.");
            } else {
                // Assuming the first feature is correct.
                var feature = result.features[0];

                // Ask the map component to zoom to this feature.
                this._mapComponent.zoomToFeature(feature);
            }
        });
    }
}

// Go!
Application.run();