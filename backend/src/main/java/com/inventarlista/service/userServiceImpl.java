package com.inventarlista.service;

import com.inventarlista.dto.createUser;
import com.inventarlista.dto.user;
import com.inventarlista.persistence.UsersJdbcDao;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class userServiceImpl {
    private final UsersJdbcDao usersJdbcDao;

    public userServiceImpl(UsersJdbcDao usersJdbcDao) {
        this.usersJdbcDao = usersJdbcDao;
    }

    public List<user> getAllUsers() {
        return usersJdbcDao.getAllUsers();
    }

    public void createNewUser(createUser createUser) {
        usersJdbcDao.createNewUser(createUser);
    }
}
