import { subclass, declared, property } from "esri/core/accessorSupport/decorators";
import { renderable, jsxFactory } from "esri/widgets/support/widget";

import Widget = require("esri/widgets/Widget");
import MapView = require("esri/views/MapView");
import QueryTask = require("esri/tasks/QueryTask");
import Query = require("esri/tasks/support/Query");
import FeatureSet = require("esri/tasks/support/FeatureSet");

// The field ID to query for feature names.
const MAP_QUERY_FIELD_NAME = "Brewery";

// Using ESRI's builtin styles for the button.
const CSS = {
    base: "esri-locate esri-widget-button esri-widget",
    text: "esri-icon-font-fallback-text",

    // I'm dissapointed there's no beer icon in esri's default set.
    icon: "esri-icon-search"
};

/**
 * Custom widget to find the beer.
 * 
 */
@subclass("findTheBeer.widgets.findTheBeer")
class FindTheBeer extends declared(Widget) {

    private _view : MapView;
    private _mapQueryLayerUrl : string;

    /**
     * @arg
     * {
     *    view: esri/views/MapView,
     *    mapQueryLayerUrl: string
     * }
     * 
     */
    constructor(params?: { view: MapView, mapQueryLayerUrl: string}) {
        super();

        this._view = params.view;
        this._mapQueryLayerUrl = params.mapQueryLayerUrl;
    }

    // Finds and locates the beer on the provided MapView.
    private _findTheBeer() {
        this._queryFeatureName("Deep Creek Brewery")
            .then((result : FeatureSet) => {
                if (result.features.length == 0) {
                    console.warn("No features returned from query.");
                } else {
                    // Assuming the first feature is correct.
                    var feature = result.features[0];

                    // Zoom to the passed map feature.
                    this._view.goTo({
                        target: feature.geometry,
                        zoom: 14
                    });
                }
        });
    }

    // Query the map layer for the passed feature name.
    private _queryFeatureName (featureName : string) {

        var task = new QueryTask({
            url: this._mapQueryLayerUrl
        });

        var query = new Query();
        query.where = `${MAP_QUERY_FIELD_NAME} = '${featureName}'`;
        query.returnGeometry = true;

        return task.execute(query)
    }

    render() {
        return (
            <div bind={this}
                    title="Find the Beer!"
                    class={CSS.base}
                    onclick={this._findTheBeer}
                    onkeydown={this._findTheBeer} 
                    role="button" 
                    tabIndex={0}>
                <span aria-hidden="true" class={CSS.icon}></span>
                <span class={CSS.text}>"Find the Beer!"</span>
            </div>
            
        );
    }
}

export = FindTheBeer;
