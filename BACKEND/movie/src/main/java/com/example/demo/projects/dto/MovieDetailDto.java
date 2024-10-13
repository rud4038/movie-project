package com.example.demo.projects.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MovieDetailDto {
	private MovieInfoResult movieInfoResult;
	
	@Data
	public static class MovieInfoResult {
		private MovieInfo movieInfo;
	}
	
	@Data
	public static class MovieInfo {
		private String movieCd;
		private String movieNm;
		private List<Nations> nations;
		private String openDt;
		private List<Genres> genres;
		private String showTm;
		private List<Audits> audits;
	}
	
	@Data
	public static class Genres {
		private String genreNm;
	}
	
	@Data
	public static class Audits {
		private String watchGradeNm;
	}
	
	@Data
	public static class Nations {
		private String nationNm;
	}
	
}
