import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Pages/Home.jsx';
import Login from './Pages/Login.jsx';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login/>}/>
                <Route path="/home" element={<Home/>}/>
            </Routes>
        </Router>
    );
};

export default App;