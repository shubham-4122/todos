import { Build } from 'lib';

const FilterItem = ({ initialState, props, item: { title, href, name } }) =>
  Build({
    initialState,
    props: {
      ...props,
      elementType: 'li',
      classes: 'filter',
      name,
      attributes: {
        'data-root': name,
      },
      childrenElements: [
        {
          elementType: 'a',
          classes: `${initialState.activeTodosFilter === name ? 'selected' : ''}`,
          textContent: title,
          attributes: {
            href,
            'data-el': `${name}-link`,
          },
        },
      ],
    },
    bindings: [
      {
        type: 'classes',
        selector: `[data-el="${name}-link"]`,
        path: `activeTodosFilter`,
        action: ({ elem, stateValue }) =>
          stateValue === name ? elem.classList.add('selected') : elem.classList.remove('selected'),
      },
    ],
    listeners: () => [
      {
        target: `[data-el="${name}-link"]`,
        type: props?.event?.type ?? 'click',
        callback: props?.event?.callback,
      },
    ],
  });

export default FilterItem;
