import React, { useEffect, useState } from 'react';
import './ComentAllpage.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCheck, faStar, faThumbsUp, faXmark } from '@fortawesome/free-solid-svg-icons';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';
import { Dialog } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { memberStore } from '../../stores';

function ComentAllpage() {
    const location = useLocation();
    const numberfor = [1,2,3,4,5,6,7,8,9,10,11];
    const selectList = ['좋아요 순','높은 평가 순','낮은 평가 순']
    const [ selectType,setSelectType ] = useState<string>('좋아요 순');
    const [ selectTypeOpen, setSelectTypeOpen] = useState<boolean>(false);
    const [ comentList, setComentList] = useState<any[]>();
    const [ recomendationList, setRecomendationList] = useState<any[]>([]);
    const { member } = memberStore();
    const navigate = useNavigate();

    useEffect(() => {
        comentListByRecomendation();

        if(member !== null) {
            RecomendationList();
        }
    },[member])

    const selectHandleClickOpen = () => {
        setSelectTypeOpen(true);
    }

    const selectHandleClose = () => {
        setSelectTypeOpen(false);
    }

    const selectTypeChange = (type : string) => {
        setSelectType(type);
        selectHandleClose();

        if(type === '좋아요 순') {
            comentListByRecomendation()
        }

        if(type === '높은 평가 순') {
            comentListByScoreDesc()
        }

        if(type === '낮은 평가 순') {
            comentListByScore()
        }
    }

    const comentListByRecomendation = () => {
        axios.get(`http://localhost:4040/coment/ByRecomendation/${location.state.movieCd}`)
        .then((response) => {
            setComentList(response.data.data);
        })
    }

    const comentListByScoreDesc = () => {
        axios.get(`http://localhost:4040/coment/ByScoreDesc/${location.state.movieCd}`)
        .then((response) => {
            setComentList(response.data.data);
        })
    }

    const comentListByScore = () => {
        axios.get(`http://localhost:4040/coment/ByScore/${location.state.movieCd}`)
        .then((response) => {
            setComentList(response.data.data);
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
                selectTypeChange(selectType)
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
                selectTypeChange(selectType)
            }
        })
    }

    const backHandler = () => {
        navigate(`/Detailpage?movieCd=${location.state.movieCd}`)
    }

    return (
        <div className='ComentAll-section'>
            <div className='ComentAll-box'>
                <header className='ComentAll-header-box'>
                    <div className='ComentAll-back-btn-box'>
                        <div>
                            <button className='ComentAll-back-btn' onClick={() => backHandler()}><FontAwesomeIcon icon={faArrowLeft} className='ComentAll-back-icon'/></button>
                        </div>
                    </div>
                    <div className='ComentAll-title-box'>
                        <h4 className='ComentAll-title'>코멘트</h4>
                    </div>
                    <div className='ComentAll-select-btn-box'>
                        <div>
                            <div className='ComentAll-select-btns'>
                                <button className='ComentAll-select-btn' onClick={() => selectHandleClickOpen()}>
                                    <FontAwesomeIcon icon={faSortDown} className='ComentAll-select-icon'/>
                                    <span className='ComentAll-select-type'>{selectType}</span>
                                </button>
                                <Dialog open= {selectTypeOpen} onClose={selectHandleClose}>
                                    <div className='SelectType-Dialog-section'>
                                        <header className='SelectType-Dialog-header'>
                                            <div className='SelectType-Dialog-Xmark-box'>
                                                <button className='SelectType-Dialog-Xmark-btn' onClick={selectHandleClose}>
                                                    <FontAwesomeIcon icon={faXmark} className='SelectType-Dialog-Xmark'/>
                                                </button>
                                            </div>
                                            <em className='SelectType-Dialog-header-title'>정렬 기준</em> 
                                        </header>
                                        <div className='SelectType-Dialog-box'>
                                            <div className='SelectType-Dialog-size'>
                                                <ul className='SelectType-Dialog-ul'>
                                                    {
                                                        selectList.map((item : any) => (
                                                        <div className='SelectType-Dialog-li' onClick={() => selectTypeChange(item)}>
                                                            <div className='SelectType-Dialog-li-size'>
                                                                <div className='SelectType-Dialog-type'>{item}</div>
                                                                {
                                                                    (item === selectType) ? (<>
                                                                        <div className='SelectType-Dialog-checkBox'>
                                                                            <span className='SelectType-Dialog-icon'>
                                                                                <FontAwesomeIcon icon={faCheck} />
                                                                            </span>
                                                                        </div>
                                                                    </>) 
                                                                    : 
                                                                    (<></>)
                                                                }
                                                            </div>
                                                        </div>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog>
                            </div>
                        </div>
                    </div>
                </header>
                <div>
                    <div className='ComentAll-con-box'>
                        <div className='ComentAll-con-size'>
                            <ul className='ComentAll-ul'>
                                {
                                    comentList?.map((comentInfo : any) => (
                                        <div className='ComentAll-coment-li'>
                                            <div className='ComentAll-coment-titlebox'>
                                                <div className='ComentAll-coment-nickname-box'>
                                                    <div className='ComentAll-coment-nickname'>{comentInfo.member_name}</div>
                                                </div>
                                                <div className='ComentAll-coment-starbox'>
                                                    <FontAwesomeIcon icon={faStar} className='ComentAll-coment-star'/>
                                                    <span>{comentInfo.score}</span>
                                                </div>
                                            </div>
                                            <div className='ComentAll-coment-conbox'>
                                                <Link to={'/ComentDetailpage'} state={{movieCd : location.state.movieCd, id : comentInfo.id}} className='ComentAll-coment-conbtn'>
                                                    <div className='ComentAll-coment-con'>
                                                        <div>{comentInfo.coment}</div>
                                                    </div>
                                                </Link>
                                            </div>
                                            <div className='ComentAll-coment-ThumbsUp-box'>
                                                <FontAwesomeIcon icon={faThumbsUp} className='ComentAll-coment-ThumbsUp' />
                                                <em>{comentInfo.recomendation_count}</em>
                                            </div>
                                            <div className='ComentAll-coment-ThumbsUp-btnbox'>
                                                {
                                                    member !==null && recomendationList !== null && recomendationList.includes(comentInfo.id) ?
                                                    (<><button className='Detailpage-coment-ThumbsUp-btn-active' onClick={() => RecomendationDelete(comentInfo.id)}>좋아요</button></>)
                                                    :
                                                    (<><button className='Detailpage-coment-ThumbsUp-btn' onClick={() => RecomendationSave(comentInfo.id)}>좋아요</button></>)
                                                }
                                            </div>
                                        </div>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ComentAllpage;