package com.inventarlista.persistance.impl;

import com.inventarlista.entity.Inventory;
import com.inventarlista.entity.Item;
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
        String sql = "SELECT id, start_date, end_date, status FROM popisi";
        return jdbcTemplate.query(sql, this::mapRowInventory);
    }

    private Inventory mapRowInventory(ResultSet rs, int rowNum) throws SQLException {
        return new Inventory(
                rs.getInt("id"),
                rs.getInt("status"),
                rs.getDate("start_date").toLocalDate(),
                rs.getDate("end_date").toLocalDate()
        );
    }

    public Collection<Item> getItems(int id){
        String sql = "SELECT * FROM artikli WHERE popis_id =" + id;
        return jdbcTemplate.query(sql, this::mapRowItem);
    }

    private Item mapRowItem(ResultSet rs, int rowNum) throws SQLException{
        return new Item(
                rs.getInt("sifra_proizvoda"),
                rs.getString("naziv_proizvoda"),
                rs.getString("jm"),
                rs.getBigDecimal("kolicina_proizvoda"),
                rs.getString("barkod"),
                rs.getBigDecimal("kolicina_proizvoda_unesena"),
                rs.getInt("korisnik_koji_je_unjeo_kol"),
                rs.getInt("popis_id")
        );
    }
}
