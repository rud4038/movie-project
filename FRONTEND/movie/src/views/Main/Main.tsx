import { Box, Tabs, Tab, Pagination, FormControl } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './Main.css';
import sampleIMG from'../../assist/images/09cf6d42-6cd4-4a93-b255-e354919a8359.png'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Main() {
    const testimg = "";
    const { search } = useLocation();
    const [searchNumber, setSearchNumber] = useState<Number>(0);
    const [movieInfoList,setMovieInfoList] = useState<any[]>([]);
    const [pageMovieInfoList,setPageMovieInfoList] = useState<any[]>([]);
    const [pageSize, setPageSize] = useState<number>(1);
    const [page, setPage] = useState<number>(1);
    const [genre,setGenre] = useState<string>('전체');
    const [genreList,setGenreList] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(search);
        const searchTerm = params.get('search')

        if(searchTerm != null){
            MovieSearch(searchTerm)
        }else{
            movieListLoad()
        }

    },[search])


    const movieListLoad = async () => {
        setSearchNumber(0)
        await axios.get('http://localhost:4040/movie/save')
        .then((response) => {
        })

        axios.get('http://localhost:4040/movie/movieListLoad')
        .then((response) => {
            setMovieInfoList(response.data.data)
            PageHandler(response.data.data);
        })
    }

    const movieListByscoreLoad = async () => {
        setSearchNumber(1)
        axios.get('http://localhost:4040/movie/movieByScore')
        .then((response) => {
            setMovieInfoList(response.data.data)
            PageHandler(response.data.data);
        })
    }

    const movieGenreListLoad = async () => {
        setSearchNumber(2)
        await axios.get('http://localhost:4040/movie/movieGenreList')
        .then((response) => {
            const responseGenreList = response.data.data
            const genreAdd = {"genre_name":"전체"};
            responseGenreList.splice(0,0,genreAdd)
            setGenreList(response.data.data)
        })

        await axios.get('http://localhost:4040/movie/movieListLoad')
        .then((response) => {
            setMovieInfoList(response.data.data)
            PageHandler(response.data.data);
        })
    }

    const getGenreList = async (genre_name : any) => {
        await setGenre(genre_name);
        if(genre_name === '전체'){
            await axios.get('http://localhost:4040/movie/movieListLoad')
            .then((response) => {
                setMovieInfoList(response.data.data)
                PageHandler(response.data.data);
            })
            return
        }

        genre_name = genre_name.replace("/",",")
        await axios.get(`http://localhost:4040/movie/movieByGenre/${genre_name}`)
        .then((response) => {
            setMovieInfoList(response.data.data)
            PageHandler(response.data.data);
        })
        return
    }

    const MovieSearch = async (search : any) => {
        await axios.get(`http://localhost:4040/movie/search/${search}`)
        .then((response) => {
            setMovieInfoList(response.data.data)
            PageHandler(response.data.data);
        })
    }

    const PageHandler = (list : any[]) => {
        setPageSize(Math.ceil(list.length / 12));
        const tmp = [];

        for(let i = 0; i < 12; i++){
            if(i < list.length) tmp.push(list[i]);
        }
        setPageMovieInfoList(tmp);
    }

    const pageHandleChange = async (event: React.ChangeEvent<unknown>, value: number) => {
        const tmp = [];
        for (let i = 12 * (value - 1); i < value * 12; i++) {
          if (i < movieInfoList.length) tmp.push(movieInfoList[i]);
        }
        await setPageMovieInfoList(tmp);
        setPage(value);
      };

    const DetailpageHandler = (movieCd : any) => {
        navigate(`/Detailpage?movieCd=${movieCd}`)
    }

    return (
        <div className='Main'>
            <div className='contents-search-box'>
                <ul>
                    <li>
                        <button 
                            className={`contents-search-btn ${searchNumber === 0 ? 'contents-search-active' : ''}`}
                            onClick={() => movieListLoad()}
                        >
                            최신순
                        </button>
                    </li>
                    <li>
                    <button 
                            className={`contents-search-btn ${searchNumber === 1 ? 'contents-search-active' : ''}`}
                            onClick={() => movieListByscoreLoad()}
                        >
                            별점순
                        </button>
                    </li>
                    <li>
                    <button 
                            className={`contents-search-btn ${searchNumber === 2 ? 'contents-search-active' : ''}`}
                            onClick={() => movieGenreListLoad() }
                        >
                            장르별 최신순
                        </button>
                    </li>
                </ul>
            </div>
            {
                searchNumber === 2 ? (<>
                    <div className='contents-genre-list'>
                        {genreList.map((item:any) => (
                            <div 
                                className={`contents-genre-box ${genre === item.genre_name ? 'genre-box-active' : ''}`}
                                onClick={() => getGenreList(item.genre_name)}
                                >
                                    {item.genre_name}
                            </div>
                        ))}
                    </div>
                </>) 
                : 
                (<></>)
            }

            <div className='contents-list'>
                {pageMovieInfoList.map((item:any) => (
                        <div className='contents-box' onClick={() => DetailpageHandler(item.movie_cd)} >
                                <div className='contents-img-box'>
                                    <img src={item.poster_url} alt=''  className='contents-img'/>
                                </div>
                                <div className='contents-info-box'>
                                    <div className='contents-title'>{item.movie_name}</div>
                                    <div className='contents-subcon'>{item.open_date.substr(0,4)} ・ {item.nation}</div>
                                </div>
                        </div>
                ))}
            </div>
            <div className='pagination-box'>
                <Pagination
                count={pageSize}
                page={page}
                shape='rounded'
                onChange={pageHandleChange}
                />
            </div>
        </div>
    );
}

export default Main;