"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//
function createElement(type, props) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return {
    type: type,
    props: _objectSpread(_objectSpread({}, props), {}, {
      children: children.map(function (child) {
        return _typeof(child) === "object" ? child : createTextElement(child);
      })
    })
  };
} //


function createTextElement(text) {
  // wrap everything that isn’t an object inside its own element and create a special type for them: TEXT_ELEMENT.
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  };
}

; //

function render(element, container) {
  // Asign to dom a textNode or a HtmlElement depending on what condition is met.
  // const dom = element.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type)
  // ;
  var dom = element.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type); //assign the element props to the node.

  var isProperty = function isProperty(key) {
    return key !== "children";
  };

  Object.keys(element.props).filter(isProperty).forEach(function (name) {
    dom[name] = element.props[name];
  }); // Render each child recursively

  element.props.children.forEach(function (child) {
    return render(child, dom);
  });
  container.appendChild(dom);
} //


var Redact = {
  createElement: createElement,
  render: render
};
/** @jsx Redact.createElement */

var element = Redact.createElement("div", {
  style: "background: darkblue; color: white; text-align: center"
}, Redact.createElement("h1", null, "Hello World"), Redact.createElement("h2", null, "from Redact")); //

var container = document.getElementById("root");
Redact.render(element, container);