package com.example.demo.projects.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.example.demo.projects.dao.MyBatisMapper;
import com.example.demo.projects.dto.GenreDto;
import com.example.demo.projects.dto.GetMovieInfoDto;
import com.example.demo.projects.dto.MemberDto;
import com.example.demo.projects.dto.MovieCdDto;
import com.example.demo.projects.dto.MovieDailyDto;
import com.example.demo.projects.dto.MovieDetailDto;
import com.example.demo.projects.dto.MovieDetailInfoDto;
import com.example.demo.projects.dto.MovieGenreSaveDto;
import com.example.demo.projects.dto.MovieInfoDto;
import com.example.demo.projects.dto.MoviePosterPlotDto;
import com.example.demo.projects.dto.MovieSearchApiDto;
import com.example.demo.projects.dto.ResponseDto;




@Service
public class MovieService {
	@Autowired MyBatisMapper myBatisMapper;
	
	@Value("${movie-api-key}")
	private String movieApiKey;
	@Value("${movie-poster-api-key}")
	private String moviePosterApiKey;
	private String apiUrl = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/boxoffice/searchDailyBoxOfficeList.json";
	private String movieDetailApiUrl = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieInfo.json";
	private String searchApiUrl = "http://www.kobis.or.kr/kobisopenapi/webservice/rest/movie/searchMovieList.json";
	private String posterApiUrl = "https://api.themoviedb.org/3/search/movie?";
	
	public ResponseDto<String> MovieBoxofficeSave() {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime lastApiCall = myBatisMapper.getLastApiCall();
		
		if(lastApiCall == null || now.isAfter(lastApiCall.plusDays(1))) {
			
			try {
				String date = LocalDate.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
				RestTemplate restTemplate = new RestTemplate();
				String url = apiUrl + "?key=" + movieApiKey + "&targetDt=" + date;
				MovieDailyDto response = restTemplate.getForObject(url, MovieDailyDto.class);
				List<MovieDailyDto.DailyBoxOfficeList> movieCds = response.getBoxOfficeResult().getDailyBoxOfficeList();
				List<String> movieCdList = new ArrayList();
				
				
				for(MovieDailyDto.DailyBoxOfficeList movieCd : movieCds) {
					movieCdList.add(movieCd.getMovieCd());
				}
				boolean result = MovieSave(movieCdList);
				
				if(!result) {
					return ResponseDto.setFailed("db 저장 실패");
				}
				
				if(lastApiCall != null) {
					myBatisMapper.updateLastApiCall(now);
				}else {
					myBatisMapper.insertApiCallLog(now);
				}
				
				return ResponseDto.setSucces(null, "db 저장 성공");
				
			} catch (Exception e) {
				return ResponseDto.setFailed("db 저장 실패");
			}
			
		}
		
		return ResponseDto.setFailed("하루 한번만 호출 가능");
	}
	
	@Transactional
	public boolean MovieSave(List<String> movieCdList) {
		try {
			RestTemplate restTemplate = new RestTemplate();
			
			for(String movieCd : movieCdList) {
				MovieCdDto cdDto = myBatisMapper.findMovieCd(movieCd);
				if(cdDto != null) {
					continue;
				}
				String detailUrl = movieDetailApiUrl + "?key=" + movieApiKey + "&movieCd=" + movieCd;
				MovieDetailDto detailDto = restTemplate.getForObject(detailUrl, MovieDetailDto.class);
				
				
				Map<String,String> posterPlot = getPosterPlot(detailDto.getMovieInfoResult().getMovieInfo().getMovieNm(), detailDto.getMovieInfoResult().getMovieInfo().getOpenDt());
				
				
				MovieInfoDto movieInfoDto =  new MovieInfoDto().builder()
						.movieCd(detailDto.getMovieInfoResult().getMovieInfo().getMovieCd())
						.movieName(detailDto.getMovieInfoResult().getMovieInfo().getMovieNm())
						.nation(detailDto.getMovieInfoResult().getMovieInfo().getNations().get(0).getNationNm())
						.openDate(detailDto.getMovieInfoResult().getMovieInfo().getOpenDt())
						.showTime(detailDto.getMovieInfoResult().getMovieInfo().getShowTm())
						.watchGrade(detailDto.getMovieInfoResult().getMovieInfo().getAudits().get(0).getWatchGradeNm())
						.plot(posterPlot.get("plot"))
						.posterUrl(posterPlot.get("posterUrl"))
						.backdropPath(posterPlot.get("backDropPath"))
						.build();
				
				myBatisMapper.MovieInfoSave(movieInfoDto);
				
				for(MovieDetailDto.Genres genre : detailDto.getMovieInfoResult().getMovieInfo().getGenres()) {
					GenreDto genreDto = myBatisMapper.findGenreNm(genre.getGenreNm());
					
					if(genreDto == null) {
						genreDto = new GenreDto(0,genre.getGenreNm());
						myBatisMapper.GenreSave(genreDto);
					}
					
					MovieGenreSaveDto movieGenreSaveDto = new MovieGenreSaveDto(movieCd,genreDto.getId());
					myBatisMapper.MovieGenreSave(movieGenreSaveDto);
				}
				
			}
			return true;
		} catch (Exception e) {
			e.getStackTrace();
			return false;
		}
		
	}
	
	public ResponseDto<List<MovieDetailInfoDto>> MovieSearch (String movieName) {
		try {
			RestTemplate restTemplate = new RestTemplate();
			String serachUrl = searchApiUrl+ "?key=" + movieApiKey + "&movieNm=" + movieName;
			MovieSearchApiDto movieSearchApiDto = restTemplate.getForObject(serachUrl, MovieSearchApiDto.class);
			
			if(movieSearchApiDto.getMovieListResult() == null) {
				return ResponseDto.setFailed("검색한 영화가 없습니다.");
			}
			
			List<MovieSearchApiDto.MovieList> movieList = movieSearchApiDto.getMovieListResult().getMovieList();
			List<String> movieCdList = new ArrayList();
			
			
			for(MovieSearchApiDto.MovieList movieinfo : movieList) {
				int openYear = Integer.parseInt(movieinfo.getPrdtYear());
				
				
				if(openYear < 2000 || !movieinfo.getTypeNm().equals("장편") 
					|| !movieinfo.getPrdtStatNm().equals("개봉") || movieinfo.getGenreAlt().equals("성인물(에로)")) {
					continue;
				}
				
				MovieCdDto cdDto = myBatisMapper.findMovieCd(movieinfo.getMovieCd());
				
				if(cdDto != null) {
					continue;
				}
				movieCdList.add(movieinfo.getMovieCd());
			}
			boolean result = MovieSave(movieCdList);
			List<MovieDetailInfoDto> movieInfoList = myBatisMapper.MovieSearchList(movieName);
			
			return ResponseDto.setSucces(movieInfoList, "영화목록 검색 완료");
			
			
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseDto.setFailed("영화목록 검색 실패");
		}
	}
	
	public ResponseDto<List<MovieDetailInfoDto>> MovieListLoad() {
		try {
			
			List<MovieDetailInfoDto> movieList = myBatisMapper.MovieListLoad();
			
			return ResponseDto.setSucces(movieList, "영화목록 불러오기 성공");
		} catch (Exception e) {
			return ResponseDto.setFailed("영화목록 불러오기 실패");
		}
	}
	
	public ResponseDto<List<String>> MovieGenreList() {
		try {
			List<String> genreList = myBatisMapper.MovieGenreList();
			return ResponseDto.setSucces(genreList, "장르리스트");
		} catch (Exception e) {
			e.getStackTrace();
			return ResponseDto.setFailed("장르 리스트 불러오기 실패");
		}
	}
	
	public ResponseDto<List<MovieDetailInfoDto>> MovieListByGenre(String genre) {
		try {
			genre = genre.replace(",", "/");
			List<MovieDetailInfoDto> movieList = myBatisMapper.MovieListByGenre(genre);
			return ResponseDto.setSucces(movieList, "장르별 최신순 불러오기성공");
		} catch (Exception e) {
			return ResponseDto.setFailed("장르별 최신순 불러오기 실패");
		}
	}
	
	public ResponseDto<List<MovieDetailInfoDto>> MovieListByScore() {
		try {
			List<MovieDetailInfoDto> movieList = myBatisMapper.movieListByScore();
			return ResponseDto.setSucces(movieList, "장르별 별점순 불러오기성공");
		} catch (Exception e) {
			return ResponseDto.setFailed("장르별 별점순 불러오기 실패");
		}
	}
	
	public Map<String, String> getPosterPlot(String movieNm, String openDt) {
		try {
			RestTemplate restTemplate = new RestTemplate();
			String posterUrl = posterApiUrl + "api_key=" + moviePosterApiKey + "&query=" + movieNm + "&language=ko";
			MoviePosterPlotDto posterPlotDto = restTemplate.getForObject(posterUrl, MoviePosterPlotDto.class);
			Map<String, String> posterPlot = new HashMap();
			for(MoviePosterPlotDto.Movieinfo movie: posterPlotDto.getResults()) {
				if(movie.getOpenDt().replace("-", "").equals(openDt)) {
					posterPlot.put("plot", movie.getOverview());
					posterPlot.put("posterUrl", "https://image.tmdb.org/t/p/w500" + movie.getPoster_path());
					posterPlot.put("backDropPath","https://image.tmdb.org/t/p/original" + movie.getBackdrop_path());
					break;
				}
			}
			
			return posterPlot;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
	public ResponseDto<GetMovieInfoDto> getMovieInfo(String movieCd){
		try {
			GetMovieInfoDto movieDetailInfoDto = myBatisMapper.getMovieInfo(movieCd);
			return ResponseDto.setSucces(movieDetailInfoDto, "영화정보 불러오기 성공");
		} catch (Exception e) {
			return ResponseDto.setFailed("영화정보 불러오기 실패");
		}
	}
	
}
