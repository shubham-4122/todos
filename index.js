import { BuildApp } from 'lib';
import { store } from 'store';
import App from 'src/App';

const app = new BuildApp({
  component: App,
  props: {
    targetSelector: '[data-root="app"]',
    name: 'app',
  },
  store,
});

app.run();
