import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import CreateAcc from "./Pages/createAcc.jsx";
import ForgotPass from "./Pages/forgotPass.jsx";
import Main from "./Pages/main.jsx";
import ChangePass from "./Pages/changingPass.jsx";
import { UserState, useUser } from "./UserManage.jsx";

const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {
  return (
    <UserState>
      <Router>
        <Routes>
          <Route path="/change-password" element={<ChangePass />} />
          <Route path="/" element={<Main />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/create-account" element={<CreateAcc />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </UserState>
  );
};

export default App;
