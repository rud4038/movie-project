package com.example.demo.projects.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.projects.dto.LoginDto;
import com.example.demo.projects.dto.LoginResponseDto;
import com.example.demo.projects.dto.MemberDto;
import com.example.demo.projects.dto.ResponseDto;
import com.example.demo.projects.dto.SignUpDto;
import com.example.demo.projects.dto.memberDeleteDto;
import com.example.demo.projects.service.MemberService;

@RestController
@RequestMapping("/member")
public class MemberController {
	
	@Autowired MemberService memberService;
	
	@GetMapping("/kakaoLogin/{accessToken}")
	public ResponseDto<LoginResponseDto> KakaoLogin (@PathVariable("accessToken") String accessToken) {
		return memberService.kakaoLogin(accessToken);
	}
	
	@PostMapping("/singUp")
	public ResponseDto<String> SingUp(@RequestBody SignUpDto signUpDto) {
		return memberService.SingUp(signUpDto);
	}
	
	@PostMapping("/login")
	public ResponseDto<LoginResponseDto> Login(@RequestBody LoginDto loginDto) {
		return memberService.Login(loginDto);
	}
	
	@GetMapping("getEmail/{id}")
	public ResponseDto<String> getEmail(@PathVariable("id") int id) {
		return memberService.getEmail(id);
	}
	
	@PostMapping("/nameUpdate")
	public ResponseDto<MemberDto> memberNameUpdate(@RequestBody MemberDto memberDto) {
		return memberService.memberNameUpdate(memberDto);
	}
	
	@PostMapping("/delete")
	public ResponseDto<String> memberDelete(@RequestBody memberDeleteDto memberDeleteDto) {
		return memberService.memberDelete(memberDeleteDto);
	}
	
}
