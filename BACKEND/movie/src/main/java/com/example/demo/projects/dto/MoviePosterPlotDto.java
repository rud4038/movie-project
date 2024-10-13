package com.example.demo.projects.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MoviePosterPlotDto {
	private List<Movieinfo> results;
	
	@Data
	public static class Movieinfo {
		@JsonProperty("original_title")
		private String title;
		private String overview;
		private String poster_path;
		@JsonProperty("release_date")
		private String openDt;
		private String backdrop_path;
	}
}
