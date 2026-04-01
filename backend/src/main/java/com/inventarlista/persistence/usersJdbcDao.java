package com.inventarlista.persistence;

import com.inventarlista.dto.createUserDto;
import com.inventarlista.dto.userDto;
import com.inventarlista.dto.userPasswordToUpdate;
import com.inventarlista.dto.userToUpdateDto;
import com.inventarlista.exceptions.NotFoundException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class usersJdbcDao {
    public static final String SQL_SELECT_USERS = "SELECT username, level, id FROM users";
    public static final String SQL_CREATE_USER = "INSERT INTO users (username, password, level)\n" +
            "VALUES (?, ?, ?);";
    public static final String SQL_DELETE_USER = "DELETE FROM users WHERE id = ?;";
    private static final String SQL_UPDATE_USER = "UPDATE users SET username = ?, level = ? WHERE id = ?";
    private static final String SQL_UPDATE_PASSWORD = "UPDATE users SET password = ? WHERE id = ?";
    private final JdbcTemplate jdbcTemplate;
    private final BCryptPasswordEncoder passwordEncoder;

    public usersJdbcDao(JdbcTemplate jdbcTemplate, BCryptPasswordEncoder passwordEncoder) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Retrieves a list of all users from the database.
     *
     * @return A list of {@link userDto} DTOs.
     * @throws NotFoundException if no users are found in the database (or if an unexpected empty result occurs,
     *                           although usually, an empty list is returned for no results).
     */
    public List<userDto> getAllUsers() throws NotFoundException {
        try {
            return jdbcTemplate.query(SQL_SELECT_USERS, userRowMapper);
        } catch (EmptyResultDataAccessException e) {
            throw new NotFoundException("User not found for username.");
        }
    }

    /**
     * Maps a row of the JDBC ResultSet to a {@link userDto} DTO.
     * It extracts the 'id', 'username', and 'level' columns.
     */
    private final RowMapper<userDto> userRowMapper = (rs, rowNum) -> new userDto(
            rs.getInt("id"),
            rs.getString("username"),
            rs.getInt("level")
    );

    /**
     * Creates a new user in the database.
     *
     * @param createUserDto The DTO containing the name, raw password, and level for the new user.
     */
    public void createNewUser(createUserDto createUserDto) {
        String hashedPassword = passwordEncoder.encode(createUserDto.password());
        jdbcTemplate.update(SQL_CREATE_USER, createUserDto.name(), hashedPassword, createUserDto.level());
    }
    /* Ako odlučimo dodatni ograničenje na jedinstvenost imena korisnika
    Ovo se treba zvati kao provjera u Service nivou
    public boolean userExistsByName(String name) {
        Integer count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM users WHERE name = ?",
            Integer.class,
            name
        );
        return count != null && count > 0;
    }
     */

    /**
     * Deletes a user from the database by their ID.
     *
     * @param userId The ID of the user to delete.
     * @return A boolean if any row in the database was affected.
     */
    public boolean deleteUser(int userId) {
        int rowsAffected = jdbcTemplate.update(SQL_DELETE_USER, userId);

        return rowsAffected != 0;
    }

    /**
     * Update the user with data from the DTO.
     *
     * @param user The user to be updated.
     * @return A boolean if any row in the database was affected.
     */
    public boolean updateUser(userToUpdateDto user) {
        int rowsAffected = jdbcTemplate.update(SQL_UPDATE_USER, user.name(), user.level(), user.id());

        return rowsAffected != 0;
    }

    /**
     * Updates the users password in the database.
     * @param userId The id of the user.
     * @param plainPassword The plain text of the new password.
     * @return A boolean if any row in the database was affected.
     */
    public boolean updateUserPassword(int userId, String plainPassword) {
        String hashedPassword = passwordEncoder.encode(plainPassword);
        int rowsAffected = jdbcTemplate.update(SQL_UPDATE_PASSWORD, hashedPassword, userId );
        return rowsAffected != 0;
    }

}
