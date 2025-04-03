// https://www.youtube.com/watch?v=PQnbtnsYUho&t=217s

import React from 'react'

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import Home from './pages/Dashboard/Home';
import Income from './pages/Dashboard/Income';
import Expense from './pages/Dashboard/Expense';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Root />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/income" element={<Income />} />
          <Route path="/expense" element={<Expense />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;

const Root = () => {
  /*
  Usage of !!:
  1. Convert to 'false' if 'null'
  2. Convert to 'true' if 'not null'
  
  The first '!' (logical NOT) operator will convert the value into a boolean, but it inverts the value:
  *  For example - If the value is truthy (e.g., a non-empty string, a number, etc.), ! converts it to false.
  The second ! then reverts the inversion, ultimately giving you:
  *  true if the value was truthy (i.e., if "token" exists in localStorage and is not an empty string).
  */
 
 // Check if token exists in localStorage
  const isAuthenticated = !!localStorage.getItem("token");

  // Redirect to dashboard if authenticated, otherwise to login
  return isAuthenticated? <Navigate to="/dashboard" /> : <Navigate to="/login" />;
}
