package com.example.demo.projects.security;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class TokenProvider {
	private static final String SECURITY_KEY = "jwtseckey!@";
	
	public String create (String Id) {
		Date exprTime = Date.from(Instant.now().plus(1,ChronoUnit.HOURS));
		
		return Jwts.builder()
				.signWith(SignatureAlgorithm.HS512,SECURITY_KEY)
				.setSubject(Id).setIssuedAt(new Date()).setExpiration(exprTime)
				.compact();
	}
	
	public String validate(String token) {
		Claims claims = Jwts.parser().setSigningKey(SECURITY_KEY).parseClaimsJws(token).getBody();
		
		return claims.getSubject();
	}

}
