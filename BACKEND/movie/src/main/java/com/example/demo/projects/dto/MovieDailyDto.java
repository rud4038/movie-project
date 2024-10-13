package com.example.demo.projects.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@NoArgsConstructor
@AllArgsConstructor
@Data
public class MovieDailyDto {
	private BoxOfficeResult boxOfficeResult;
	
	@Data
	public static class BoxOfficeResult {
		private List<DailyBoxOfficeList> dailyBoxOfficeList;
	}
	
	@Data
	public static class DailyBoxOfficeList {
		private String movieCd;
	}
}
