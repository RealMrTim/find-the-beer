import { subclass, declared, property } from "esri/core/accessorSupport/decorators";
import { accessibleHandler, join, renderable, jsxFactory } from "esri/widgets/support/widget";

import Widget = require("esri/widgets/Widget");
import MapView = require("esri/views/MapView");
import QueryTask = require("esri/tasks/QueryTask");
import Query = require("esri/tasks/support/Query");
import FeatureSet = require("esri/tasks/support/FeatureSet");

// The field ID to query for feature names.
const MAP_QUERY_FIELD_NAME = "Brewery";

// Using ESRI's builtin styles for the button.
const CSS = {
    base: "esri-layer-list esri-widget",
    text: "esri-icon-font-fallback-text",

    // I'm dissapointed there's no beer icon in esri's default set.
    icon: "esri-icon-search",

    list: "esri-layer-list__list",
    listRoot: "esri-layer-list__list--root",
    listIndependent: "esri-layer-list__list--independent",
    listItem: "esri-layer-list__item",
    listItemContainer: "esri-layer-list__item-container",
    listItemChildren: "esri-layer-list__item--has-children",

    listChildToggle: "esri-layer-list__child-toggle",
    listChildOpened: "esri-layer-list__child-toggle-icon--opened",
    listChildClosed: "esri-layer-list__child-toggle-icon--closed",

    iconDownArrow: "esri-icon-down-arrow",
    iconRightArrow: "esri-icon-right-triangle-arrow",

    action: "esri-layer-list__item-action",
};

// Expected format of arguments supplied to our widget.
type WidgetParams = { 
    // MapView for the widget to control.
    view: MapView,

    // Layer service for the widget to operate on.
    mapQueryLayerUrl: string
};

/**
 * Custom widget to find the beer.
 * 
 */
@subclass("tim.widgets.FindTheBeer")
class FindTheBeer extends declared(Widget) {

    private _view : MapView;
    private _mapQueryLayerUrl : string;

    private _featureListExpanded = false;
    private _featureListLoaded = false;

    private _layerFeatureSet : FeatureSet;


    constructor(params? : WidgetParams) {
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
                        zoom: 15
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

    // Queries for the entire feature list.
    loadFeatureList () {
        var task = new QueryTask({
            url: this._mapQueryLayerUrl
        });

        var query = new Query();
        query.outFields = ["OBJECTID", "Brewery"];
        query.where = '1 = 1'; // More elegent way to do this?

        task.execute(query).then((result : FeatureSet) => {
            this._layerFeatureSet = result;
            this._featureListLoaded = true;
            
            // Force the widget to re-render the view now that we have features to show.
            this.renderNow();
        });
    }

    render() {
        const content = (
            <ul class={join(CSS.list, CSS.listRoot, CSS.listIndependent)} role="tree">
                <li class={join(CSS.listItem, CSS.listItemChildren)} role="treeitem">
                    <div class={CSS.listItemContainer}>
                        <span
                                data-item={this}
                                class={CSS.listChildToggle}
                                role="button"
                                tabindex="0"

                                onclick={this._toggleFeatureListVisible} 
                                onkeydown={this._toggleFeatureListVisible}
                                
                                aria-expanded={this._featureListExpanded ? "true" : "false"}>
                            <span aria-hidden="true" class={join(CSS.listChildClosed, CSS.iconRightArrow)} />
                            <span aria-hidden="true" class={join(CSS.listChildOpened, CSS.iconDownArrow)} />
                        </span>
                        <p>Layer features</p>
                    </div>
                    <ul class={CSS.list} role="group" hidden={this._featureListExpanded ? null : true}>
                        {
                            this._featureListLoaded ?
                                this._layerFeatureSet.features.map((item, key) => 
                                    <li key={item.attributes["OBJECTID"]} class={join(CSS.listItem, CSS.action)} role="button">
                                        <div class={CSS.listItemContainer}>
                                            {item.attributes["Brewery"]}
                                        </div>
                                    </li>
                                ) : (
                                    this._featureListLoaded && this._layerFeatureSet.features.length == 0 
                                        ? 'No features found on layer' 
                                        : 'Loading features...'
                                    )
                        }
                    </ul>
                </li>
            </ul>
        );

        return (
            <div class={CSS.base}>{content}</div>            
        );
    }

    // Toggle the visibility of the feature list.
    @accessibleHandler()
    private _toggleFeatureListVisible(event: Event): void {
        const node = event.currentTarget as Element;
        const item = node["data-item"];

        // Ask the widget to load the feature list once on first expansion.
        if (!item._featureListLoaded) {
            item.loadFeatureList();
        }

        item._featureListExpanded = !item._featureListExpanded;
    }
}

export = FindTheBeer;