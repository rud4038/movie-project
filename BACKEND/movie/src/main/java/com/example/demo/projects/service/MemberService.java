package com.example.demo.projects.service;



import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.example.demo.projects.dao.MyBatisMapper;
import com.example.demo.projects.dto.CommonMemberDto;
import com.example.demo.projects.dto.LoginDto;
import com.example.demo.projects.dto.LoginResponseDto;
import com.example.demo.projects.dto.MemberDto;
import com.example.demo.projects.dto.MemberKakaoDto;
import com.example.demo.projects.dto.ResponseDto;
import com.example.demo.projects.dto.SignUpDto;
import com.example.demo.projects.dto.memberDeleteDto;
import com.example.demo.projects.security.TokenProvider;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class MemberService {
	
	@Autowired MyBatisMapper myBatisMapper;
	@Autowired TokenProvider tokenProvider;
	
	public ResponseDto<LoginResponseDto> kakaoLogin(String accessToken) {
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "Bearer " + accessToken);
		headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
		
		HttpEntity<MultiValueMap<String, String>> kakaoUserInfoRequest = new HttpEntity<>(headers);
		RestTemplate rt = new RestTemplate();
		
		ResponseEntity<String> response = rt.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.POST,
                kakaoUserInfoRequest,
                String.class
        );
		
		String responseBody = response.getBody();
        ObjectMapper objectMapper = new ObjectMapper();
        try {
			JsonNode jsonNode = objectMapper.readTree(responseBody);
			
			String kakaoId = jsonNode.get("id").asText();
			String name = jsonNode.get("properties").get("nickname").asText();
			
			
			MemberKakaoDto memberKakaoDto = myBatisMapper.existsByKakaoId(kakaoId);
			
			MemberDto memberDto;
			
			if(memberKakaoDto != null) {
				int num = memberKakaoDto.getMemberId();
				memberDto = myBatisMapper.findMemberInfo(memberKakaoDto.getMemberId());
				
			}else {				
				memberDto = new MemberDto(0,name,"카카오");
				
				myBatisMapper.SingUp(memberDto);
				
				memberKakaoDto = new MemberKakaoDto(memberDto.getId(),kakaoId);
				
				myBatisMapper.KakaoSingUp(memberKakaoDto);

			}
			
			String token = tokenProvider.create(kakaoId);
			int exprTime = 3600000;
			
			LoginResponseDto loginResponseDto = new LoginResponseDto(token,exprTime,memberDto);
			
			
			return ResponseDto.setSucces(loginResponseDto, "로그인 성공");
			
		} catch (JsonProcessingException e) {
			e.printStackTrace();
			return ResponseDto.setFailed("로그인 실패");
		}
	}
	
	
	public ResponseDto<String> SingUp(SignUpDto signUpDto) {
		try {
			CommonMemberDto commonMemberDto = myBatisMapper.existsByEmail(signUpDto.getEmail());
			
			if(commonMemberDto != null) {
				return ResponseDto.setFailed("동일한 이메일이 존재합니다.");
			}
			MemberDto memberDto = new MemberDto(0,signUpDto.getName(),"일반");
			
			myBatisMapper.SingUp(memberDto);
			
			commonMemberDto = new CommonMemberDto(memberDto.getId(),signUpDto.getEmail(),signUpDto.getPassword());
			myBatisMapper.CommonSignUp(commonMemberDto);
			
			return ResponseDto.setSucces(null, "회원가입 성공");
			
		} catch (Exception e) {
			return ResponseDto.setFailed("회원가입 실패");
		}
	}
	
	public ResponseDto<LoginResponseDto> Login(LoginDto loginDto) {
		try {
			CommonMemberDto commonMemberDto = myBatisMapper.existsByEmail(loginDto.getEmail());
			
			if(commonMemberDto == null) {
				return ResponseDto.setFailed("존재하지 않는 이메일 입니다.");
			}
			
			if(!commonMemberDto.getPassword().equals(loginDto.getPassword())) {
				return ResponseDto.setFailed("비밀번호가 일치하지 않습니다.");
			}
			
			MemberDto memberDto = myBatisMapper.findMemberInfo(commonMemberDto.getMemberId());
			
			String token = tokenProvider.create(loginDto.getEmail());
			int exprTime = 3600000;
			
			LoginResponseDto loginResponseDto = new LoginResponseDto(token,exprTime,memberDto);
			
			
			return ResponseDto.setSucces(loginResponseDto, "로그인 성공");
			
		} catch (Exception e) {
			return ResponseDto.setFailed("로그인 실패");
		}
	}
	
	public ResponseDto<String> getEmail(int id){
		try {
			String email = myBatisMapper.getEmail(id);
			return ResponseDto.setSucces(email, "이메일 가져오기");
		} catch (Exception e) {
			return ResponseDto.setFailed("이메일 가져오기 실패");
		}
	}
	
	
	public ResponseDto<MemberDto> memberNameUpdate(MemberDto memberDto) {
		try {
			int result = myBatisMapper.memberNameUpdate(memberDto);
			if(result == 0) {
				return ResponseDto.setFailed("이름수정 실패");
			}
			MemberDto dto = myBatisMapper.findMemberInfo(memberDto.getId());
			return ResponseDto.setSucces(dto, "이름수정 완료");
		} catch (Exception e) {
			return ResponseDto.setFailed("이름수정 실패");
		}
	}
	
	public ResponseDto<String> memberDelete(memberDeleteDto memberDeleteDto) {
		try {
			if(memberDeleteDto.getProvider().equals("카카오")) {
				myBatisMapper.kakaoDelete(memberDeleteDto.getId());
				return ResponseDto.setSucces(null, "회원탈퇴 성공");
			}
			CommonMemberDto commonMemberDto = myBatisMapper.existsByEmail(memberDeleteDto.getEmail());
			
			if(!commonMemberDto.getPassword().equals(memberDeleteDto.getPassword())) {
				return ResponseDto.setFailed("비밀번호가 일치하지 않습니다.");
			}
			myBatisMapper.memberDelete(memberDeleteDto.getId());
			return ResponseDto.setSucces(null, "회원탈퇴 성공");
			
		} catch (Exception e) {
			return ResponseDto.setFailed("회원탈퇴 실패");
		}
	}
	
	
	
	
	
	
	
	
	
	
}
