package com.example.demo.projects.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class MovieDetailInfoDto {
	private String movieCd;
	private String movieName;
	private String nation;
	private String openDate;
	private String showTime;
	private String watchGrade;
	private String plot;
	private String posterUrl;
	private List<String> genres;
	private float score;
	private String backdropPath;
}
