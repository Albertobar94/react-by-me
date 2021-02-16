//
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object" ? child : createTextElement(child)
      )
    }
  };
}
//
function createTextElement(text) {
  // wrap everything that isn’t an object inside its own element and create a special type for them: TEXT_ELEMENT.
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
};
//
function render( element, container ) {
  // Asign to dom a textNode or a HtmlElement depending on what condition is met.
  // const dom = element.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(element.type)
  // ;
  const dom =
    element.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(element.type);
  //assign the element props to the node.
  const isProperty = key => key !== "children";
  Object.keys(element.props)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = element.props[name];
    });
  // Render each child recursively
  element.props.children.forEach(child => render(child, dom));
  container.appendChild(dom);
}
//
const Redact = {
  createElement,
  render,
}
/** @jsx Redact.createElement */
const element = (
  <div style="background: darkblue; color: white; text-align: center">
    <h1>Hello World</h1>
    <h2>from Redact</h2>
  </div>
);
//
const container = document.getElementById("root");
Redact.render(element, container);