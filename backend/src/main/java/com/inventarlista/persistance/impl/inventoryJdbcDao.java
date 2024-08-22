package com.inventarlista.persistance.impl;

import com.inventarlista.dto.selectedItems;
import com.inventarlista.dto.updateItemAmount;
import com.inventarlista.entity.Inventory;
import com.inventarlista.entity.Item;
import com.inventarlista.exceptions.UserNotFoundException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collection;
import java.util.List;

@Repository
public class inventoryJdbcDao {
    private final JdbcTemplate jdbcTemplate;

    public inventoryJdbcDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Collection<Inventory> getInventory() {
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

    public Collection<Item> getItems(int id) {
        String sql = "SELECT * FROM artikli WHERE popis_id = " + id;
        return jdbcTemplate.query(sql, this::mapRowItem);
    }

    private Item mapRowItem(ResultSet rs, int rowNum) throws SQLException {
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

    public void updateItemAmount(updateItemAmount update) {
        String sql = "UPDATE artikli SET kolicina_proizvoda_unesena = ? WHERE sifra_proizvoda = ? AND popis_id = ?";
        jdbcTemplate.update(sql, update.itemInputtedAmount(), update.itemId(), update.itemInventoryId());
    }

    public void createNewInventory(Inventory inventory){
        System.out.println("DATABASE; NEW INVENTORY");
        String sql = "INSERT INTO popisi (status, start_date, end_date) VALUES (?, ?, ?)";

        jdbcTemplate.update(sql,
                inventory.getStatus(),
                java.sql.Date.valueOf(inventory.getStartDate()),
                java.sql.Date.valueOf(inventory.getEndDate()));
    }

    public int getMaxInventoryId(){
        String idSql = "SELECT MAX(id) FROM popisi;";
        Integer highestId = jdbcTemplate.queryForObject(idSql, Integer.class);
        return highestId != null ? highestId : 0;
    }

    public void saveItems (List<Item> items){
        System.out.println("DATABSE; SAVE ITEMS");
        String sql = "INSERT INTO artikli (" +
                "sifra_proizvoda, " +
                "naziv_proizvoda, " +
                "jm, " +
                "kolicina_proizvoda, " +
                "barkod, " +
                "kolicina_proizvoda_unesena, " +
                "korisnik_koji_je_unjeo_kol, " +
                "popis_id) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try {
            jdbcTemplate.batchUpdate(sql, items, items.size(), (ps, item) -> {
                ps.setInt(1, item.getId());
                ps.setString(2, item.getName());
                ps.setString(3, item.getMeasurement());
                ps.setBigDecimal(4, item.getPresentAmount());
                ps.setString(5, item.getBarcode());
                ps.setBigDecimal(6, item.getInputtedAmount());
                ps.setInt(7, item.getUserThatPutTheAmountIn());
                ps.setInt(8, item.getInventoryId());
            });
            //TODO: RJEŠI KAKO DA OZNAČIŠ DA JE TEK UNESEN PREDMET, POŠTO 0 NE MOŽE

        } catch (Exception e) {
            // Log the error and print stack trace
            System.err.println("Error occurred while saving items: " + e.getMessage());
            e.printStackTrace();
        }
    }
}