import React from 'react';
import ReactDOM from 'react-dom';
import 'es5-shim';
import 'es6-shim';
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
import { createMuiTheme } from 'material-ui/styles';

// ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
// registerServiceWorker();

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()

// Now you can dispatch navigation actions from anywhere!
// store.dispatch(push('/foo'))

const theme = createMuiTheme({});

ReactDOM.render(
  <Provider store={store}>
    { /* ConnectedRouter will use the store from Provider automatically */ }
    <MuiThemeProvider theme={theme}>
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
// ReactDOM.render(
//   <MuiThemeProvider><App /></MuiThemeProvider>,
//   document.getElementById('root')
// );
registerServiceWorker();
