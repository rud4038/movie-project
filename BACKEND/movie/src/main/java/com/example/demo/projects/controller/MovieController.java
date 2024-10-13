package com.example.demo.projects.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.projects.dto.GetMovieInfoDto;
import com.example.demo.projects.dto.MovieDetailInfoDto;
import com.example.demo.projects.dto.MovieInfoDto;
import com.example.demo.projects.dto.ResponseDto;
import com.example.demo.projects.service.MovieService;

@RestController
@RequestMapping("/movie")
public class MovieController {
	
	@Autowired MovieService movieService;
	
	@GetMapping("/save")
	public ResponseDto<String> MovieBoxofficeSave() {
		return movieService.MovieBoxofficeSave();
	}
	
	@GetMapping("/search/{movieName}")
	public ResponseDto<List<MovieDetailInfoDto>> MovieSearch (@PathVariable("movieName") String movieName) {
		return movieService.MovieSearch(movieName);
	}
	
	@GetMapping("/movieListLoad")
	public ResponseDto<List<MovieDetailInfoDto>> MovieListLoad(){
		return movieService.MovieListLoad();
	}
	
	@GetMapping("/movieGenreList") 
	public ResponseDto<List<String>> MovieGenreList() {
		return movieService.MovieGenreList();
	}
	
	@GetMapping("/movieByGenre/{genre}")
	public ResponseDto<List<MovieDetailInfoDto>> MovieListByGenre(@PathVariable("genre") String genre) {
		System.out.println(genre);
		return movieService.MovieListByGenre(genre);
	}
	
	@GetMapping("/movieByScore")
	public ResponseDto<List<MovieDetailInfoDto>> MovieListByScore(){
		return movieService.MovieListByScore();
	}
	
	@GetMapping("/movieInfo/{movieCd}")
	public ResponseDto<GetMovieInfoDto> getMovieInfo(@PathVariable("movieCd") String movieCd) {
		return movieService.getMovieInfo(movieCd);
	}
	

}
