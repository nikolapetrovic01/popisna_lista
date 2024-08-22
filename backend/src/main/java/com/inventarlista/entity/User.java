package com.inventarlista.entity;

public class User {
    private String username;
    private String password;
    private int level, id;

    public User(String username, String password, int level, int id) {
        this.username = username;
        this.password = password;
        this.level = level;
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getLevel() {
        return level;
    }

    public void setLevel(int level) {
        this.level = level;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}