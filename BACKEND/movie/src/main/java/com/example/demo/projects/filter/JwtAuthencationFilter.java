package com.example.demo.projects.filter;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.demo.projects.security.TokenProvider;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthencationFilter extends OncePerRequestFilter {
	
	@Autowired TokenProvider tokenProvider;
	
	@Override
	protected void doFilterInternal(HttpServletRequest request , HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
				try {
					String token = parseBearerToken(request);
					if(token != null && !token.equalsIgnoreCase("null")) {
						String id = tokenProvider.validate(token);
						
						AbstractAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(id, null,AuthorityUtils.NO_AUTHORITIES);
						authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
						
						SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
						securityContext.setAuthentication(authenticationToken);
						SecurityContextHolder.setContext(securityContext);
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
				filterChain.doFilter(request, response);
			}
	
	private String parseBearerToken(HttpServletRequest request) {
		String bearertoken = request.getHeader("Authorization");
		
		if(StringUtils.hasText(bearertoken) && bearertoken.startsWith("Bearer "))
			return bearertoken.substring(7);
		return null;
	}

}
