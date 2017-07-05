//
// The application map component. Wraps the ESRI map functionality.
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
            // Load the NZ Brew Web map.
            // http://gbs.maps.arcgis.com/home/item.html?id=1d52abc39f2f412bb3ff0e6407796d7c.
            var map = new WebMap({
                portalItem: {
                    id: "1d52abc39f2f412bb3ff0e6407796d7c"
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
        });
    }
}