import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GroupList from './GroupList';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import GroupEdit from './GroupEdit';

const App = () => {
  return (
    <div>
      <ToastContainer />
    <Router>
      <Routes>
        <Route exact path="/" element={<Home/>}/>
      </Routes>
    </Router>
    </div>
    
  )
}

export default App;