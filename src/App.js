

import React, { useState } from 'react';
import { lazy, Suspense } from "react";
import { Route, Routes, Router, Navigate } from "react-router-dom";
import Loading from './components/basic/loading';
import 'antd/dist/antd.css';
import './App.css';

const Login = lazy(() => import("./components/login/login"));
const Management = lazy(() => import("./components/management/management"));

const App = () => {

  return (
    <div className="App">
    <Suspense fallback={<Loading />}>
      <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="" element={<Management />} />
          <Route path="/management" element={<Management />} />
      </Routes>
    </Suspense>
    </div>
  );
};

export default App;
