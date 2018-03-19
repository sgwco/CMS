import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <Route exact path='/admin' component={Admin} />
          <Route exact path='/about' component={About} />
        </div>
      </BrowserRouter>
    );
  }
}

const Admin = () => (
  <div>
    <h2>Admin</h2>
  </div>
);

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

export default App;
