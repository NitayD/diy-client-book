import React, { Component } from 'react';
import { Switch, Route } from 'react-router'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'

import Header from './app/includes/header';
import './App.css';

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


class App extends Component {
  render() {
    return (
      <>
        <Header/>
        <Switch>
          <Route exact path='/' component={Main} />
          <Route exact path='/mc/old' component={OldMC} />
          <Route path='/calendar' component={Calendar} />
          <Route path='/mc' component={MasterClass} />
          <Route path='/edit/mc' component={CreateMC} />
          <Route path='/create/mc' component={CreateMC} />
          <Route path='/create/project' component={CreateProject} />
          <Route path='/create/inventory' component={Inventory} />
          <Route path='/print/inventory' component={InventoryToPrint} />
          <Route path='/print/mc' component={MCToPrint} />
          <Route path='/clients' component={Clients} />
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
    );
  }
}

export default App;
