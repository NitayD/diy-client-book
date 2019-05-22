import React from 'react'
import ReactDom from 'react-dom'
import { BrowserRouter } from "react-router-dom"
import { Provider } from 'react-redux'

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

import createStore from './store'

import App from './App'
import * as serviceWorker from './serviceWorker'

const store = createStore()

ReactDom.render(
  <Provider store={store}>
    <style>{`
      a, a:hover { color: inherit; text-decoration: inherit; }
      @media screen and (min-width: 1200px) {
        .control_btns .btn:not(:first-child) {
          margin-left: .5em;
        }
      }
      @media screen and (max-width: 1199px) {
        .control_btns .btn:not(:first-child) {
          display: block;
          margin-top: .5em;
        }
        .control_btns .btn-toolbar {
          display: flex;
          flex-direction: column;
        }
      }
    `}</style>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register()
