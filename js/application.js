const MAP_CONTAINER_ID = "map-container";

//
// Entry point for client application.
//
class Application {

    static run () {
        // Create a new MapComponent.
        var _mapComponent = new MapComponent(MAP_CONTAINER_ID);
    }
}

// Go!
Application.run();