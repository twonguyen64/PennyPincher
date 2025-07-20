import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';

import App from './App';
import Home from './pages/Home';
import Budget from './pages/Budget';
const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => (
  <Router root={App}>
    <Route path="/" component={Home} />
    <Route path="/budget" component={Budget} />
  </Router>
), root);
