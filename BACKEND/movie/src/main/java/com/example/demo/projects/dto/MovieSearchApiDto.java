package com.example.demo.projects.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MovieSearchApiDto {
	private MovieListResult movieListResult;
	
	@Data
	public static class MovieListResult {
		private List<MovieList> movieList;
	}
	
	@Data
	public static class MovieList {
		private String movieCd;
		private String typeNm;
		private String prdtYear;
		private String prdtStatNm;
		private String genreAlt;
	}
}
