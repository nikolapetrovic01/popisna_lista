package com.inventarlista.service;

import com.inventarlista.dto.createUserDto;
import com.inventarlista.dto.userDto;
import com.inventarlista.dto.userToUpdateDto;
import com.inventarlista.dto.userToDeleteDto;
import com.inventarlista.exceptions.ConflictException;
import com.inventarlista.exceptions.NotFoundException;
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
     * @param user The DTO containing the details of the user to delete.
     */
    public void deleteUser(userToDeleteDto user ) throws ConflictException {
        if (user.idToDelete() != user.idLoggedIn()) {
            if (!usersJdbcDao.deleteUser(user.idToDelete())) {
                throw new NotFoundException("User wasn't found.");
            }
        } else {
            throw new ConflictException("A user cannot delete themselves.");
        }
    }

    /**
     * Updates a User.
     *
     * @param user The DTO containing the details of the user to update.
     */
    public void updateUser(userToUpdateDto user) {
        if (!usersJdbcDao.updateUser(user)) {
            throw new NotFoundException("User wasn't found.");
        }
    }
}
