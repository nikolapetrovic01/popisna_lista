package com.inventarlista.persistence;

import com.inventarlista.dto.createUser;
import com.inventarlista.dto.user;
import com.inventarlista.exceptions.NotFoundException;
import org.springframework.dao.DataAccessException;
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
    public static final String SQL_DELETE_USER = "DELETE FROM users WHERE id = ?;";
    private final JdbcTemplate jdbcTemplate;

    public UsersJdbcDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Retrieves a list of all users from the database.
     *
     * @return A list of {@link user} DTOs.
     * @throws NotFoundException if no users are found in the database (or if an unexpected empty result occurs,
     * although usually, an empty list is returned for no results).
     */
    public List<user> getAllUsers() throws NotFoundException {
        try {
            return jdbcTemplate.query(SQL_SELECT_USERS, userRowMapper);
        } catch (EmptyResultDataAccessException e) {
            throw new NotFoundException("User not found for username.");
        }
    }

    /**
     * Maps a row of the JDBC ResultSet to a {@link user} DTO.
     * It extracts the 'id', 'username', and 'level' columns.
     */
    private final RowMapper<user> userRowMapper = (rs, rowNum) -> new user(
            rs.getInt("id"),
            rs.getString("username"),
            rs.getInt("level")
    );

    /**
     * Creates a new user in the database.
     *
     * @param createUser The DTO containing the name, raw password, and level for the new user.
     */
    public void createNewUser(createUser createUser) {
        jdbcTemplate.update(SQL_CREATE_USER, createUser.name(), createUser.password(), createUser.level());
    }

    /**
     * Deletes a user from the database by their ID.
     * Uses jdbcTemplate.update() for the DELETE operation.
     *
     * @param userId The ID of the user to delete.
     * @throws DataAccessException if there is any issue with the database operation.
     */
    public void deleteUser(int userId) {
        try {
            int rowsAffected = jdbcTemplate.update(SQL_DELETE_USER, userId);

            // Optional: Log or check if the user was actually deleted
            if (rowsAffected == 0) {
                //TODO: ADD LOGS
            } else {
            }
        } catch (DataAccessException e) {
            throw new NotFoundException("Users couldn't be deleted.");
        }
    }
}
