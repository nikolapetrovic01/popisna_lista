package com.inventarlista.persistance.impl;

import com.inventarlista.entity.User;
import com.inventarlista.exceptions.UserNotFoundException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class loginJdbcDao {
    private final JdbcTemplate jdbcTemplate;
    
    public loginJdbcDao(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    public User findByUsername(String username) {
        String sql = "SELECT username, password, level, id FROM users WHERE username = ?";
        try {
        return jdbcTemplate.queryForObject(sql, new Object[]{username}, (rs, rowNum) ->
                new User(
                        rs.getString("username"),
                        rs.getString("password"),
                        rs.getInt("level"),
                        rs.getInt("id")
                ));
        }catch (EmptyResultDataAccessException e){
            throw new UserNotFoundException("User not found for username: " + username);
        }
    }
}