import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './clustering/pages/Home';

import { Header } from './Header.js';
export const App = () => {
  return (
    <div>
      <Router>
        <Header />
        <div className='App'>
          <Routes>
            <Route path='/' element={<Home/>} />
            <Route path='/clustering' element={<Home/>} />
            <Route render={() => <h4>not found...</h4>} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}