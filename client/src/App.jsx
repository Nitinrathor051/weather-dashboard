import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {

  const token = localStorage.getItem("token");

  return (
    <Routes>

      {/* AUTH ROUTES */}
      <Route
        path="/"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* PROTECTED ROUTE */}
      <Route
        path="/dashboard"
        element={
          token
            ? <Dashboard />
            : <Navigate to="/" />
        }
      />

    </Routes>
  );
}

export default App;
