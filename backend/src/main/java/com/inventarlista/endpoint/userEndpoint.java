package com.inventarlista.endpoint;

import com.inventarlista.dto.*;
import com.inventarlista.service.userServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class userEndpoint {
    private final userServiceImpl userService;

    public userEndpoint(userServiceImpl userService) {
        this.userService = userService;
    }

    /**
     * Retrieves all Users.
     *
     * @return A List of user DTOs object containing all users.
     */
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @GetMapping("/controller/get-users")
    public List<userDto> getAllUsers() {
        return userService.getAllUsers();
    }

    /**
     * Creates a new User.
     *
     * @param createUserDto The DTO containing the details for the new user.
     * @return A ResponseEntity with status 200 (OK) on successful creation.
     */
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PostMapping("/controller/create")
    public ResponseEntity<Void> createNewInventory(@RequestBody createUserDto createUserDto) {
        userService.createNewUser(createUserDto);
        return ResponseEntity.ok().build();
    }

    /**
     * Deletes a User by ID.
     *
     * @param user The DTO containing the ID of the user to be deleted.
     * @return A ResponseEntity with status 200 (OK) on successful deletion.
     */
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PostMapping("/controller/user-deletion")
    public ResponseEntity<Void> deleteUser(@RequestBody userToDeleteDto user) {
        userService.deleteUser(user.id());
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PutMapping("/controller/user-edit")
    public ResponseEntity<Void> updateUser(@RequestBody userToUpdateDto user) {
        userService.updateUser(user);
        return ResponseEntity.ok().build();
    }
}
