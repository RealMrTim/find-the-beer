//
// The application map component. Wraps the ESRI map functionality.
//
class MapComponent {

    constructor (domContainerId) {

        require([
            "esri/WebMap",
            "esri/views/MapView",

            "dojo/domReady!"
        ], 
        
        (WebMap, MapView) => {
            // Load the NZ Brew Web map.
            // http://gbs.maps.arcgis.com/home/item.html?id=1d52abc39f2f412bb3ff0e6407796d7c.
            var map = new WebMap({
                portalItem: {
                    id: "1d52abc39f2f412bb3ff0e6407796d7c"
                }
            });

            new MapView({
                container: domContainerId,
                map: map
            });
        });
    }
}