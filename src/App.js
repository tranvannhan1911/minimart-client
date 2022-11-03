import React, { useEffect, useState } from 'react';
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from './components/basic/loading';
import 'antd/dist/antd.min.css';
import './App.css';

const ForgotPassword = lazy(() => import("./components/account/forgot"));
const Login = lazy(() => import("./components/account/login"));
const ChangePassword = lazy(() => import("./components/account/change_password"));

const Management = lazy(() => import("./components/management/management"));

const App = () => {

  return (
    <div className="App">
    <Suspense fallback={<Loading />}>
      <Routes>
          <Route path="dang-nhap" element={<Login />} />
          <Route path="" element={<Login />} />
          <Route path="quen-mat-khau" element={<ForgotPassword />} />
          <Route path="doi-mat-khau" element={<ChangePassword />} />
          <Route path="quan-ly/*" element={<Management />} />
      </Routes>
    </Suspense>
    </div>
  );
};

export default App;
