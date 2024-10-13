import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './views/Main/Main';
import Header from './views/Header/Header';
import Detailpage from './views/Detailpage/Detailpage';
import ComentAllpage from './views/ComentAllpage/ComentAllpage';
import ComentDetailpage from './views/ComentDetailpage/ComentDetailpage';
import Kakao from './views/Kakao/Kakao';
import LoginPage from './views/LoginPage/LoginPage';
import SignUpPage from './views/SignUpPage/SignUpPage';
import ComentWritePage from './views/ComentWritePage/ComentWritePage';
import MemberInfopage from './views/MemberInfopage/MemberInfopage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path='/' element= {<Main />} />
          <Route path='Detailpage' element= {<Detailpage />} />
          <Route path='ComentAllpage' element= {<ComentAllpage />} />
          <Route path='ComentDetailpage' element= {<ComentDetailpage />} />
          <Route path='Kakao' element= {<Kakao />} />
          <Route path='LoginPage' element= {<LoginPage />} />
          <Route path='SignUpPage' element= {<SignUpPage />} />
          <Route path='ComentWritePage' element= {<ComentWritePage />} />
          <Route path='MemberInfopage' element= {<MemberInfopage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
