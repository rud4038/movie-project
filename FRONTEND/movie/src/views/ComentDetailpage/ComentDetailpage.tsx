import React, { useEffect, useState } from 'react';
import './ComentDetailpage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { memberStore } from '../../stores';
import loginOpenStore from '../../stores/loginOpen.store';
import writeOpenStore from '../../stores/writeOpen.store';
import { Dialog } from '@mui/material';
import ComentWritePage from '../ComentWritePage/ComentWritePage';

function ComentDetailpage() {

    const location = useLocation();
    const navigate = useNavigate();
    const [ comentInfo,setComentInfo] = useState<ComentInfo|undefined>(undefined);
    const [movieInfo,SetMovieInfo] = useState<MovieInfo | undefined>(undefined);
    const [ recomendationList, setRecomendationList] = useState<any[]>([]);
    const {member} = memberStore();
    const { loginOpen, setLoginOpen} = loginOpenStore();
    const { writeOpen,setWriteOpen} = writeOpenStore();

    interface ComentInfo {
        coment : string,
        id : number,
        memberId : number,
        memberName : string,
        movieCd : string,
        recomendationCount : string,
        score : number
    }

    interface MovieInfo {
        movieCd: string;
        movieName: string;
        nation: string;
        openDate: string;
        showTime: string;
        watchGrade: string;
        plot: string;
        posterUrl: string;
        genres: string[]; 
        score: number;
        backdropPath:string;
      }


    useEffect(() => {
        getComentInfo(location.state.id)
        getMovieInfo(location.state.movieCd)
        if(member !== null){
            RecomendationList()
        }
    },[member])

    const getComentInfo = (id : any) => {
        axios.get(`http://localhost:4040/coment/getComent/${id}`)
        .then((response) => {
            setComentInfo(response.data.data)
        })
    }

    const getMovieInfo = async (movieCd : any) => {
        axios.get(`http://localhost:4040/movie/movieInfo/${movieCd}`)
        .then((response) => {
            SetMovieInfo(response.data.data);
        })
    }

    const RecomendationList = async() => {
        await axios.get(`http://localhost:4040/coment/recomendationList/${member.id}`)
        .then((response) => {
            if(response.data.result ){
                if(response.data.data[0] !== null){
                    setRecomendationList(response.data.data[0].comentIdList)
                }else {
                    setRecomendationList([]);
                }
            }
        })
        
    }

    const RecomendationSave = (id : any) => {
        if(member === null){
            alert('로그인후 추천할수 있습니다.')
            setLoginOpen(true)
            return
        }
        const memberId = member.id
        const comentId = id
        const Dto = {
            memberId,
            comentId
        }
        axios.post('http://localhost:4040/coment/recomendation',Dto)
        .then((response) => {
            if(response.data.result){
                RecomendationList()
                getComentInfo(location.state.id)
            }
        })
    }

    const RecomendationDelete = (id : any) => {
        const memberId = member.id
        const comentId = id
        const Dto = {
            memberId,
            comentId
        }
        axios.post('http://localhost:4040/coment/recomendationDelete',Dto)
        .then((response) => {
            if(response.data.result){
                RecomendationList()
                getComentInfo(location.state.id)
            }
        })
    }

    const comentDelete = () => {
        if(!window.confirm('코멘트를 삭제하시겠습니까?')){
            return
        }

        const id = comentInfo?.id
        axios.get(`http://localhost:4040/coment/comentDelete/${id}`)
        .then((response) => {
            if(response.data.result){
                alert(response.data.message)
                navigate(`/Detailpage?movieCd=${movieInfo?.movieCd}`)
            }
        })
    }
    

    return (
        <div className='ComentDetail-box'>
            <div className='ComentDetail-header-box'>
                <div className='ComentDetail-info-box'>
                    <a href="" className='ComentDetail-name-date-info'>
                        <div className='ComentDetail-name-date-box'>
                            <div>{comentInfo?.memberName}</div>
                        </div>
                    </a>
                    <div className='ComentDetail-title-info' onClick={() => navigate(`/Detailpage?movieCd=${location.state.movieCd}`)}>
                        <div>
                            <div className='ComentDetail-movie-title'>{movieInfo?.movieName}</div>
                            <div className='ComentDetail-movie-info'>{movieInfo?.genres} · {movieInfo?.showTime}</div>
                        </div>
                    </div>
                    <div className='ComentDetail-score-info'>
                        <div className='ComentDetail-score-box'>
                            <FontAwesomeIcon icon={faStar} className='ComentDetail-score-icon'/>
                            <span style={{marginLeft : '4px'}}>{comentInfo?.score}</span>
                        </div>
                    </div>
                </div>
                <div className='ComentDetail-movie-img-info' onClick={() => navigate(`/Detailpage?movieCd=${location.state.movieCd}`)}>
                    <div className='ComentDetail-movie-img-box'>
                        <img className='ComentDetail-movie-img' src={movieInfo?.posterUrl} alt="" />
                    </div>
                </div>
            </div>
            <div className='ComentDetail-coment-box'>
                <div className='ComentDetail-coment'>
                    {comentInfo?.coment}
                </div>
            </div>
            <div className='ComentDetail-ThumbsUp-info'>
                <div className='ComentDetail-ThumbsUp-box'>
                    {
                        member !==null && recomendationList !== null && recomendationList.includes(comentInfo?.id) ?
                        (<>
                            <button className='ComentDetail-ThumbsUp-btn-active' onClick={() => RecomendationDelete(comentInfo?.id)}>
                                좋아요
                            </button>
                        </>)
                        :
                        (<>
                            <button className='ComentDetail-ThumbsUp-btn' onClick={() => RecomendationSave(comentInfo?.id)}>
                            좋아요
                            </button>
                        </>)
                    }

                    <FontAwesomeIcon icon={faThumbsUp} className='ComentDetail-icon'/> {comentInfo?.recomendationCount}
                </div>
                {
                    comentInfo?.memberId === member.id ? 
                    (<>
                        <div className='ComentDetail-update-box'>
                            <button className='ComentDetail-update-btn'  onClick={() =>setWriteOpen(true)}>
                                <FontAwesomeIcon icon={faPen} className='ComentDetail-update-icon'/> 수정
                            </button>
                            <Dialog open = {writeOpen} maxWidth={'xl'} PaperProps={{style : {borderRadius : "16px"}}}>
                                <ComentWritePage/>
                            </Dialog>
                            <button className='ComentDetail-update-btn' onClick={() => comentDelete()}>
                                <FontAwesomeIcon icon={faTrash} className='ComentDetail-update-icon' /> 삭제
                            </button>
                        </div>
                    </>)
                    :
                    (<></>)
                }
            </div>
        </div>
    );
}

export default ComentDetailpage;