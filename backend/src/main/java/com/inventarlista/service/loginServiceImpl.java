package com.inventarlista.service;

import com.inventarlista.dto.loginRequestDto;
import com.inventarlista.dto.loginResponseDto;
import com.inventarlista.entity.User;
import com.inventarlista.exceptions.InvalidCredentialsException;
import com.inventarlista.exceptions.UserNotFoundException;
import com.inventarlista.persistance.impl.loginJdbcDao;
import org.springframework.stereotype.Service;

import javax.naming.AuthenticationException;

@Service
public class loginServiceImpl {
    private final loginJdbcDao loginJdbcDao;

    public loginServiceImpl(loginJdbcDao loginJdbcDao) {
        this.loginJdbcDao = loginJdbcDao;
    }

    //    public loginResponseDto validateUser(loginRequestDto request)
//            throws AuthenticationException, UserNotFoundException {
//        try {
//            User user = loginJdbcDao.findByUsername(request.name());
//            if (user.getPassword().equals(request.password())) {
//                return new loginResponseDto(user.getUsername(), user.getLevel(), user.getId());
//            }else {
//                throw new AuthenticationException("Invalid password");
//            }
//        }catch (UserNotFoundException e){
//            throw new AuthenticationException("User not found: " + request.name());
//        }
//    }
    public loginResponseDto validateUser(loginRequestDto request) {
        User user = loginJdbcDao.findByUsername(request.name());
        if (user.getPassword().equals(request.password())) {
            return new loginResponseDto(user.getUsername(), user.getLevel(), user.getId());
        } else {
            throw new InvalidCredentialsException("Invalid password");
        }
    }
}