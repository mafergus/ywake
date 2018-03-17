import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import AdminPage from './AdminPage';
import registerServiceWorker from './registerServiceWorker';
import store from './store';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { Route } from 'react-router';
import { ConnectedRouter } from 'react-router-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

// ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
// registerServiceWorker();

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()

// Now you can dispatch navigation actions from anywhere!
// store.dispatch(push('/foo'))

ReactDOM.render(
  <Provider store={store}>
    { /* ConnectedRouter will use the store from Provider automatically */ }
    <MuiThemeProvider>
      <ConnectedRouter history={history}>
        <div style={{ height: "100%", width: "100%" }}>
          <Route exact path="/" component={App}/>
          <Route path="/admin" component={AdminPage}/>
        </div>
      </ConnectedRouter>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
