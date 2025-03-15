package com.inventarlista.persistence;

import com.inventarlista.dto.createUser;
import com.inventarlista.dto.user;
import com.inventarlista.exceptions.NotFoundException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public class UsersJdbcDao {
    public static final String SQL_SELECT_USERS = "SELECT username, level, id FROM users";
    public static final String SQL_CREATE_USER = "INSERT INTO users (username, password, level)\n" +
            "VALUES (?, ?, ?);";
    private final JdbcTemplate jdbcTemplate;

    public UsersJdbcDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<user> getAllUsers() throws NotFoundException {
        try {
            return jdbcTemplate.query(SQL_SELECT_USERS, userRowMapper);
        } catch (EmptyResultDataAccessException e){
            throw new NotFoundException("User not found for username");
        }
    }

    private final RowMapper<user> userRowMapper = (rs, rowNum) -> new user(
            rs.getInt("id"),
            rs.getString("username"),
            rs.getInt("level")

    );

    public void createNewUser(createUser createUser) {
        jdbcTemplate.update(SQL_CREATE_USER, createUser.name(), createUser.password(), createUser.level());
    }
}
