import React, { useEffect, useState } from 'react';
import './ComentWritePage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import writeOpenStore from '../../stores/writeOpen.store';
import { memberStore } from '../../stores';
import movieInfoStore from '../../stores/movieInfo.store';
import axios from 'axios';
import myComentStore from '../../stores/myComent.stroe';
import { useNavigate } from 'react-router-dom';


function ComentWritePage() {
    const [coment, setComent] = useState<string>('');
    const { writeOpen,setWriteOpen} = writeOpenStore()
    const { myComent, setMyComent} = myComentStore();
    const {member} = memberStore();
    const {movieInfoSt} = movieInfoStore();
    const navigate = useNavigate();


    useEffect(() => {
        if(myComent !== null) {
            setComent(myComent.coment);
        }
    },[])
    

    const comentSave = async() => {
        if(coment.length === 0){
            alert('코멘트내용을 작성해주세요');
        }
        const movieCd = movieInfoSt.movieCd;
        const memberId = member.id;
        const memberName = member.name;

        const ComentDto = {
            movieCd,
            memberId,
            memberName,
            coment
        }

        await axios.post('http://localhost:4040/coment/save',ComentDto)
        .then((response) => {
            alert(response.data.message)
            if(response.data.result){
                myComentLoad();
            }
            
        })
        setWriteOpen(false);
    }

    const myComentLoad = async () => {
        const memberId = member.id
        const movieCd = movieInfoSt.movieCd;
        const comentSearchDto = {
            memberId,
            movieCd
        }

        await axios.post('http://localhost:4040/coment/myComent',comentSearchDto)
        .then((response) => {
            setMyComent(response.data.data)
        })
    }

    const comentUpdate = async() => {
        if(myComent === null){
            return
        }
        const id = myComent.id
        const movieCd = myComent.movieCd
        const memberId = myComent.memberId
        const memberName = myComent.memberName
        const score = myComent.score
        const comentDto = {
            id,
            coment,
            movieCd,
            memberId,
            memberName,
            score
        }
        await axios.post('http://localhost:4040/coment/comentUpdate',comentDto)
        .then((response) => {
            alert(response.data.message)
            if(response.data.result){
                setMyComent(comentDto)
                setWriteOpen(false)
            }
        })
    }


    

    return (
        <div className='WriteBox'>
            <div>
                <header className='WriteBox-header'>
                    <em className='WriteBox-movieName'>흑백요리사</em>
                    <div className='WriteBox-close-box'>
                        <button className='WriteBox-close-btn' onClick={() => setWriteOpen(false)}>
                            <FontAwesomeIcon icon={faXmark}/>
                        </button>
                    </div>
                </header>
                <div className='WriteBox-con-box'>
                    <textarea name="" id="" className='WriteBox-con' placeholder='이 영화 대한 생각을 자유롭게 표현해주세요.' onChange={(e)=>setComent(e.target.value)} value={coment}>
                    </textarea>
                </div>
                <div className='WriteBox-footer-box'>
                    <div className='WriteBox-footer-size'>
                        <div className='WriteBox-save-box'>
                            <p className='WriteBox-con-counte'>{coment.length}/1000</p>
                            {
                                myComent === null ? 
                                (<><button className='WriteBox-save-btn' onClick={() => comentSave()}>저장</button></>) 
                                : 
                                (<><button className='WriteBox-save-btn' onClick={() => comentUpdate()}>수정</button></>)
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ComentWritePage;