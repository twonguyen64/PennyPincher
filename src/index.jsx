import { render } from 'solid-js/web';
import { Router, Route } from '@solidjs/router';

import App from './App';
import Home from './pages/Home';
import Budget from './pages/Budget';
import Savings from './pages/Savings'
import Settings from './pages/Settings';
const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration.scope);
      })
      .catch(error => {
        console.error('SW registration failed:', error);
      });
  });
}

render(() => (
  <Router root={App}>
    <Route path="/" component={Home} />
    <Route path="/budget" component={Budget} />
    <Route path="/savings" component={Savings} />
    <Route path="/settings" component={Settings} />
  </Router>
), root);
