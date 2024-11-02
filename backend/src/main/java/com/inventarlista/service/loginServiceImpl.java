package com.inventarlista.service;

import com.inventarlista.dto.loginRequestDto;
import com.inventarlista.dto.loginResponseDto;
import com.inventarlista.entity.User;
import com.inventarlista.exceptions.InvalidCredentialsException;
import com.inventarlista.exceptions.NotFoundException;
import com.inventarlista.persistance.impl.loginJdbcDao;
import org.springframework.stereotype.Service;

@Service
public class loginServiceImpl {
    private final loginJdbcDao loginJdbcDao;

    /**
     * Constructor-based dependency injection for loginJdbcDao.
     *
     * @param loginJdbcDao Data access object for login operations
     */
    public loginServiceImpl(loginJdbcDao loginJdbcDao) {
        this.loginJdbcDao = loginJdbcDao;
    }

    /**
     * Validates the user based on the provided login request data.
     * Retrieves user details by username and compares the provided password.
     *
     * @param request Contains the login credentials (username and password)
     * @return loginResponseDto containing the user's details if validation is successful
     * @throws NotFoundException if the username is not found in the database
     * @throws InvalidCredentialsException if the provided password does not match the stored password
     */
    public loginResponseDto validateUser(loginRequestDto request) {
        User user;
        try {
            user = loginJdbcDao.findByUsername(request.name());
        } catch (NotFoundException e) {
            throw new NotFoundException("User not found: " + request.name());
        }

        if (user.getPassword().equals(request.password())) {
            return new loginResponseDto(user.getUsername(), user.getLevel(), user.getId());
        } else {
            throw new InvalidCredentialsException("Invalid password");
        }
    }
}