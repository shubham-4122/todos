import { todoActionCheck, todoActionClear, todoActionEditRequest } from 'actions';
import { Build } from 'lib';
import { withStoreHOF } from 'store';
import Button from './Button';

const ListItem =
  (store) =>
  ({ initialState, props, item: { id, title, completed } }) =>
    Build({
      initialState,
      props: {
        ...props,
        name: `todo-${id}`,
        elementType: 'li',
        classes: `${completed ? 'completed' : ''}`,
        attributes: {
          'data-root': `todo-${id}`,
        },
        childrenElements: [
          {
            elementType: 'div',
            classes: 'view',
            attributes: {
              'data-el': `todo-${id}-view`,
            },
            childrenElements: [
              {
                elementType: 'input',
                classes: 'toggle',
                attributes: {
                  id: 'todo-title',
                  type: 'checkbox',
                  ['data-el']: `toggle-todo-${id}`,
                  optional: [
                    {
                      condition: () => completed === true,
                      name: 'checked',
                    },
                  ],
                },
              },
              {
                elementType: 'label',
                textContent: title,
                attributes: {
                  ['data-el']: `label-todo-${id}`,
                },
              },
            ],
          },
        ],
      },
      components: ({ root }) => [
        Button({
          initialState,
          props: {
            targetSelector: root,
            name: `delete-todo-${id}`,
            classes: 'destroy',
            event: {
              callback: () => store.dispatch([() => todoActionClear({ id })]),
            },
          },
        }),
      ],
      bindings: [
        {
          type: 'classes',
          selector: `[data-root="todo-${id}"]`,
          path: `todos[${id}].completed`,
          action: ({ elem, stateValue }) =>
            stateValue ? elem.classList.add('completed') : elem.classList.remove('completed'),
        },
        {
          type: 'attribute',
          selector: `[data-el="toggle-todo-${id}"]`,
          path: `todos[${id}].completed`,
          action: ({ elem, stateValue }) =>
            stateValue ? (elem.checked = true) : (elem.checked = false),
        },
        {
          type: 'text',
          selector: [`[data-el="label-todo-${id}"]`],
          path: `todos[${id}].title`,
        },
      ],
      listeners: () => [
        {
          target: `[data-el="toggle-todo-${id}"]`,
          callback: () => store.dispatch([() => todoActionCheck({ id })]),
        },
        {
          target: `[data-el="label-todo-${id}"]`,
          type: 'dblclick',
          callback: () => store.dispatch([() => todoActionEditRequest({ id })]),
        },
      ],
    });

export default withStoreHOF(ListItem);
