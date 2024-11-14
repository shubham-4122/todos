import { Main, Header, Footer } from './components';
import { $Component, Build } from 'lib';

const App = ({ initialState, props }) =>
  Build({
    initialState,
    props,
    components: ({ root }) => [
      Header({
        initialState,
        props: {
          targetSelector: root,
          position: 'prepend',
          name: 'header',
          forceUpdate: true,
        },
      }),
      $Component({
        condition: (state) => Object.keys(state.todos).length > 0,
        component: Main,
        state: initialState,
        props: () => ({
          targetSelector: '[data-root="header"]',
          position: 'afterend',
          targetIsSibling: true,
          name: 'main',
        }),
      }),
      $Component({
        condition: (state) => Object.keys(state.todos).length > 0,
        component: Footer,
        state: initialState,
        props: () => ({
          targetSelector: root,
          name: 'footer',
        }),
      }),
    ],
  });

export default App;
