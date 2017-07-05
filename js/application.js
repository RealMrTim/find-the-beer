const MAP_CONTAINER_ID = "map-container";
const WIDGET_CONTAINER_ID = "widget-findthebeer-container";

//
// Entry point for client application.
//
class Application {

    static run () {
        // Create a new MapComponent.
        this._mapComponent = new MapComponent(MAP_CONTAINER_ID);
    }
}

// Go!
Application.run();