package com.example.demo.projects.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ComentResponseDto {
	private int id;
	private String movieCd;
	private int memberId;
	private String memberName;
	private String coment;
	private float score;
	private int recomendationCount;
}
