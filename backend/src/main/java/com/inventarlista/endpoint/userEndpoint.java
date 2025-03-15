package com.inventarlista.endpoint;

import com.inventarlista.dto.createUser;
import com.inventarlista.dto.selectedItems;
import com.inventarlista.dto.user;
import com.inventarlista.service.userServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
     * @return An List of user DTOs object containing all users.
     */
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @GetMapping("/controller/get-users")
    public List<user> getAllUsers() {
        return userService.getAllUsers();
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PostMapping("/controller/create")
    public ResponseEntity<Void> createNewInventory(@RequestBody createUser createUser) {
        System.out.println(createUser);
        userService.createNewUser(createUser);
        return ResponseEntity.ok().build();
    }
}
