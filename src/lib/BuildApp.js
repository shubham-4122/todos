export default class BuildApp {
  constructor({ component, props, store }) {
    this.app = component;
    this.props = props;
    this.store = store;

    store.subscribe('build', this.#build);
    store.subscribe('update', (nextState) => this.updateApp({ nextState }));
  }

  #build = (initialState) => {
    this.updateApp = this.app({ initialState, props: this.props });
  };

  run = () => {
    this.store.dispatchUpdate('build');
  };
}
