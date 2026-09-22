

import "antd/dist/reset.css"; // antd core styles
// import 'ag-grid-community/styles/ag-grid.css' // Core grid CSS, always needed
// import 'ag-grid-community/styles/ag-theme-alpine.css' // Optional theme CSS
// import "@ag-grid-community/styles/ag-grid.css";
// import "@ag-grid-community/styles/ag-theme-alpine.css";
import { ConfigProvider } from "antd";

import './components/kit/vendors/antd/themes/default.less' // default theme antd components
import './components/kit/vendors/antd/themes/dark.less' // dark theme antd components
import 'react-datepicker/dist/react-datepicker.css'
// import "antd/dist/reset.css";
// import "@ag-grid-community/styles/ag-grid.css";
// import "@ag-grid-community/styles/ag-theme-alpine.css"

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserHistory, createHashHistory } from 'history'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import reducers from '@/redux/reducers.js'
import sagas from '@/redux/sagas.js'
import Router from '@/router'
import Localization from "./localization";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-alpine.css";

import "antd/dist/reset.css";
import './global.scss' // app & third-party component styles
export const history = createHashHistory()

const sagaMiddleware = createSagaMiddleware()
// const routeMiddleware = routerMiddleware(history)
const middlewares = [sagaMiddleware]
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
export const store = createStore(reducers(history), composeEnhancers(applyMiddleware(...middlewares)))
sagaMiddleware.run(sagas)
createRoot(document.getElementById('root')).render(
  <ConfigProvider><Provider store={store}>
    <Localization>
      <Router history={history} />
    </Localization>
  </Provider></ConfigProvider>,
)
