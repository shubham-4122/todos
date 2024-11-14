# todos-components-javascript

## Table of contents

- [Overview](#overview)
  - [Screenshot](#screenshot)
  - [Features](#features)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [Implementation](#implementation)
  - [Useful resources](#useful-resources)
- [Author](#author)

## Overview

### Screenshot

![](./src/assets/live-site-screenshot.png)

### Links

- [Live Site Demo](https://todos-components-javascript.netlify.app/)
- [Code Repository](https://github.com/MariusHor/todos-components-javascript)

### Features
 - Handles the UI creation through the use of *components*.
 - *Conditional rendering* components + giving the ability to use *fallbacks* if rendering conditions are not met.
 - It does not re-render components on state updates but only changes what's necessary through bindings.
 - Components receive a *shouldRemove* signal so that they can clean up after themselves.
 - Separating state logic to the *Store* module that receives state update requests, handles them and then sends the new state to the *App* component that in turn passes it down the tree so that each component can get updated if needed.

## My process

### Built with
 
 - HTML - provided by the MVC Todos template but split re-written inside each component
 - CSS - provided by the MVC Todos template
 - Javascript
 - Lodash
 - Vite for bundling
 - Netlify for deployment


### Implementation

After completing my last Javascript project, the Weather app, I started thinking about how to structure my code in a way similar to popular libraries and frameworks like React or Vue. Even though I didn't use a library or framework for this project, I still wanted to use the same approach of organizing the UI into components that can be updated with new data without having to be re-rendered from scratch.

My main goal was to create reusable UI components, which I knew would require me to keep a few things in mind. Firstly, the components should only render their body HTML once, and subsequent updates should only occur where necessary to avoid unnecessary DOM re-renderings. For this this project I have decided to follow a functional programming paradigm insteat of the usual Object Oriented Programming paradigm that I was usually following for my Javascript projects. All of this meant that while I knew I had to create my components through the use of a function, that function was only supposed to be executed once. This is because the purpose of this component function is to render the initial component UI. Each subsequent update had to happen in a way that would not require a complete re-render of the component but would only require a specific DOM change. The way that I thought about all of these details meant that the solution to achieve such a result was through the effective use of an anonymous function returned by the components main function. I will go more into details down below.

As someone with some experience in React and little experience in Vue, I found it fascinating how easy it is to organize code in these libraries and frameworks, with a clear code structure that allows for each UI part to be contained in its own module as a specific or reusable component. While I know that these libraries do a lot more under the hood, I wanted to achieve something similar using vanilla Javascript to improve my skills.

 - **Component *Creation***

To create components, I implemented a **Build(_config_)** function that takes a config object as a parameter and uses the provided properties for the configuration of the new component.

The base implementation of the **Build** function does the following:

-   It saves a selector reference to the node that will be the root of the component. Roots will always have the following data-attribute: **data-root=_name_**. By saving a reference to this, when attaching other child components to this one, I can just reference the root variable as targetSelector, simplifying things.
-   It passes down the `props` property to the **renderUI** function, which is effectively delegated for the creation and attachment of a new node to the DOM.
-   It instantiates other child components that it receives and stores them inside the `childComponents` array.
-   It stores event listeners into the `eventListeners` array and delegates their creation to the `addListeners` function.
-   NOTE: The `callbacks`, `components`, and `listeners` properties extracted from the config object are actually functions that each return an array of items. If I were to use an array instead of a function, its items would not have been able to receive certain information that can be useful on creation.

```
const  Build = ({ props, bindings = [], components, callbacks, listeners }) => {
	const { name, forceUpdate } = props;
	const  root = `[data-root="${name}"]`;

	renderUI(props);

	const  eventCallbacks = callbacks ? callbacks() : [];
	const  eventListeners = listeners ? listeners({ root, callbacks:  eventCallbacks }) : [];
	const  childComponents = components ? components({ root, callbacks:  eventCallbacks }) : [];  

	addListeners(eventListeners);
}
```
This is all that the **Build(config)** function does initially. It receives a config object and uses its properties to first delegate the creation of the component node and its render to the DOM. Then, if needed, it also adds event listeners, but only after the node has been attached to the DOM.

When creating a component inside its own module, this is how we can use this *Build* function: 

````
const  TodoList = ({ initialState, props }) =>
	Build({
		initialState,
		props: {
			...props,
			elementType:  'ul',
			classes:  'todo-list',
			attributes: {'data-root':  props.name,},
		},
		components: ({ root }) => 
			Button({
				initialState,
				props: {
					targetSelector: root,
					name: `delete-todo-${id}`,
					classes:  'destroy',
					event: {
						callback: () =>  store.dispatch([() =>  todoActionClear({ id })]),
					},
				},
			}),
	})
````


 - **Component *Updates***

If we talk about component updates, we need to discuss how **state** is handled. Components do not hold their own state, but rather receive the initial state as a property of the config object when they are created. This initial state is retrieved from the _Store_ module, where the entire app state resides.

App _updates_ are triggered by the `store.dispatch([...actions])` function, which receives an array of actions. For each action, it will immutably update the state object, and after going through them all, it sends a signal for an update to whoever is listening to the specific _**update**_ event. Although I won't go into specifics here, the first component to receive the updated state is the _**App**_ component. The way I have implemented things, this state object is then passed down to its children and so on until the last component in the tree. **NOTE** that this works for such a small app but it might not prove to be a very scalable solution. To properly make sure that this entire implementation is also scalable, a better way of passing state to each component would be needed.

But how exactly do my components receive this new state on each update? We've discussed the _Build_ function and how it handles the creation of the component, but it also performs another crucial task. Its **return function** acts as a _closure_ and has access to everything the main function does. This includes the _childComponents_

````
return ({ nextState, shouldRemove }) => {
	if (shouldRemove) {
		removeListeners(eventListeners);
		update$$({
			shouldRemove,	
			components: [...childComponents],
		});
		cleanUI({ target:  root });
		return;
	}
	if (!shouldRemove) {
		updateUI({
			nextState,
			bindings,
			forceUpdate,
		});
		update$$({ nextState, components: [...childComponents] });
	}
};
````

All of this happens internally inside the `Build()` function so when creating a new component I don't have to worry about writing any of this code. The nice thing about it is that each component receives the ***nextState*** here and if it doesn't receive a ***shouldRemove*** argument then it goes ahead and updates the UI as well as its child components. But how exactly would it receive a shouldRemove argument? Well if a top component does not meet a certain condition or if a user input determines its removal, this specific component will be marked to be removed from the UI which can only happen through the **cleanUI** function. This information will then get passed to every child components that it holds. Why is this important? Well, for the fact that on components removal it is important to clean up things and remove things like event listeners or setInterval methods that would otherwise continue to run and live inside the memeory, basically creating memory leaks.

Another important thing about component updates is the fact that on creation, I need to provide a `bindings: {}` object. Its purpose is to link certain component html nodes to specific state properties. These bindings would then be used to effectively update the component's UI.

````
bindings: [{
	type:  'classes',
	selector:  `[data-root="todo-${id}"]`,
	path:  `todos[${id}].completed`,
	action: ({ elem, stateValue }) =>
		stateValue ? elem.classList.add('completed') : elem.classList.remove('completed'),
	},
],
````

When a component receives a new `nextState` object, the `Build` function passes it, along with the `bindings` object, to the `updateUI` function. Inside this function, it first retrieves the previous state from the `Store` to compare it with the new state. If the values are the same, the update is canceled unless the component has a `forceUpdate` prop, which overrides the comparison and triggers an update anyway.

If the comparison says that the new state is not equal to the previous state, `updateUI` proceeds to update the component's HTML node by selecting it through the binding selector and setting its innerHTML / classes or attribute to the new state value. This is why the bindings object is so important: it maps state properties to specific DOM elements, allowing the component to efficiently update only the parts of the UI that have changed.

 - **Other details**
The `$Component` and `$$Components` functions are helper functions that simplify the process of defining child components within a component's config object.

So instead of passing child components like this: 
````
components: ({ root }) => [
	Button({
		initialState,
		props: {
			targetSelector:  root,
			name:  `delete-todo-${id}`,
			classes:  'destroy',
			event: {
				callback: () =>  store.dispatch([() =>  todoActionClear({ id })]),
			},
		},
	}),
],
````
I could do this: 
````
components: ({ root }) => [
	$Component({
		condition: (state) =>  Object.keys(state.todos).length > 0,
		component:  Main,
		state:  initialState,
		props: () => ({
			targetSelector:  '[data-root="header"]',
			position:  'afterend',
			targetIsSibling:  true,
			name:  'main',
		}),
		fallback: () => ({
			render: () =>`
				<p data-el="fallback-notes" class="text-center">Start adding some notes</p>
			`,
		}),
	}),
],
````

This is by using the **$Component** function to load a component and it basically acts as an enhancer, giving the ability to specify a certain **condition** that, if not met, the component would not get rendered. If needed, it also allows us to specify a **fallback** element to render on screen if the condition is not met.

The **$$Components** offers the same benefits but it also **handles lists** so if we have an array of items that each require to be rendered on screen through a component, this would be the way to achieve that. We can also pass filtering conditions to it and it handles them nicely.

 - **Final considerations**
While this implementation works well for a small project, it could be improved by refactoring the code or by finding better solutions to reduce the codebase even further. As I build more apps using this approach, I may encounter new situations that require me to fix bugs or adjust the code. Additionally, passing down the state from top to bottom may not be the best choice for larger projects, and saving a deep clone of the state object as the prevState could be improved. Therefore, while this approach is not a substitute for using established solutions like React, Vue, Angular, or Svelte, it has allowed me to practice my JavaScript skills, learning many things along the way.

### Useful resources

- [MDN Javascript documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [React documentation](https://react.dev/)
- [Redux documentation](https://redux.js.org/)
- [Vite documentation](https://vitejs.dev/)


## Author

- Github - [@MariusHor](https://github.com/MariusHor/)
- Frontend Mentor - [@MariusHor](https://www.frontendmentor.io/profile/MariusHor)
