package com.example.demo.projects.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor(staticName = "set")
@Data
public class ResponseDto<D> {
	private boolean result;
	private D data;
	private String message;
	
	public static <D> ResponseDto<D> setSucces(D data, String message){
		return ResponseDto.set(true, data, message);
	}
	public static <D> ResponseDto<D> setFailed(String message){
		return ResponseDto.set(false, null, message);
	}

}
