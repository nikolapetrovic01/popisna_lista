package com.inventarlista.service;

import com.inventarlista.dto.loginRequestDto;
import com.inventarlista.dto.loginResponseDto;
import com.inventarlista.entity.User;
import com.inventarlista.persistance.impl.loginJdbcDao;
import org.springframework.stereotype.Service;

import javax.naming.AuthenticationException;

@Service
public class loginServiceImpl {
    private final loginJdbcDao loginJdbcDao;

    public loginServiceImpl(loginJdbcDao loginJdbcDao){
        this.loginJdbcDao = loginJdbcDao;
    }

    public loginResponseDto validateUser(loginRequestDto request) throws AuthenticationException {
        System.out.println("Reached service");
        User user = loginJdbcDao.findByUsername(request.name());

        if (user != null && user.getPassword().equals(request.password())) {
            System.out.println(user.getPassword());
            System.out.println(user.getUsername());
            return new loginResponseDto(user.getUsername(), user.getLevel());
        } else {
            System.out.println("Error in Service");
            System.out.println("Request" + request.name() + " " + request.password());
            System.out.println("Marko");
            System.out.println(user.getPassword());
            System.out.println(user.getUsername());
            throw new AuthenticationException("Invalid username or password");
        }
    }

}
