import { filtersActionSwitch } from 'actions';
import { $$Components, Build } from 'lib';
import { withStoreHOF } from 'store';
import FilterItem from './FilterItem';

const Filters =
  (store) =>
  ({ initialState, props }) =>
    Build({
      initialState,
      props: {
        ...props,
        elementType: 'ul',
        classes: 'filters',
        attributes: {
          'data-root': props.name,
        },
      },
      components: ({ root }) => [
        $$Components({
          component: FilterItem,
          itemsList: (state) => state.filtersProps,
          state: initialState,
          props: ({ item }) => ({
            targetSelector: root,
            event: {
              type: 'click',
              callback: () => store.dispatch([() => filtersActionSwitch({ filter: item.name })]),
            },
          }),
        }),
      ],
    });

export default withStoreHOF(Filters);
