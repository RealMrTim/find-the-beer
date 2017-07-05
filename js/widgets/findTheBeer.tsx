import {subclass, declared, property} from "esri/core/accessorSupport/decorators";

import Widget = require("esri/widgets/Widget");
import { renderable, jsxFactory } from "esri/widgets/support/widget";

@subclass("findTheBeer.widgets.findTheBeer")
class FindTheBeer extends declared(Widget) {
  render() {
    return (
      <p>Hello widget world!</p>
    );
  }
}

export = FindTheBeer;
