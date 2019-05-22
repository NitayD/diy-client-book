import React, { PureComponent } from 'react';
import { Switch, Route, Redirect } from 'react-router'
import { connect } from 'react-redux'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import Header from './app/includes/header';
import './App.css';

import Login from './app/pages/login'

import Main from './app/pages/main'
import OldMC from './app/pages/oldmc'
import Calendar from './app/pages/calendar'
import CreateMC from './app/pages/create/mc'
import CreateProject from './app/pages/create/project'
import Inventory from './app/pages/create/inventory'
import InventoryToPrint from './app/pages/print/inventory'
import MCToPrint from './app/pages/print/mc'
import MasterClass from './app/pages/mc'

import Clients from './app/pages/clients'


class App extends PureComponent {
  checkToken(component) {
    if (this.props.token)
      return component
    else return () => <Redirect to="/login"/>
  }
  render() {
    const checkToken = this.checkToken.bind(this)
    return (
      <>
        <Header/>
        <Switch>
          <Route exact path='/login' component={Login} />
          <Route exact path='/' component={checkToken(Main)} />
          <Route exact path='/mc/old' component={checkToken(OldMC)} />
          <Route path='/calendar' component={checkToken(Calendar)} />
          <Route path='/mc' component={checkToken(MasterClass)} />
          <Route path='/edit/mc' component={checkToken(CreateMC)} />
          <Route path='/create/mc' component={checkToken(CreateMC)} />
          <Route path='/create/project' component={checkToken(CreateProject)} />
          <Route path='/create/inventory' component={checkToken(Inventory)} />
          <Route path='/print/inventory' component={checkToken(InventoryToPrint)} />
          <Route path='/print/mc' component={checkToken(MCToPrint)} />
          <Route path='/clients' component={checkToken(Clients)} />
        </Switch>
        <ToastContainer
          position="top-right"
          autoClose={8000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
      </>
    )
  }
}
const mapStateToProps = ({ login }) => ({
  ...login
})

export default connect(mapStateToProps)(App)
