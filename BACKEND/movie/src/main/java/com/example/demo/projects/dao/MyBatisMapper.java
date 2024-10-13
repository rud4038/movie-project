package com.example.demo.projects.dao;


import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.example.demo.projects.dto.ComentDto;
import com.example.demo.projects.dto.ComentResponseDto;
import com.example.demo.projects.dto.ComentScoreUpdateDto;
import com.example.demo.projects.dto.ComentSearchDto;
import com.example.demo.projects.dto.CommonMemberDto;
import com.example.demo.projects.dto.GenreDto;
import com.example.demo.projects.dto.GetMovieInfoDto;
import com.example.demo.projects.dto.MemberDto;
import com.example.demo.projects.dto.MemberKakaoDto;
import com.example.demo.projects.dto.MovieCdDto;
import com.example.demo.projects.dto.MovieDetailInfoDto;
import com.example.demo.projects.dto.MovieGenreSaveDto;
import com.example.demo.projects.dto.MovieInfoDto;
import com.example.demo.projects.dto.RecomendationDto;

@Mapper
@Repository
public interface MyBatisMapper {
	public Integer SingUp(MemberDto memberDto);
	public MemberKakaoDto existsByKakaoId(@Param("kakaoId") String kakaoId);
	public Integer KakaoSingUp(MemberKakaoDto memberKakaoDto);
	public MemberDto findMemberInfo(int memberId);
	public CommonMemberDto existsByEmail (String email);
	public void CommonSignUp (CommonMemberDto commonMemberDto);
	public MovieCdDto findMovieCd (String movieCd);
	public List<MovieDetailInfoDto> MovieSearchList(String movieName);
	public List<MovieDetailInfoDto> MovieListLoad();
	public List<MovieDetailInfoDto> MovieListByGenre(String genre);
	public List<MovieDetailInfoDto> movieListByScore();
	public void MovieInfoSave (MovieInfoDto movieSaveDto);
	public Integer GenreSave (GenreDto genreDto);
	public GenreDto findGenreNm(String genreNm);
	public void MovieGenreSave(MovieGenreSaveDto movieGenreSaveDto);
	public List<String> MovieGenreList();
	public LocalDateTime getLastApiCall();
	public void updateLastApiCall(@Param("lastApiCall") LocalDateTime lastApiCall);
	public void insertApiCallLog(@Param("lastApiCall") LocalDateTime lastApiCall);
	public Integer ComentSave(ComentDto comentDto);
	public void RecomendationSave(RecomendationDto recomendationDto);
	public RecomendationDto findeRecomendation (RecomendationDto recomendationDto);
	public List<ComentResponseDto> getComentList (String movieCd);
	public ComentResponseDto getMyComent (ComentSearchDto comentSearchDto);
	public void DeleteRecomendation (RecomendationDto recomendationDto);
	public List<Integer> RecomendationList(int memberId);
	public GetMovieInfoDto getMovieInfo (String movieCd);
	public int ComentScoreUpdate(ComentScoreUpdateDto comentScoreUpdateDto);
	public int ComentUpdate(ComentDto comentDto);
	public int ComentDelete(int id);
	public ComentResponseDto getComent (int id);
	public List<ComentResponseDto> getComentListByRecomendation (String movieCd);
	public List<ComentResponseDto> getComentListByScoreDesc (String movieCd);
	public List<ComentResponseDto> getComentListByScore (String movieCd);
	public int memberNameUpdate(MemberDto memberDto);
	public int comentNameUpdate(MemberDto MemberDto);
	public String getEmail(int id);
	public void memberDelete(int id);
	public void kakaoDelete(int id);
	public void recomendationAllDelete(int id);
	public void comentAllDelete(int id);
}
