// react
import React from 'react';
import ReactDOM from 'react-dom/client';
// redux
import { legacy_createStore as createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import Modal from 'react-modal';
import { loginReducer } from './redux/reducers';
// route
// tailwind
import './index.css';
// page
import {
  ProblemList,
  ProblemCreate,
  ProblemDetail,
  History,
} from './pages/app';
import { Login, Register } from './pages/user';
import { NotFound } from './pages/other';
// component
import { Header } from './components';
// other
import { setToken } from './util/api';

if (Cookies.get('user')) {
  setToken(JSON.parse(Cookies.get('user')).token);
}

Modal.setAppElement('#app');

ReactDOM.createRoot(document.getElementById('app')).render(
  <Provider store={createStore(loginReducer)}>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<ProblemList />} />

        <Route path="/problem/list" element={<ProblemList />} />
        <Route path="/problem/new" element={<ProblemCreate />} />
        <Route path="/problem/:problemId" element={<ProblemDetail />} />
        <Route path="/problem/:problemId/edit" element={<ProblemCreate />} />

        <Route path="/history" element={<History />} />

        <Route path="/user/login" element={<Login />} />
        <Route path="/user/register" element={<Register />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </Provider>,
);
