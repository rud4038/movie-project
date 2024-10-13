import React, { useState } from "react";
import "./LoginPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import signupOpenStore from "../../stores/signupOpen.store";
import loginOpenStore from "../../stores/loginOpen.store";
import axios from "axios";
import { useCookies } from "react-cookie";
import { memberStore } from "../../stores";

function LoginPage() {
  const K_REST_API_KEY = process.env.REACT_APP_K_REST_API_KEY;
  const K_REDIRECT_URI = "http://localhost:3000/kakao";
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${K_REST_API_KEY}&redirect_uri=${K_REDIRECT_URI}&response_type=code`;

  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const {loginOpen, setLoginOpen} = loginOpenStore(); 
  const {signupOpen, setSignupOpen} = signupOpenStore();
  const[cookie, SetCookies] = useCookies();
  const {setMember} = memberStore();


  const emailCheck = () => {
    if (email === "") return true;
    return emailRegEx.test(email);
  };

  const emailClear = () => {
    setEmail("");
  };

  const passwordCheck = () => {
    const num = password.length;
    if (num === 0) return true;
    return passwordRegex.test(password);
  };

  const passwordClear = () => {
    setPassword("");
  };

  const ChangeSignupHandleClickOpen = () => {
    setLoginOpen(false);
    setSignupOpen(true);
  };

  const kakaoLoginPage = () => {
    window.location.href = kakaoURL;
  };

  const Login = async() => {
    const emailcheck = emailCheck()
    const passwordcheck = passwordCheck()

    if(!emailcheck || email === ''){
      return alert('이메일을 제대로 입력해주세요')
    }
    if(!passwordcheck || password === ''){
      return alert('비밀번호를 제대로 입력해주세요')
    }

    const LoginDto = {
      email,
      password
    }
    await axios.post('http://localhost:4040/member/login',LoginDto)
    .then((response) => {
      alert(response.data.message)
      if(!response.data.result){
        alert(response.data.message);
        return;
      }

      const { exprTime, member, token} = response.data.data;

      const expires = new Date();
      expires.setMilliseconds(exprTime);
      SetCookies('token', token, { expires });
      setMember(member);
      if(response.data.result){
        setLoginOpen(false);
      }
    })
  }

  return (
    <div>
      <div className="dialog-boxs">
        <div className="dialog-box">
          <header className="rogo">movie</header>
          <h2 className="dialog-title">로그인</h2>
          <div className="dialog-contents-box">
            <div className="dialog-contents">
              <div className="dialog-login-boxs">
                <div className="dialog-input-box">
                  <div
                    className="dialog-input-detail"
                    style={{
                      background: emailCheck() ? "#f5f5f5" : "#fff0f0",
                      border: emailCheck() ? "" : "1px solid #d21e1e",
                    }}
                  >
                    <input
                      type="text"
                      className="dialog-input"
                      placeholder="이메일"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                      value={email}
                    />
                    {email === "" ? (
                      <></>
                    ) : (
                      <>
                        <div className="dialog-clear-box">
                          <FontAwesomeIcon
                            icon={faCircleXmark}
                            className="xmark-btn"
                            onClick={() => emailClear()}
                          />
                        </div>
                        <div className="waring-box">
                          {emailCheck() ? (
                            <>
                              <FontAwesomeIcon
                                icon={faCircleCheck}
                                color="#14d2d2"
                              />
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon
                                icon={faCircleExclamation}
                                color="#d21e1e"
                              />
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {emailCheck() ? (
                  <></>
                ) : (
                  <>
                    <p className="waring-msg">정확하지 않은 이메일입니다.</p>
                  </>
                )}
                <div className="dialog-input-box">
                  <div
                    className="dialog-input-detail"
                    style={{
                      background: passwordCheck() ? "#f5f5f5" : "#fff0f0",
                      border: passwordCheck() ? "" : "1px solid #d21e1e",
                    }}
                  >
                    <input
                      type="password"
                      className="dialog-input"
                      placeholder="비밀번호"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                    />
                    {password === "" ? (
                      <></>
                    ) : (
                      <>
                        <div className="dialog-clear-box">
                          <FontAwesomeIcon
                            icon={faCircleXmark}
                            className="xmark-btn"
                            onClick={() => passwordClear()}
                          />
                        </div>
                        <div className="waring-box">
                          {passwordCheck() ? (
                            <>
                              <FontAwesomeIcon
                                icon={faCircleCheck}
                                color="#14d2d2"
                              />
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon
                                icon={faCircleExclamation}
                                color="#d21e1e"
                              />
                            </>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {passwordCheck() ? (
                  <></>
                ) : (
                  <>
                    <p className="waring-msg">
                      비밀번호는 영문, 숫자, 특수문자를 조합하여 최소 8자리
                      이상이여야 합니다.
                    </p>
                  </>
                )}
                <button className="dialog-login-btn" onClick={() => Login()}>로그인</button>
              </div>
              <div className="dialog-findPassword-box">
                <button className="dialog-findPassword-btn">
                  비밀번호를 잊어버리셨나요?
                </button>
              </div>
              <div className="dialog-singup-box">
                <div>계정이 없으신가요?</div>
                <button
                  className="dialog-singup-btn"
                  onClick={() => ChangeSignupHandleClickOpen()}
                >
                  회원가입
                </button>
              </div>
              <hr className="dialog-underline" />
              <div className="dialog-openApi-list">
                <div className="dialog-openApi-box">
                  <button className="dialog-openApi-btn">
                    <img
                      src="https://an2-ast.amz.wtchn.net/ayg/images/icSocialKakao.444bf93dafbd611eb4d1.svg?as-resource"
                      alt=""
                      className="dialog-openApi-img"
                      onClick={() => kakaoLoginPage()}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
