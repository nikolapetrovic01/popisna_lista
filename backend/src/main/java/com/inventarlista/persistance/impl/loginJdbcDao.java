package com.inventarlista.persistance.impl;

import com.inventarlista.entity.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class loginJdbcDao {
    private final JdbcTemplate jdbcTemplate;
    
    public loginJdbcDao(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    public User findByUsername(String username) {
        System.out.println("Reached database");
        String sql = "SELECT username, password, level FROM users WHERE username = ?";
        //TODO: CHECK
//        return jdbcTemplate.queryForObject(sql, new Object[]{username}, (rs, rowNum) ->
//                new User(
//                        rs.getString("username"),
//                        rs.getString("password"),
//                        rs.getInt("level")
//                ));
        return new User("Marko", "123", 1);
    }
}
