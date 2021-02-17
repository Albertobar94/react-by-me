
//
function createElement(type: any, props: any, ...children: any) {
  return {
    type,
    props: {
      ...props,
      children: children.map(( child: any ) =>
        typeof child === "object" ? child : createTextElement(child)
      )
    }
  };
}
//
function createTextElement(text: string) {
  // wrap everything that isn’t an object inside its own element and create a special type for them: TEXT_ELEMENT.
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  }
};
// We keep the part that creates a DOM node in its own function, we are going to use it later.
function createDom(fiber: any){
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type)
​
  updateDom(dom, {}, fiber.props)

  return dom;
}


const isEvent = (key: any): boolean => key.startsWith('on')
const isProperty = (key: any): boolean => key !== "children" && !isEvent(key)
const isNew = (prev: any, next: any ): any => (key: any): boolean => prev[key] !== next[key];
const isGone = (prev: {}, next: {}): any => (key: any): boolean => !(key in next);

function updateDom(dom: any, prevProps: any, nextProps: any){
  // * Remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(
      key => !(key in nextProps) ||
        isNew(prevProps, nextProps)(key)
    )
    .forEach( name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.removeEventListener(
          eventType,
          prevProps[name]
        )
    });
  
  // * Remove old properties
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach( (name: string) => {
      dom[name] = ""
    });
  // * set new or chaged properties
  Object.keys(nextProps)
  .filter(isProperty)
  .filter(isNew(prevProps, nextProps))
  .forEach( (name: any) => {
    dom[name] = nextProps[name]
  })

  // * Add event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name
        .toLowerCase()
        .substring(2)
      dom.addEventListener(
        eventType,
        nextProps[name]
      )
    })
}

//  * ------------------------
//Reconciliation
function commitRoot() {
  deletions?.forEach(commitWork)
  commitWork(wipRoot.child)
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber: any){
  if (!fiber) {
    return
  }
  const domParent = fiber.parent.dom;
  if(
    fiber.effectTag === "PLACEMENT" &&
    fiber.dom != null
  ) {
    domParent.appendChild(fiber.dom)
  } else if (
    fiber.effectTag === "UPDATE" &&
    fiber.dom != null
  ) {
    updateDom(
      fiber.dom,
      fiber.alternate.props,
      fiber.props
    )
  } else if ( fiber.effectTag === "DELETION" ) {
    domParent.removeChild(fiber.dom)
  }

  // domParent.appendChild(fiber.dom)
  commitWork(fiber.child)
  commitWork(fiber.sibling)
}
//  * ------------------------

function render( element: any, container: any ) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  }
  deletions = [];
  nextUnitOfWork = wipRoot;
}

let nextUnitOfWork: any = null;
let wipRoot: any  = null;
let currentRoot: any = null;
let deletions: any[] | null = null;

function workLoop(deadline: any){
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot()
  }

  requestIdleCallback(workLoop)

}
requestIdleCallback(workLoop)

// * ---------------------------
function performUnitOfWork(fiber: any){
  // add a dom node
  if(!fiber.dom) {
    fiber.dom = createDom(fiber)
  }
  // create new fibers
  const elements = fiber.props.children;

  reconcileChildren(fiber, elements)

  // return next unit of work
  if (fiber.child) {
    return fiber.child
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling
    }
    nextFiber = nextFiber.parent
  }
}
//
function reconcileChildren(wipFiber: any, elements: any) {
  let index = 0;
  let prevSibling: any = null;
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child;

  while (index < elements.length || oldFiber != null ) {
    const element = elements[index]
    let newFiber = null;

    const sameType: boolean =
      oldFiber &&
      element &&
      element.type == oldFiber.type;
    if(sameType){
      // * update the node
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      }
    }
    if(element && !sameType){
      // * add this node
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT",
      }
    }
    if(oldFiber && !sameType){
      // * delete the oldFiber's node
      oldFiber.effectTag = "DELETION"
      deletions?.push(oldFiber)
    }
    if (oldFiber) {
      oldFiber = oldFiber.sibling
    }
    if ( index === 0 ){
      wipFiber.child = newFiber
    } else {
      prevSibling!.sibling = newFiber
    }
    prevSibling = newFiber
    index++
  }
}

//
const Redact = {
  createElement,
  render,
}

/** @jsx Redact.createElement */
const container = document.getElementById("root")

const updateValue = (e: any) => {
  rerender(e.target.value)
}

const rerender = (value: string) => {
  const element = (
    <div>
      <input onInput={updateValue} value={value} />
      <h2>Hello {value}</h2>
    </div>
  )
  Redact.render(element, container)
}

rerender("World")



