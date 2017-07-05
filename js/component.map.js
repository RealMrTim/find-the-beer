// ArcGIS Webmap ID (http://gbs.maps.arcgis.com/home/item.html?id=1d52abc39f2f412bb3ff0e6407796d7c)
const MAP_ID = "1d52abc39f2f412bb3ff0e6407796d7c";
// Map feature service endpoint.
const MAP_QUERY_LAYER_URL = "http://services.arcgis.com/XTtANUDT8Va4DLwI/arcgis/rest/services/NZBrewLocation/FeatureServer/0";
// The field ID to query for feature names.
const MAP_QUERY_FIELD_NAME = "Brewery"

//
// The application map component. Currently wraps ArcGIS map functionality.
//
class MapComponent {

    constructor (domContainerId) {

        require([
            "esri/WebMap",
            "esri/views/MapView",
            "esri/widgets/ScaleBar",

            "dojo/domReady!"
        ], (
            WebMap, 
            MapView,
            ScaleBar
            
        ) => {
            // Load the webmap from the ArcGIS services.
            var map = new WebMap({
                portalItem: {
                    id: MAP_ID
                }
            });

            var view = new MapView({
                container: domContainerId,
                map
            });

            // Add the scalebar widget to our map view.
            var scaleBar = new ScaleBar({
                view,
                unit: "dual"
            });

            view.ui.add(scaleBar, {
                position: "bottom-left"
            });

            this._view = view;
        });
    }

    // Query the map layer for the passed feature name.
    queryFeatureName (featureName) {
        return new Promise((resolve, reject) => {
            require([
                "esri/tasks/QueryTask",
                "esri/tasks/support/Query",
            ],
            
            (QueryTask, Query) => {

                var task = new QueryTask({
                    url: MAP_QUERY_LAYER_URL
                });
                
                var query = new Query();
                query.where = `${MAP_QUERY_FIELD_NAME} = '${featureName}'`;
                query.returnGeometry = true;

                task.execute(query).then((result) => resolve(result));
            });
        });
    }

    // Zoom to the passed map feature.
    zoomToFeature (feature) {
        this._view.goTo({
            target: feature.geometry,
            zoom: 14
        });
    }
}