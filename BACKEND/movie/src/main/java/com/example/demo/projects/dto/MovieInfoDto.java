package com.example.demo.projects.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class MovieInfoDto {
	private String movieCd;
	private String movieName;
	private String nation;
	private String openDate;
	private String showTime;
	private String watchGrade;
	private String plot;
	private String posterUrl;
	private String backdropPath;
}
