package com.example.demo.projects.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.projects.dto.ComentDto;
import com.example.demo.projects.dto.ComentResponseDto;
import com.example.demo.projects.dto.ComentScoreUpdateDto;
import com.example.demo.projects.dto.ComentSearchDto;
import com.example.demo.projects.dto.MemberDto;
import com.example.demo.projects.dto.RecomendationDto;
import com.example.demo.projects.dto.ResponseDto;
import com.example.demo.projects.service.ComentService;

@RestController
@RequestMapping("/coment")
public class ComentController {
	
	@Autowired ComentService comentService;
	
	@PostMapping("/save")
	public ResponseDto<String> ComentSave(@RequestBody ComentDto comentDto){
		return comentService.ComentSave(comentDto);
	}
	
	@GetMapping("/CometList/{movieCd}")
	public ResponseDto<List<ComentResponseDto>> ComentListLoad(@PathVariable("movieCd") String movieCd) {
		return comentService.ComentListLoad(movieCd);
	}
	
	@PostMapping("/myComent")
	public ResponseDto<ComentResponseDto> MyComentLoad(@RequestBody ComentSearchDto comentSearchDto) {
		System.out.println(comentSearchDto);
		return comentService.MyComentLoad(comentSearchDto);
	}
	
	@PostMapping("/recomendation")
	public ResponseDto<String> RecomendationSave(@RequestBody RecomendationDto recomendationDto){
		return comentService.RecomendationSave(recomendationDto);
	}
	
	@PostMapping("/recomendationDelete")
	public ResponseDto<String> RecomendationDelete(@RequestBody RecomendationDto recomendationDto) {
		return comentService.RecomendationDelete(recomendationDto);
	}
	
	@GetMapping("/recomendationList/{memberId}")
	public ResponseDto<List<Integer>> RecomendationList(@PathVariable("memberId") int memberId) {
		return comentService.RecomendationList(memberId);
	}
	
	@PostMapping("/scoreUpdate")
	public ResponseDto<String> ComentScoreUpdate(@RequestBody ComentScoreUpdateDto scoreUpdateDto) {
		return comentService.ComentScoreUpdate(scoreUpdateDto);
	}
	
	@PostMapping("/comentUpdate")
	public ResponseDto<String> ComentUpdate(@RequestBody ComentDto comentDto){
		return comentService.ComentUpdate(comentDto);
	}
	
	@GetMapping("/comentDelete/{id}")
	public ResponseDto<String> ComentDelete(@PathVariable("id") int id) {
		return comentService.ComentDelete(id);
	}
	
	@GetMapping("/getComent/{id}")
	public ResponseDto<ComentResponseDto> ComentLoad(@PathVariable("id") int id) {
		return comentService.ComentLoad(id);
	}
	
	@GetMapping("/ByRecomendation/{movieCd}")
	public ResponseDto<List<ComentResponseDto>> getComentListByRecomendation (@PathVariable("movieCd") String movieCd) {
		return comentService.getComentListByRecomendation(movieCd);
	}
	
	@GetMapping("/ByScoreDesc/{movieCd}")
	public ResponseDto<List<ComentResponseDto>> getComentListByScoreDesc (@PathVariable("movieCd") String movieCd) {
		return comentService.getComentListByScoreDesc(movieCd);
	}
	
	@GetMapping("/ByScore/{movieCd}")
	public ResponseDto<List<ComentResponseDto>> getComentListByScore (@PathVariable("movieCd") String movieCd) {
		return comentService.getComentListByScore(movieCd);
	}
	
	@PostMapping("/nameUpdate")
	public ResponseDto<String> comentNameUpdate(@RequestBody MemberDto memberDto){
		return comentService.comentNameUpdate(memberDto);
	}
	
	@GetMapping("/recomendationAllDelete/{id}")
	public ResponseDto<String> recomendationAllDelete(@PathVariable("id") int id){
		return comentService.recomendationAllDelete(id);
	}
	
	@GetMapping("comentAllDelete/{id}")
	public ResponseDto<String> comentAllDelete(@PathVariable("id") int id){
		return comentService.comentAllDelete(id);
	}

}
