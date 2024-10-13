import React, { useState } from "react";
import "./SignUpPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import LoginPage from "../LoginPage/LoginPage";
import { useNavigate } from "react-router-dom";
import signupOpenStore from "../../stores/signupOpen.store";
import loginOpenStore from "../../stores/loginOpen.store";
import axios from "axios";

function SignUpPage() {
  const K_REST_API_KEY = process.env.REACT_APP_K_REST_API_KEY;
  const K_REDIRECT_URI = "http://localhost:3000/kakao";
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${K_REST_API_KEY}&redirect_uri=${K_REDIRECT_URI}&response_type=code`;

  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/i;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const {loginOpen, setLoginOpen} = loginOpenStore(); 
  const {signupOpen, setSignupOpen} = signupOpenStore(); 

  const nameCheck = () => {
    const num = name.length;
    if (num > 1 || num === 0) return true;
    return false;
  };

  const nameClear = () => {
    setName("");
  };

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

  const ChangeLoginHandleClickOpen = () => {
    setLoginOpen(true);
    setSignupOpen(false);
  };

  const kakaoLoginPage = () => {
    window.location.href = kakaoURL;
  };

  const SingUp = async() => {
    const namecheck = nameCheck()
    const emailcheck = emailCheck()
    const passwordcheck = passwordCheck()
    if(!namecheck){
      return alert('이름을 입력해주세요')
    }
    if(!emailcheck || email === ''){
      return alert('이메일을 제대로 입력해주세요')
    }
    if(!passwordcheck || password === ''){
      return alert('비밀번호를 제대로 입력해주세요')
    }
    const SingUpDto = {
      name,
      email,
      password
    }
    await axios.post('http://localhost:4040/member/singUp',SingUpDto)
    .then((response) => {
      alert(response.data.message)
      if(response.data.result){
        setSignupOpen(false);
      }
    })
  }

  return (
    <div>
      <div className="dialog-boxs">
        <div className="dialog-box">
          <header className="rogo">movie</header>
          <h2 className="dialog-title">회원가입</h2>
          <div className="dialog-contents-box">
            <div className="dialog-contents">
              <div className="dialog-login-boxs">
                <div className="dialog-input-box">
                  <div
                    className="dialog-input-detail"
                    style={{
                      background: nameCheck() ? "#f5f5f5" : "#fff0f0",
                      border: nameCheck() ? "" : "1px solid #d21e1e",
                    }}
                  >
                    <input
                      type="text"
                      className="dialog-input"
                      placeholder="이름"
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                      value={name}
                    />
                    {name === "" ? (
                      <></>
                    ) : (
                      <>
                        <div className="dialog-clear-box">
                          <FontAwesomeIcon
                            icon={faCircleXmark}
                            className="xmark-btn"
                            onClick={() => nameClear()}
                          />
                        </div>
                        <div className="waring-box">
                          {nameCheck() ? (
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
                {nameCheck() ? (
                  <></>
                ) : (
                  <>
                    <p className="waring-msg">정확하지 않은 이름입니다.</p>
                  </>
                )}
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
                <button className="dialog-login-btn" onClick={() => SingUp()}>회원가입</button>
              </div>
              <div className="dialog-singup-box" style={{ marginTop: "20px" }}>
                <div>이미 가입하셨나요?</div>
                <button
                  className="dialog-singup-btn"
                  onClick={() => ChangeLoginHandleClickOpen()}
                >
                  로그인
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

export default SignUpPage;
