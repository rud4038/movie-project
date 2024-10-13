import React, { useEffect, useState } from 'react';
import './MemberInfopage.css';
import { Dialog } from '@mui/material';
import { memberStore } from '../../stores';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';


function MemberInfopage() {
    const [nameUpdateOpen,setNameUpdateOpen] = useState<boolean>(false);
    const [memberDeleteOpen,setMemberDeleteOpen] = useState<boolean>(false);
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [cookies , setCookies] = useCookies();
    const [password,setPassword] = useState<string>('');
    const {member,setMember,removeMember} = memberStore();
    const navigate = useNavigate();
    
    useEffect(() => {
        if(member === null){
            navigate('/')
        }
        getEmail()
    },[])

    const getEmail = () => {
        axios.get(`http://localhost:4040/member/getEmail/${member.id}`)
        .then((response) => {
            setEmail(response.data.data)
        })
    }

    const nameCheck = () => {
        const num = name.length;
        if (num > 1 || num === 0) return true;
        return false;
    };

    const NameUpdate = async () => {
        const result = nameCheck()
        if(!result || name === null){
            alert('변경하실 이름을 다시확인해주세요.')
        }
        const id = member.id
        const memberDto = {
            id,
            name
        }
        axios.post('http://localhost:4040/coment/nameUpdate',memberDto)
        .then((response) => {
            const check = response.data.result;
            if(check){
                axios.post('http://localhost:4040/member/nameUpdate',memberDto)
                .then((response) => {
                    alert(response.data.message)
                    if(response.data.result){
                        setMember(response.data.data)
                        setNameUpdateOpen(false)
                    }
                })
            }
        })
    }

    const memberDelete = async() => {
        const id = member.id;
        const provider = member.provider
        const DeleteDto = {
            id,
            provider,
            password,
            email
        }

        axios.post('http://localhost:4040/member/delete',DeleteDto)
        .then(async (response) =>{
            if(response.data.result){
                await recomendationDelete()
                await comentDelete()
                removeMember();
                setCookies('token','',{expires : new Date()});
                navigate('/');
            }
            alert(response.data.message)
        })
    }

    const recomendationDelete = () => {
        axios.get(`http://localhost:4040/coment/recomendationAllDelete/${member.id}`)
    }

    const comentDelete = () => {
        axios.get(`http://localhost:4040/coment/comentAllDelete/${member.id}`)
    }

    
    return (
        <div className='MemberInfo-background-box'>
            <div className='MemberInfo-con-box'>
                <div className='MemberInfo-title'>회원정보</div>
                <div className='MemberInfo-update-box'>
                    <div className='MemberInfo-email-box'>
                        <div className='MemberInfo-email-head'>이메일</div>
                        <div className='MemberInfo-email-div'>
                            <div className='MemberInfo-email'>{email}</div>
                        </div>
                    </div>
                    <div className='MemberInfo-name-box'>
                    <div className='MemberInfo-email-head'>이름</div>
                        <div className='MemberInfo-name-flex'>
                            <div className='MemberInfo-name'>{member?.name}</div>
                            <button className='MemberInfo-name-btn' onClick={() => setNameUpdateOpen(true)}>수정</button>
                            <Dialog open={nameUpdateOpen} PaperProps={{style : {borderRadius : "8px", width: "280px"}}} >
                                <div className='MemberInfo-name-update-box'>
                                    <div className='MemberInfo-name-update-size'>
                                        <div className='MemberInfo-name-update-title' >이름 수정</div>
                                        <div className='MemberInfo-name-update-con'>수정할 이름을 입력해주세요</div>
                                        <input type="text"  className='MemberInfo-name-update-input' onChange={(e) => setName(e.target.value)}/>
                                        {nameCheck() ? (
                                            <></>
                                        ) : (
                                            <>
                                                <p className="waring-msg">정확하지 않은 이름입니다.</p>
                                            </>
                                        )}
                                        <div className='MemberInfo-update-btn-box'>
                                            <button className='MemberInfo-name-update-btn' onClick={() => setNameUpdateOpen(false)}>
                                                취소
                                            </button>
                                            <button className='MemberInfo-name-update-btn' onClick={() => NameUpdate()}>
                                                확인
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Dialog>
                        </div>
                    </div>
                    <div className='MemberInfo-delete-box'>
                        <button className='MemberInfo-delete-btn' onClick={() => setMemberDeleteOpen(true)}>회원 탈퇴</button>
                        <Dialog open={memberDeleteOpen} PaperProps={{style : {borderRadius : "8px", width: "280px"}}}>
                        <div className='MemberInfo-name-update-box'>
                                    <div className='MemberInfo-name-update-size'>
                                        <div className='MemberInfo-name-update-title' >회원 탈퇴</div>
                                        <div className='MemberInfo-name-update-con'>회원 탈퇴를 하시려면 비밀번호를 입력해주세요.</div>
                                        <input type="password"  className='MemberInfo-name-update-input' onChange={(e) => setPassword(e.target.value)}/>
                                        <div className='MemberInfo-update-btn-box'>
                                            <button className='MemberInfo-name-update-btn' onClick={() => setMemberDeleteOpen(false)}>
                                                취소
                                            </button>
                                            <button className='MemberInfo-name-update-btn' onClick={() => memberDelete()}>
                                                확인
                                            </button>
                                        </div>
                                    </div>
                                </div>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MemberInfopage;