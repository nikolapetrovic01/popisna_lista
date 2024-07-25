package com.inventarlista.persistance.impl;

import com.inventarlista.entity.Inventory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collection;

@Repository
public class inventoryJdbcDao {
    private final JdbcTemplate jdbcTemplate;

    public inventoryJdbcDao(JdbcTemplate jdbcTemplate){
        this.jdbcTemplate = jdbcTemplate;
    }

    public Collection<Inventory> getInventory(){
        System.out.println("Reached DB!");
        String sql = "SELECT id, start_date, end_date, status FROM inventory";
        return jdbcTemplate.query(sql, this::mapRow);
    }

    private Inventory mapRow(ResultSet rs, int rowNum) throws SQLException {
        return new Inventory(
                rs.getInt("id"),
                rs.getInt("status"),
                rs.getDate("start_date").toLocalDate(),
                rs.getDate("end_date").toLocalDate()
        );
    }
}
