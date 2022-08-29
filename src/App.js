

import React, { useState } from 'react';
import { lazy, Suspense } from "react";
import { Route, Routes, Router, Navigate } from "react-router-dom";
import Loading from './components/basic/loading';
import 'antd/dist/antd.css';
import './App.css';

const ForgotPassword = lazy(() => import("./components/account/forgot"));
const Login = lazy(() => import("./components/account/login"));
const Management = lazy(() => import("./components/management/management"));

const App = () => {

  return (
    <div className="App">
    <Suspense fallback={<Loading />}>
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/management" element={<Management />} />
      </Routes>
    </Suspense>
    </div>
  );
};

export default App;
