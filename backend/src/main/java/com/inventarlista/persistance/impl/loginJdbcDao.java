package com.inventarlista.persistance.impl;

import com.inventarlista.entity.User;
import com.inventarlista.exceptions.UserNotFoundException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class loginJdbcDao {
    public static final String SQL_SELECT_USER = "SELECT username, password, level, id FROM users WHERE username = ?";
    private final JdbcTemplate jdbcTemplate;
    
    public loginJdbcDao(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Finds a user in the database by their username.
     * @param username - The username to search for.
     * @return A User object if the username exists in the database.
     * @throws UserNotFoundException if the user with the specified username is not found.
     */
    public User findByUsername(String username) throws UserNotFoundException{
        try {
        return jdbcTemplate.queryForObject(SQL_SELECT_USER, new Object[]{username}, (rs, rowNum) ->
                new User(
                        rs.getString("username"),
                        rs.getString("password"),
                        rs.getInt("level"),
                        rs.getInt("id")
                ));
        }catch (EmptyResultDataAccessException  e){
            throw new UserNotFoundException("User not found for username: " + username);
        }
    }
}