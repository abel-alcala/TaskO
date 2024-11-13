import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Pages/Home.jsx';
import Login from './Pages/Login.jsx';
import CreateAcc from './Pages/createAcc.jsx';
import ForgotPass from './Pages/forgotPass.jsx';
import Main from './Pages/main.jsx';

const App = () => {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/create-account" element={<CreateAcc />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    );
};

export default App;