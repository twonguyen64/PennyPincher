import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';

import App from './App';
import EmptyPage from './pages/EmptyPage';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

render(() => (
  <Router root={App}>
    <Route path="/" component={EmptyPage} />
    <Route path="/income" component={Income} />
    <Route path="/expenses" component={Expenses} />
  </Router>
), root);
