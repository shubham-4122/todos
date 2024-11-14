import { formActionSetInput, todoActionAdd, todoActionEditSave } from 'actions';
import { Build } from 'lib';
import { withStoreHOF } from 'store';
import { getEl } from 'utils';

const Header =
  (store) =>
  ({ initialState, props }) =>
    Build({
      initialState,
      props: {
        ...props,
        elementType: 'header',
        classes: 'header',
        attributes: {
          'data-root': props.name,
        },
        childrenElements: [
          {
            elementType: 'h1',
            textContent: 'todos',
          },
          {
            elementType: 'form',
            attributes: {
              'data-el': 'form',
            },
            childrenElements: [
              {
                elementType: 'input',
                classes: 'new-todo',
                attributes: {
                  placeholder: 'What needs to be done?',
                  autofocus: '',
                  ['data-state-prop']: 'form-input',
                },
              },
            ],
          },
        ],
      },
      bindings: [
        {
          type: 'input',
          selector: ['[data-state-prop="form-input"]'],
          path: 'form.input.value',
          action: ({ elem, stateValue }) => {
            elem.value = stateValue;
            elem.focus();
          },
        },
      ],
      listeners: () => [
        {
          target: '[data-el="form"]',
          type: 'submit',
          callback: (event) => {
            event.preventDefault();
            let input = getEl('[data-state-prop="form-input"]');
            const { form } = store.getState();

            const inputValue = input.value.trim();

            if (form?.isUpdating && inputValue.length) {
              store.dispatch([() => todoActionEditSave({ title: inputValue })]);
            }

            if (!form?.isUpdating && inputValue.length) {
              store.dispatch([
                () => todoActionAdd({ title: inputValue, completed: false }),
                () => formActionSetInput({ value: '' }),
              ]);
            }
          },
        },
      ],
    });

export default withStoreHOF(Header);
