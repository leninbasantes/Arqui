import React, { useEffect, useState } from "react";
import { Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getUser } from "./services/auth-service";
import routes from "./routes";
import Navbar from "./navbar.js";
import Login from "./views/Login/index";
import Crear from "./views/CrearUsuario";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuthenticated = getUser();

    if (!isAuthenticated && location.pathname !== "/login") {
      navigate("/login");
    }
  }, []); // <-- Dependencia vacía []

  const renderRoutes = () => {
    if (getUser()) {
      return (
        <>
          <Navbar />
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={<route.component />} />
            ))}
          </Routes>
        </>
      );
    } else {
      return (
        <>
          <Routes>
            <Route key="/crearUsuario" path="/crearUsuario" element={<Crear />} />
            <Route path="*" element={<Navigate to="/login" />} />
            <Route key="/login" path="/login" element={<Login />} />
          </Routes>
        </>
      );
    }
  };

  return (
    <>
      {renderRoutes()}
    </>
  );
};

export default App;
