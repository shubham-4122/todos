import { todoClearCompleted } from 'actions';
import { $Component, Build } from 'lib';
import { withStoreHOF } from 'store';
import Button from './Button';
import Filters from './Filters';

const Footer =
  (store) =>
  ({ initialState, props }) =>
    Build({
      initialState,
      props: {
        ...props,
        elementType: 'footer',
        classes: 'footer',
        attributes: {
          'data-root': props.name,
        },
        childrenElements: [
          {
            elementType: 'span',
            classes: 'todo-count',
            textContent: `${
              Object.keys(initialState.todos).length === 1 ? ' item' : ' items'
            } left`,
            childrenElements: [
              {
                elementType: 'strong',
                textContent: `${
                  Object.values(initialState.todos).filter((todo) => !todo.completed).length
                }`,
                position: 'prepend',
                attributes: {
                  'data-el': 'todos-count',
                },
              },
            ],
          },
        ],
      },
      bindings: [
        {
          type: 'text',
          selector: ['[data-el="todos-count"]'],
          path: 'todos',
          action: ({ elem, stateValue }) =>
            (elem.textContent = `${
              Object.values(stateValue).filter((todo) => !todo.completed).length
            }`),
        },
      ],
      components: ({ root }) => [
        Filters({
          initialState,
          props: {
            targetSelector: root,
            name: 'filters',
          },
        }),
        $Component({
          condition: (state) => Object.values(state.todos).some((todo) => todo.completed),
          component: Button,
          state: initialState,
          props: () => ({
            name: 'clear-completed',
            targetSelector: root,
            classes: 'clear-completed',
            title: 'Clear completed',
            event: {
              type: 'click',
              callback: () => store.dispatch([() => todoClearCompleted()]),
            },
          }),
        }),
      ],
    });

export default withStoreHOF(Footer);
