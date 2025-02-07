package com.inventarlista.service;

import com.inventarlista.dto.loginRequestDto;
import com.inventarlista.dto.loginResponseDto;
import com.inventarlista.exceptions.UnauthorizedException;
import com.inventarlista.persistence.loginJdbcDao;
import com.inventarlista.security.JWT.JwtTokenizer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import com.inventarlista.entity.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class loginServiceImpl {
    private final loginJdbcDao loginJdbcDao;
    private final JwtTokenizer jwtTokenizer;

    /**
     * Constructor-based dependency injection for loginJdbcDao.
     *
     * @param loginJdbcDao Data access object for login operations
     */
    public loginServiceImpl(loginJdbcDao loginJdbcDao, JwtTokenizer jwtTokenizer) {
        this.loginJdbcDao = loginJdbcDao;
        this.jwtTokenizer = jwtTokenizer;
    }

    public loginResponseDto authenticateAndIssueToken(loginRequestDto request) {
        UserDetails userDetails = loadUserByUsername(request.name());

        if (userDetails.isAccountNonExpired() && userDetails.isAccountNonLocked() && userDetails.isCredentialsNonExpired() && userDetails.getPassword().equals(request.password())) {

            List<String> roles = userDetails.getAuthorities()
                    .stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();

            String token = jwtTokenizer.generateToken(userDetails.getUsername(), roles);
            User user = findApplicationUserByUsername(request.name());

            return new loginResponseDto(user.getUsername(), user.getLevel(), user.getId(), token);
        }

        throw new UnauthorizedException("Invalid login");
    }

    private UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
            User applicationUser = findApplicationUserByUsername(username);

            List<GrantedAuthority> grantedAuthorities = switch (applicationUser.getLevel()) {
                case 0 -> AuthorityUtils.createAuthorityList("ROLE_ADMIN", "ROLE_MANAGER", "ROLE_WORKER_ADMIN", "ROLE_WORKER");
                case 1 -> AuthorityUtils.createAuthorityList("ROLE_MANAGER", "ROLE_WORKER_ADMIN", "ROLE_WORKER");
                case 2 -> AuthorityUtils.createAuthorityList( "ROLE_WORKER_ADMIN", "ROLE_WORKER");
                case 3 -> AuthorityUtils.createAuthorityList(  "ROLE_WORKER");
                default -> throw new UnauthorizedException("Invalid user role");
            };

            return new org.springframework.security.core.userdetails.User(
                    applicationUser.getUsername(),
                    applicationUser.getPassword(),
                    grantedAuthorities
            );
    }

    private User findApplicationUserByUsername(String username) {
        User applicationUser = loginJdbcDao.findByUsername(username);
        if (applicationUser != null) {
            return applicationUser;
        }

        throw new UnauthorizedException("Invalid login");
    }
}