package com.inventarlista.security.JWT;
import com.inventarlista.config.properties.SecurityProperties;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;


import org.springframework.stereotype.Component;
import java.util.Date;
import java.util.List;

@Component
public class JwtTokenizer {
    private final SecurityProperties securityProperties;

    public JwtTokenizer(SecurityProperties securityProperties) {
        this.securityProperties = securityProperties;
    }

    public String generateToken(String name, List<String> roles, boolean rememberMe) {
        byte[] signingKey = securityProperties.getJwtSecret().getBytes();
        SecretKey key = Keys.hmacShaKeyFor(signingKey);

        long expirationTime = rememberMe
                ? securityProperties.getJwtRememberMeExpirationTime()
                : securityProperties.getJwtExpirationTime();


        String token = Jwts.builder()
                .issuer(securityProperties.getJwtIssuer())
                .subject(name)
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .claim("roles", roles)
                .signWith(key, Jwts.SIG.HS256)
                .compact();
        return securityProperties.getAuthTokenPrefix() + token;
    }
}
