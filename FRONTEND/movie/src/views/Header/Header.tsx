import React, { useEffect, useState } from 'react';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { Dialog } from '@mui/material';
import { text } from 'stream/consumers';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { memberStore } from '../../stores';
import LoginPage from '../LoginPage/LoginPage';
import SignUpPage from '../SignUpPage/SignUpPage';
import signupOpenStore from '../../stores/signupOpen.store';
import loginOpenStore from '../../stores/loginOpen.store';
import { useCookies } from 'react-cookie';

function Header() {

    const location = useLocation();

    const K_REST_API_KEY = process.env.REACT_APP_K_REST_API_KEY;
    const K_REDIRECT_URI = "http://localhost:3000";
    const kakaoURL = `https://kauth.kakao.com/oauth/logout?client_id=${K_REST_API_KEY}&logout_redirect_uri=${K_REDIRECT_URI}`;


    const {loginOpen, setLoginOpen} = loginOpenStore(); 
    const {signupOpen, setSignupOpen} = signupOpenStore(); 
    const [scrollPosition, setScrollPosition] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const { member,removeMember } = memberStore();
    const [cookies , setCookies] = useCookies();
    const navigate = useNavigate();
    const updateScroll = () => {
        setScrollPosition(window.scrollY || document.documentElement.scrollTop);
    }

    useEffect(()=>{
        window.addEventListener('scroll', updateScroll);
    });

    const loginHandleClickOpen = () => {
        setLoginOpen(true);
    }

    const loginHandleClose = () => {
        setLoginOpen(false);
    }

    const signupHandleClickOpen = () => {
        setSignupOpen(true);
    }

    const signupHandleClose = () => {
        setSignupOpen(false);
    }

    const logOutHandler = async() => {
        const provider = member.provider;
        setCookies('token','',{expires : new Date()});
        removeMember();
        if(provider === '카카오') {
            window.location.href = kakaoURL;
        }
        navigate('/');
    }

    const searchHandler = () => {
        if(searchTerm != null){
            navigate(`/?search=${searchTerm}`);
            setSearchTerm('');
        }
    }
    

    return (
        <div className={`Header ${location.pathname === '/Detailpage' && scrollPosition < 300 ? 'detail-h' : ''}`}>
            <div className='Header-header'>
                <div className='Header-box'>
                    <div className='Header-right'>
                        <div className='Header-rogo'>
                            <Link to={'/'} className='rogo-btn'>movie</Link>
                        </div>
                    </div>
                    <div className='Header-reft'>
                        <div className={`search-box ${location.pathname === '/Detailpage' && scrollPosition < 300 ? 'detail-search-box' : ''}`}>
                            <button type='button' className='search-icon' onClick={() => searchHandler()}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
                            <input type="text" className='search-input' placeholder='검색어를 입력해 주세요' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
                        </div>
                        {
                            (member === null) ? (<>
                                <button className={`login-btn ${location.pathname === '/Detailpage' && scrollPosition < 300 ? 'detail' : ''}`} onClick={loginHandleClickOpen}>로그인</button>
                                <Dialog open= {loginOpen} onClose={loginHandleClose} >
                                    <LoginPage />
                                </Dialog>
                                <button className={`member-btn ${location.pathname === '/Detailpage' ? 'detail' : ''}` } onClick={signupHandleClickOpen}>회원가입</button>
                                <Dialog open= {signupOpen} onClose={signupHandleClose}>
                                    <SignUpPage />
                                </Dialog>
                            </>)
                            :
                            (<>
                                <button className={`logout-btn ${location.pathname === '/Detailpage' && scrollPosition < 300 ? 'detail' : ''}`} onClick={logOutHandler}>로그아웃</button>
                                <Link to={'/MemberInfopage'}>
                                    <button className={`myinfo-btn ${location.pathname === '/Detailpage' ? 'detail' : ''}`}>
                                        <FontAwesomeIcon icon={faGear}/>
                                    </button>
                                </Link>
                            </>)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Header;