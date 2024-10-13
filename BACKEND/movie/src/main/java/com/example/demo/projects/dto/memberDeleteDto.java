package com.example.demo.projects.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class memberDeleteDto {
	private int id;
	private String provider;
	private String email;
	private String password;
}
