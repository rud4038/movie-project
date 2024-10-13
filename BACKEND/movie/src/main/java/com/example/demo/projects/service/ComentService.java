package com.example.demo.projects.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.projects.dao.MyBatisMapper;
import com.example.demo.projects.dto.ComentDto;
import com.example.demo.projects.dto.ComentResponseDto;
import com.example.demo.projects.dto.ComentScoreUpdateDto;
import com.example.demo.projects.dto.ComentSearchDto;
import com.example.demo.projects.dto.MemberDto;
import com.example.demo.projects.dto.RecomendationDto;
import com.example.demo.projects.dto.ResponseDto;

@Service
public class ComentService {
	@Autowired MyBatisMapper myBatisMapper;
	
	public ResponseDto<String> ComentSave(ComentDto comentDto) {
		try {
			myBatisMapper.ComentSave(comentDto);
			if(comentDto.getId() != 0) {
				return ResponseDto.setSucces(null, "댓글 저장성공");
			}
			return ResponseDto.setFailed("댓글 저장실패");
		} catch (Exception e) {
			e.getStackTrace();
			return ResponseDto.setFailed("댓글 저장실패");
		}
	}
	
	public ResponseDto<List<ComentResponseDto>> ComentListLoad(String movieCd) {
		try {
			List<ComentResponseDto> comentList = myBatisMapper.getComentList(movieCd);
			return ResponseDto.setSucces(comentList, "댓글 리스트 불러오기성공");
		} catch (Exception e) {
			return ResponseDto.setFailed("댓글 불러오기 실패");
		}
	}
	public ResponseDto<ComentResponseDto> MyComentLoad(ComentSearchDto comentSearchDto) {
		try {
			ComentResponseDto comentList = myBatisMapper.getMyComent(comentSearchDto);
			return ResponseDto.setSucces(comentList, "댓글  불러오기성공");
		} catch (Exception e) {
			return ResponseDto.setFailed("댓글 불러오기 실패");
		}
	}
	
	
	
	public ResponseDto<String> RecomendationSave(RecomendationDto recomendationDto) {
		try {
			RecomendationDto check = myBatisMapper.findeRecomendation(recomendationDto);
			
			if(check != null) {
				return ResponseDto.setFailed("이미 추천하셨습니다");
			}
			
			myBatisMapper.RecomendationSave(recomendationDto);
			return ResponseDto.setSucces(null, "추천완료");
		} catch (Exception e) {
			return ResponseDto.setFailed("추천실패");
		}
	}
	
	public ResponseDto<String> RecomendationDelete(RecomendationDto recomendationDto) {
		try {
			myBatisMapper.DeleteRecomendation(recomendationDto);
			return ResponseDto.setSucces(null, "추천취소완료");
		} catch (Exception e) {
			return ResponseDto.setFailed("추천취소실패");
		}
	}
	
	public ResponseDto<List<Integer>> RecomendationList(int memberId) {
		try {
			List<Integer> recomendationList = myBatisMapper.RecomendationList(memberId);
			return ResponseDto.setSucces(recomendationList, "추천목록 불러오기 성공");
		} catch (Exception e) {
			return ResponseDto.setFailed("추천목록 불러오기 실패");
		}
	}
	
	public ResponseDto<String> ComentScoreUpdate(ComentScoreUpdateDto scoreUpdateDto) {
		try {
			int result = myBatisMapper.ComentScoreUpdate(scoreUpdateDto);
			if(result == 0) {
				return ResponseDto.setFailed("별정등록 실패");
			}
			return ResponseDto.setSucces(null, "별정등록 성공");
		} catch (Exception e) {
			return ResponseDto.setFailed("별정등록 실패");
		}
	}
	
	public ResponseDto<String> ComentUpdate(ComentDto comentDto){
		try {
			int result = myBatisMapper.ComentUpdate(comentDto);
			if(result == 0) {
				return ResponseDto.setFailed("코멘트 수정 실패");
			}
			return ResponseDto.setSucces(null, "코멘트 수정 성공");
		} catch (Exception e) {
			return ResponseDto.setFailed("코멘트 수정 실패");
		}
	}
	
	public ResponseDto<String> ComentDelete(int id) {
		try {
			int result = myBatisMapper.ComentDelete(id);
			if(result == 0) {
				return ResponseDto.setFailed("코멘트 삭제 실패");
			}
			return ResponseDto.setSucces(null, "코멘트 삭제 성공");
		} catch (Exception e) {
			return ResponseDto.setFailed("코멘트 삭제 실패");
		}
	}
	
	public ResponseDto<ComentResponseDto> ComentLoad(int id) {
		try {
			ComentResponseDto comentList = myBatisMapper.getComent(id);
			return ResponseDto.setSucces(comentList, "댓글  불러오기성공");
		} catch (Exception e) {
			return ResponseDto.setFailed("댓글 불러오기 실패");
		}
	}
	
	public ResponseDto<List<ComentResponseDto>> getComentListByRecomendation (String movieCd){
		try {
			List<ComentResponseDto> responseDtos = myBatisMapper.getComentListByRecomendation(movieCd);
			return ResponseDto.setSucces(responseDtos, "추천순 코멘트 리스트");
		} catch (Exception e) {
			return ResponseDto.setFailed("코멘트 리스트 불러오기 실패");
		}
	}
	
	public ResponseDto<List<ComentResponseDto>> getComentListByScoreDesc (String movieCd){
		try {
			List<ComentResponseDto> responseDtos = myBatisMapper.getComentListByScoreDesc(movieCd);
			return ResponseDto.setSucces(responseDtos, "높은 점수 코멘트 리스트");
		} catch (Exception e) {
			return ResponseDto.setFailed("코멘트 리스트 불러오기 실패");
		}
	}
	
	public ResponseDto<List<ComentResponseDto>> getComentListByScore (String movieCd){
		try {
			List<ComentResponseDto> responseDtos = myBatisMapper.getComentListByScore(movieCd);
			return ResponseDto.setSucces(responseDtos, "낮은 점수 코멘트 리스트");
		} catch (Exception e) {
			return ResponseDto.setFailed("코멘트 리스트 불러오기 실패");
		}
	}
	
	public ResponseDto<String> comentNameUpdate(MemberDto memberDto) {
		try {
			int result = myBatisMapper.comentNameUpdate(memberDto);
			if(result == 0) {
				return ResponseDto.setFailed("이름수정 실패");
			}
			return ResponseDto.setSucces(null, "이름수정 완료");
		} catch (Exception e) {
			return ResponseDto.setFailed("이름수정 실패");
		}
	}
	
	public ResponseDto<String> recomendationAllDelete(int id) {
		try {
			myBatisMapper.recomendationAllDelete(id);
			return ResponseDto.setSucces(null, "추천목록 삭제 완료");
		} catch (Exception e) {
			return ResponseDto.setFailed("추천목록 삭제 실패");
		}
	}
	
	public ResponseDto<String> comentAllDelete(int id) {
		try {
			myBatisMapper.comentAllDelete(id);
			return ResponseDto.setSucces(null, "코멘트목록 삭제 완료");
		} catch (Exception e) {
			return ResponseDto.setFailed("코멘트목록 삭제 실패");
		}
	}
}
