import { Build } from 'lib';

const Button = ({ initialState, props }) =>
  Build({
    initialState,
    props: {
      ...props,
      elementType: 'button',
      classes: `${props?.classes ?? ''}`,
      attributes: {
        'data-root': props.name,
        'data-state-prop': props.name,
        type: props?.type ?? 'button',
        ...props.attributes,
      },
      textContent: props.title,
    },
    listeners: ({ root }) => [
      {
        target: root,
        type: props?.event?.type ?? 'click',
        callback: props?.event?.callback,
      },
    ],
    bindings: [
      {
        type: props.bindingPath?.type,
        selector: [`[data-state-prop="${props.name}"]`],
        path: props.bindingPath?.path,
        action: props.bindingPath?.action,
      },
    ],
  });

export default Button;
