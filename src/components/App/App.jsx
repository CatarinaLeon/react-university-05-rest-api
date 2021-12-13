import Main from '../Main/Main';
import Sidebar from '../Sidebar/Sidebar';
// import React, { Component } from 'react'

import './App.css';

const App = () => {
  return (
    <div className="main-container">
      <Sidebar />
      <Main />
    </div>
  );
};

export default App;
