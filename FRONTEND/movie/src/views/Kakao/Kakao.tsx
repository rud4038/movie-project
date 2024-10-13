import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { memberStore } from '../../stores';
import { useCookies } from 'react-cookie';

function Kakao() {
    const code = new URL(window.location.href).searchParams.get('code')
    const grant_type = 	'authorization_code';
    const client_id = process.env.REACT_APP_K_REST_API_KEY;
    const redirect_uri = 'http://localhost:3000/kakao';
    const[cookie, SetCookies] = useCookies();
    const navigate = useNavigate();
    const {setMember} = memberStore();
    
    const kakaoLogin = async () => {
        const params = {
            grant_type,
            client_id,
            redirect_uri,
            code
        }
        try {
            const result = await axios.post("https://kauth.kakao.com/oauth/token",params,{
                headers: {
                    "Content-Type" : "application/x-www-form-urlencoded" 
                }
            })
            const accessToken = result.data.access_token
            await axios.get(`http://localhost:4040/member/kakaoLogin/${accessToken}`)
            .then((response) => {
                const responseData = response.data;

                if(!responseData.result){
                    alert(responseData.message);
                    return;
                }

                const { exprTime, member, token} = responseData.data;

                const expires = new Date();
                expires.setMilliseconds(exprTime);
                SetCookies('token', token, { expires });
                setMember(member);
            })
        } catch (error) {
            console.log(error);
        }
    } 

    useEffect(() => {
        kakaoLogin();
        navigate('/');
    },[])

    return (
        <div>
            
        </div>
    );
}

export default Kakao;