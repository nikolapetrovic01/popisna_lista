package com.inventarlista.service;

import com.inventarlista.dto.createUserDto;
import com.inventarlista.dto.userDto;
import com.inventarlista.dto.userToUpdateDto;
import com.inventarlista.persistence.UsersJdbcDao;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class userServiceImpl {
    private final UsersJdbcDao usersJdbcDao;

    public userServiceImpl(UsersJdbcDao usersJdbcDao) {
        this.usersJdbcDao = usersJdbcDao;
    }

    /**
     * Retrieves all Users from the database.
     *
     * @return A List of user DTOs containing all users.
     */
    public List<userDto> getAllUsers() {
        return usersJdbcDao.getAllUsers();
    }

    /**
     * Creates a new user in the database.
     *
     * @param createUserDto The DTO containing the details for the new user.
     */
    public void createNewUser(createUserDto createUserDto) {
        usersJdbcDao.createNewUser(createUserDto);
    }

    /**
     * Deletes a user from the database by ID.
     *
     * @param userId The ID of the user to delete.
     */
    public void deleteUser(int userId) {
        usersJdbcDao.deleteUser(userId);
    }

    public void updateUser(userToUpdateDto user) {
        usersJdbcDao.updateUser(user);
    }
}
