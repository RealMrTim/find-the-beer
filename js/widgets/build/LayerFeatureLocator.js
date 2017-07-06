var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "esri/core/accessorSupport/decorators", "esri/widgets/support/widget", "esri/widgets/Widget", "esri/tasks/QueryTask", "esri/tasks/support/Query"], function (require, exports, decorators_1, widget_1, Widget, QueryTask, Query) {
    "use strict";
    // Using ESRI's builtin styles for the button.
    var CSS = {
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
    /**
     * Displays features of a layer and locates them when clicked.
     *
     */
    var LayerFeatureLocator = (function (_super) {
        __extends(LayerFeatureLocator, _super);
        function LayerFeatureLocator(params) {
            var _this = _super.call(this) || this;
            _this._featureListExpanded = false;
            _this._featureListLoaded = false;
            _this._view = params.view;
            _this._mapQueryLayerUrl = params.mapQueryLayerUrl;
            _this._widgetLabel = params.widgetLabel;
            _this._featureIdField = params.featureIdField;
            _this._featureLabelField = params.featureLabelField;
            return _this;
        }
        //
        // Queries for the entire feature list.
        //
        LayerFeatureLocator.prototype.loadFeatureList = function () {
            var _this = this;
            var task = new QueryTask({
                url: this._mapQueryLayerUrl
            });
            var query = new Query();
            query.outFields = [this._featureIdField, this._featureLabelField];
            query.where = '1 = 1'; // More elegent way to do this?
            task.execute(query).then(function (result) {
                _this._layerFeatureSet = result;
                _this._featureListLoaded = true;
                // Force the widget to re-render the view now that we have features to show.
                _this.renderNow();
            });
        };
        LayerFeatureLocator.prototype.render = function () {
            var _this = this;
            var content = (widget_1.jsxFactory.createElement("ul", { class: widget_1.join(CSS.list, CSS.listRoot, CSS.listIndependent), role: "tree" },
                widget_1.jsxFactory.createElement("li", { class: widget_1.join(CSS.listItem, CSS.listItemChildren), role: "treeitem" },
                    widget_1.jsxFactory.createElement("div", { class: CSS.listItemContainer },
                        widget_1.jsxFactory.createElement("span", { "data-item": this, class: CSS.listChildToggle, role: "button", tabindex: "0", onclick: this._toggleFeatureListVisible, onkeydown: this._toggleFeatureListVisible, "aria-expanded": this._featureListExpanded ? "true" : "false" },
                            widget_1.jsxFactory.createElement("span", { "aria-hidden": "true", class: widget_1.join(CSS.listChildClosed, CSS.iconRightArrow) }),
                            widget_1.jsxFactory.createElement("span", { "aria-hidden": "true", class: widget_1.join(CSS.listChildOpened, CSS.iconDownArrow) })),
                        widget_1.jsxFactory.createElement("p", null, this._widgetLabel)),
                    widget_1.jsxFactory.createElement("ul", { class: CSS.list, role: "group", hidden: this._featureListExpanded ? null : true }, this._featureListLoaded ?
                        this._layerFeatureSet.features.map(function (item, key) {
                            return widget_1.jsxFactory.createElement("li", { key: item.getAttribute(_this._featureIdField), "data-item": item, parent: _this, da: true, class: widget_1.join(CSS.listItem, CSS.action), role: "button", onclick: _this._locateFeature },
                                widget_1.jsxFactory.createElement("div", { class: CSS.listItemContainer }, item.getAttribute(_this._featureLabelField)));
                        }) : (this._featureListLoaded && this._layerFeatureSet.features.length == 0
                        ? 'No features found on layer'
                        : 'Loading features...')))));
            return (widget_1.jsxFactory.createElement("div", { class: CSS.base }, content));
        };
        //
        // Toggle the visibility of the feature list.
        //
        LayerFeatureLocator.prototype._toggleFeatureListVisible = function (event) {
            var node = event.currentTarget;
            var item = node["data-item"];
            // Ask the widget to load the feature list once on first expansion.
            if (!item._featureListLoaded) {
                item.loadFeatureList();
            }
            item._featureListExpanded = !item._featureListExpanded;
        };
        //
        // Query the map layer for the passed feature ID.
        //
        LayerFeatureLocator.prototype._locateFeature = function (event) {
            var node = event.currentTarget;
            var item = node["data-item"];
            var parent = node["parent"];
            var task = new QueryTask({
                url: parent._mapQueryLayerUrl
            });
            var query = new Query();
            query.where = parent._featureIdField + " = '" + item.getAttribute(parent._featureIdField) + "'";
            query.returnGeometry = true;
            task.execute(query)
                .then(function (result) {
                if (result.features.length == 0) {
                    console.warn("No features returned from query.");
                }
                else {
                    // Assuming the first feature is correct.
                    var feature = result.features[0];
                    // Zoom to the passed map feature.
                    parent._view.goTo({
                        target: feature.geometry,
                        zoom: 14
                    });
                }
            });
        };
        __decorate([
            widget_1.accessibleHandler()
        ], LayerFeatureLocator.prototype, "_toggleFeatureListVisible", null);
        __decorate([
            widget_1.accessibleHandler()
        ], LayerFeatureLocator.prototype, "_locateFeature", null);
        LayerFeatureLocator = __decorate([
            decorators_1.subclass("tim.widgets.LayerFeatureLocator")
        ], LayerFeatureLocator);
        return LayerFeatureLocator;
    }(decorators_1.declared(Widget)));
    return LayerFeatureLocator;
});
