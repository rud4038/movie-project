import React, { useEffect, useState } from 'react';
import './Detailpage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dialog } from '@mui/material';
import ComentWritePage from '../ComentWritePage/ComentWritePage';
import writeOpenStore from '../../stores/writeOpen.store';
import movieInfoStore from '../../stores/movieInfo.store';
import { memberStore } from '../../stores';
import loginOpenStore from '../../stores/loginOpen.store';
import myComentStore from '../../stores/myComent.stroe';

function Detailpage() {
    const numberfor = [1,2,3,4,5,6,7,8,9,10];
    const comentfor = [1,2,3,4,5,6,7,8];
    const { search } = useLocation();
    const [testWidth,SettestWidth] = useState<number>();
    const [hoveredStarIndex, setHoveredStarIndex] = useState<number>(0);
    const [clickedStarIndex, setClickedStarIndex] = useState<number>(0);
    const [movieInfo,SetMovieInfo] = useState<MovieInfo | undefined>(undefined);
    const [starScore,setStarScore] = useState<number>(0.0);
    const [ comentList, setComentList] = useState<any[]>([]);
    const [ recomendationList, setRecomendationList] = useState<any[]>([]);
    const { myComent,setMyComent } = myComentStore();
    const { writeOpen, setWriteOpen} = writeOpenStore();
    const { movieInfoSt , setMovieInfoSt} = movieInfoStore();
    const {member} = memberStore();
    const {loginOpen, setLoginOpen} = loginOpenStore();
    const navigate = useNavigate();

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
        const params = new URLSearchParams(search);
        const movieCd = params.get('movieCd')

        getMovieInfo(movieCd);
        comentListLoad(movieCd);

        if(member !== null) {
            myComentLoad(movieCd);
            RecomendationList();
        }
    },[search,member])
    

    const WriteHandleClickOpen = () => {
        setWriteOpen(true);
    }

    const WriteHandleClose = () => {
        setWriteOpen(false);
    }

    const fillStarOfIndex = (num : number, event : string) => {
        if (event === 'enter' && hoveredStarIndex >= num) {
            return '#ff2f6e';
        }
        if (event === 'leave' && clickedStarIndex >= num) {
            return '#ff2f6e';
        }
        return '#eee'; 
    };

    const getMovieInfo = async (movieCd : any) => {
        axios.get(`http://localhost:4040/movie/movieInfo/${movieCd}`)
        .then((response) => {
            SetMovieInfo(response.data.data);
            setMovieInfoSt(response.data.data);
        })
    }

    const comentCheck = () => {
        if(member === null){
            setLoginOpen(true)
            return
        }

        if(myComent != null){
            alert("코멘트는 영화당 하나만 작성하실수 있습니다")
            return
        }
        WriteHandleClickOpen()
    }

    const myComentLoad = async (movieCd : any) => {
        const memberId = member.id
        const comentSearchDto = {
            memberId,
            movieCd
        }

        await axios.post('http://localhost:4040/coment/myComent',comentSearchDto)
        .then((response) => {
            setMyComent(response.data.data)
            if(response.data.data !== null){
                alert(response.data.message)
                
                setStarScore(response.data.data.score * 2)
            }
        })
    }

    const scoreUpdate = (num : any) => {

        if(member === null){
            alert('로그인후 별점을 등록할수있습니다.');
            setLoginOpen(true);
            return
        }

        if(myComent === null){
            alert("코멘트 작성후 별점을 등록할수있습니다.")
            return
        }

        const id = myComent.id;
        const score = num/2;
        const scorUpdate = {
            id,
            score
        }

        axios.post('http://localhost:4040/coment/scoreUpdate',scorUpdate)
        .then((response) => {
            if(response.data.result){
                setStarScore(num);
                getMovieInfo(myComent.movieCd);
            }
        })
    }

    const comentDelete = () => {
        if(!window.confirm('코멘트를 삭제하시겠습니까?')){
            return
        }

        const id = myComent.id
        axios.get(`http://localhost:4040/coment/comentDelete/${id}`)
        .then((response) => {
            if(response.data.result){
                setMyComent(null);
                setStarScore(0);
                comentListLoad(movieInfo?.movieCd);
                getMovieInfo(movieInfo?.movieCd);
            }
        })
    }

    const comentListLoad = (movieCd : any) => {
        axios.get(`http://localhost:4040/coment/CometList/${movieCd}`)
        .then((response) => {
            if(response.data.result){
                setComentList(response.data.data)
            }
        })
    }

    const RecomendationList = async() => {
        await axios.get(`http://localhost:4040/coment/recomendationList/${member.id}`)
        .then((response) => {
            if(response.data.result && response.data.data[0] !== null){
                setRecomendationList(response.data.data[0].comentIdList)
            }
        })
        
    }

    const RecomendationSave = (id : any) => {
        if(member === null){
            alert('로그인후 추천할수 있습니다.')
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
                comentListLoad(movieInfo?.movieCd)
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
        .then(async (response) => {
            if(response.data.result){
                await RecomendationList()
                comentListLoad(movieInfo?.movieCd)
            }
        })
    }




    return (
        <div>
            {
                movieInfo === undefined ? (<></>) : 
                (<>
            <div className='Detailpage-con-box'>
                <div style={{background : '#f8f8f8'}}>
                    <div className='Detailpage-con-imgtitle'>
                        <div className='Detailpage-titleimg' style={{backgroundImage : `url(${movieInfo.backdropPath})`}}>
                        </div>
                        <div className='Detailpage-detailcon-box'>
                            <div>
                                <h1 className='movie-con-title'>{movieInfo.movieName}</h1>
                                <div className='movie-small-title'>{movieInfo.movieName}</div>
                                <div className='movie-genre-date'>{movieInfo.openDate}· {movieInfo.genres} · {movieInfo.nation}</div>
                                <div className='movie-runtime'>{movieInfo.showTime}분 · {movieInfo.watchGrade}</div>
                            </div>
                        </div>
                    </div>
                    <div className='Detailpage-Detail-conbox'>
                        <div className='Detailpage-Detail-imgbox'>
                            <div className='Detailpage-Detail-imgbox-size'>
                                <img src={movieInfo.posterUrl} alt="" 
                                    className='Detailpage-Detail-img'
                                />
                            </div>
                        </div>
                        <div className='Detailpage-Detail-boxs'>
                            <div className='Detailpage-Detail-btnbox'>
                                <div className='Detailpage-scope-boxs'>
                                    <div className='Detailpage-star-boxs'>
                                        {
                                            numberfor.map((num : any)=> (
                                                <button key={num} className={`Detailpage-star-left ${num % 2 === 1 ? '' : 'Detailpage-star-right'}`} 
                                                    onMouseEnter={() => setHoveredStarIndex(num)}
                                                    onMouseLeave={() => setHoveredStarIndex(starScore)}
                                                    onClick={() => scoreUpdate(num)}
                                                >
                                                    <FontAwesomeIcon icon={faStar} className ='Detailpage-star' style={{color : fillStarOfIndex(num, hoveredStarIndex=== 0 ? 'leave' : 'enter')}} />
                                                </button>
                                        ))}
                                    </div>
                                    <div className='scope-con-box'>
                                        <div>평가하기</div>
                                    </div>
                                </div>
                                <div className='Detailpage-scope-numbox'>
                                    <div className='scope-numbox'>
                                        <div className='scope-num'>{movieInfo.score}</div>
                                        <div className='scope-text-box'>
                                            평균별점
                                            <br style={{display : 'none'}}/>'({comentList.length}명)'
                                        </div>
                                    </div>
                                </div>
                                <div className='coment-btn-box'>
                                    <button className='coment-icon-box' onClick={() => comentCheck()}>
                                        <div className='coment-icon'>
                                            <FontAwesomeIcon icon={faPen} className='icon-faPen' />
                                        </div>
                                        코멘트
                                    </button>
                                    <Dialog open= {writeOpen} onClose={WriteHandleClose} maxWidth={'xl'} PaperProps={{style : {borderRadius : "16px"}}}>
                                        <ComentWritePage />
                                    </Dialog>
                                </div>
                            </div>
                            {
                                myComent === null ? (<></>) 
                                : 
                                (<>
                                    <div className='Detailpage-Mycoment-box'>
                                        <h4 className='Detailpage-Mycoment-title'>내가 쓴 코멘트</h4>
                                        <div className='Detailpage-Mycoment-conbox'>
                                            <div className='Detailpage-Mycoment-consize'>
                                                <div className='Detailpage-Mycoment-section'>
                                                    <div className='Detailpage-Mycoment-flex'>
                                                        <Link to={'/ComentDetailpage'} state={{movieCd : movieInfo.movieCd, id : myComent.id}} className='Detailpage-Mycoment-a'>{myComent.coment}</Link>
                                                        <div className='Detailpage-Mycoment-ul'>
                                                            <div className='Detailpage-Mycoment-li'>
                                                                <button className='Detailpage-Mycoment-btn Detailpage-Mycoment-after' onClick={() => comentDelete()}>
                                                                    <FontAwesomeIcon icon={faTrash} className='Detailpage-Mycoment-icon'/>
                                                                    삭제
                                                                </button>
                                                            </div>
                                                            <div className='Detailpage-Mycoment-li' onClick={() => setWriteOpen(true)}>
                                                                <button className='Detailpage-Mycoment-btn' >
                                                                    <FontAwesomeIcon icon={faPen} className='Detailpage-Mycoment-icon' />
                                                                    수정
                                                                </button>
                                                                <Dialog open= {writeOpen} onClose={WriteHandleClose} maxWidth={'xl'} PaperProps={{style : {borderRadius : "16px"}}}>
                                                                    < ComentWritePage/>
                                                                </Dialog>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>)
                            }
                            <div className='Detailbox-detailcon-box'>
                                <p className='Detailbox-detailcon'>{movieInfo.plot}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='Detailpage-coment-box'>
                    <header className='Detailpage-coment-head'>
                        <h2 className='Detailpage-coment-title'>코멘트</h2>
                        <div className='Detailpage-coment-num'>{comentList.length}</div>
                        <div className='Detailpage-coment-morebox'>
                            <div className='Detailpage-coment-more'>
                                <Link to={'/ComentAllpage'} state={{movieCd : movieInfo.movieCd}} className='Detailpage-coment-more-btn'>더보기</Link>
                            </div>
                        </div>
                    </header>
                    <div className='Detailpage-coment-ul'>
                        {comentList.map((comentInfo : any, index : number) => ( index < 8 &&
                            <div className='Detailpage-coment-li'>
                                <div className='Detailpage-coment-li-box'>
                                    <div className='Detailpage-coment-titlebox'>
                                        <div className='Detailpage-coment-nickname-box'>
                                            <div className='Detailpage-coment-nickname'>{comentInfo.member_name}</div>
                                        </div>
                                        <div className='Detailpage-coment-starbox'>
                                            <FontAwesomeIcon icon={faStar} className='Detailpage-coment-star' />
                                            <span>{comentInfo.score}</span>
                                        </div>
                                    </div>
                                    <div className='Detailpage-coment-conbox'>
                                        <Link to={'/ComentDetailpage'} state={{movieCd : movieInfo.movieCd, id : comentInfo.id}} className='Detailpage-coment-conbtn'>
                                            <div className='Detailpage-coment-con'>
                                                <div>{comentInfo.coment}</div>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className='Detailpage-coment-ThumbsUp-box'>
                                        <FontAwesomeIcon icon={faThumbsUp} className='Detailpage-coment-ThumbsUp'/>
                                        <em>{comentInfo.recomendation_count}</em>
                                    </div>
                                    <div className='Detailpage-coment-ThumbsUp-btnbox'>
                                        {
                                            member !==null && recomendationList !== null && recomendationList.includes(comentInfo.id) ?
                                            (<><button className='Detailpage-coment-ThumbsUp-btn-active' onClick={() => RecomendationDelete(comentInfo.id)}>좋아요</button></>)
                                            :
                                            (<><button className='Detailpage-coment-ThumbsUp-btn' onClick={() => RecomendationSave(comentInfo.id)}>좋아요</button></>)
                                        }
                                        
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
                </>)
            }
        </div>
    );
}

export default Detailpage;