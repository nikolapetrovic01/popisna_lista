package com.inventarlista.persistence;

import com.inventarlista.dto.updateItemAmount;
import com.inventarlista.entity.Inventory;
import com.inventarlista.entity.Item;
import com.inventarlista.exceptions.NotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.lang.invoke.MethodHandles;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@Repository
public class inventoryJdbcDao {
    public static final String SQL_SELECT_POPISI = "SELECT id, start_date, end_date, status FROM popisi";
    public static final String SQL_SELECT_ITEMS = "SELECT * FROM artikli WHERE popis_id = ?";
    public static final String SQL_UPDATE_AMOUNT = "UPDATE artikli SET kolicina_proizvoda_unesena = ? WHERE sifra_proizvoda = ? AND popis_id = ?";
    public static final String SQL_INSERT_INTO_POPISI = "INSERT INTO popisi (status, start_date, end_date) VALUES (?, ?, ?)";
    public static final String SQL_MAX_INVENTORY_ID = "SELECT MAX(id) FROM popisi";
    public static final String SQL_INSERT_INTO_ARTIKLI = "INSERT INTO artikli (" +
            "sifra_proizvoda, " +
            "naziv_proizvoda, " +
            "jm, " +
            "kolicina_proizvoda, " +
            "barkod, " +
            "kolicina_proizvoda_unesena, " +
            "korisnik_koji_je_unjeo_kol, " +
            "popis_id) " +
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    private static final String SQL_CLOSE_INVENTORY = "UPDATE popisi SET status = 0 WHERE id = ?";
    private final JdbcTemplate jdbcTemplate;
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    public inventoryJdbcDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Retrieves all inventory records from the database.
     * @return A collection of Inventory objects.
     */
    public Collection<Inventory> getInventory() {
        try {
            return jdbcTemplate.query(SQL_SELECT_POPISI, this::mapRowInventory);
        } catch (DataAccessException e){
            throw new NotFoundException("No inventories");
        }
    }

    /**
     * Maps a single row of the `popisi` table to an Inventory object.
     * @param rs - The ResultSet containing query results.
     * @param rowNum - The current row number.
     * @return An Inventory object representing a row from the `popisi` table.
     */
    private Inventory mapRowInventory(ResultSet rs, int rowNum) throws SQLException {
        return new Inventory(
                rs.getInt("id"),
                rs.getInt("status"),
                rs.getDate("start_date").toLocalDate(),
                rs.getDate("end_date").toLocalDate()
        );
    }

    /**
     * Retrieves all items associated with a specific inventory by ID.
     * @param id - The ID of the inventory.
     * @return A collection of Item objects associated with the inventory.
     */
    public Collection<Item> getItems(int id) {
        try {
            return jdbcTemplate.query(SQL_SELECT_ITEMS, this::mapRowItem, id);
        } catch (DataAccessException e){
            LOGGER.error("Error retrieving items from inventory: {}", e.getMessage(), e);
            throw new NotFoundException("Could not find items associated with inventory ID %d".formatted(id));
        }
    }

    /**
     * Maps a single row of the `artikli` table to an Item object.
     * @param rs - The ResultSet containing query results.
     * @param rowNum - The current row number.
     * @return An Item object representing a row from the `artikli` table.
     */
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

    /**
     * Inserts a new inventory record into the database.
     * @param inventory - An Inventory object containing the details of the inventory to create.
     */
    public void createNewInventory(Inventory inventory) {
        try {
            jdbcTemplate.update(SQL_INSERT_INTO_POPISI,
                    inventory.getStatus(),
                    inventory.getStartDate() != null ? java.sql.Date.valueOf(inventory.getStartDate()) : null,
                    inventory.getEndDate() != null ? java.sql.Date.valueOf(inventory.getEndDate()) : null);
        } catch (DataAccessException e) {
            LOGGER.error("Error inserting new inventory: {}", e.getMessage(), e);
        }
    }

    /**
     * Retrieves the maximum inventory ID from the `popisi` table.
     * @return The highest inventory ID as an integer. Returns 0 if no inventories exist.
     */
    public int getMaxInventoryId(){
        Integer highestId = null;
        try {
            highestId = jdbcTemplate.queryForObject(SQL_MAX_INVENTORY_ID, Integer.class);
        } catch (DataAccessException e) {
            LOGGER.error("Error fetching max inventory ID", e);
        }
        return highestId != null ? highestId : 0;
    }

    /**
     * Saves a list of items in batch mode, inserting them into the `artikli` table.
     * @param items - A list of Item objects to be saved.
     */
    public void saveItems (List<Item> items){
        try {
            jdbcTemplate.batchUpdate(SQL_INSERT_INTO_ARTIKLI, items, items.size(), (ps, item) -> {
                ps.setInt(1, item.getId());
                ps.setString(2, item.getName());
                ps.setString(3, item.getMeasurement());
                ps.setBigDecimal(4, item.getPresentAmount());
                ps.setString(5, item.getBarcode());
                ps.setBigDecimal(6, item.getInputtedAmount());
                ps.setInt(7, item.getUserThatPutTheAmountIn());
                ps.setInt(8, item.getInventoryId());
            });
        } catch (DataAccessException e) {
            LOGGER.error("Error occurred while saving items", e);
        }
    }

    /**
     * Batch update item amounts in the inventory.
     * @param updateItems - An array of updateItemAmount objects.
     */
    public void batchUpdateItemAmounts(updateItemAmount[] updateItems) {
        try {
            jdbcTemplate.batchUpdate(
                    SQL_UPDATE_AMOUNT,
                    Arrays.asList(updateItems),  // Convert array to list
                    updateItems.length,
                    (ps, toUpdate) -> {
                        ps.setBigDecimal(1, toUpdate.itemInputtedAmount());
                        ps.setLong(2, toUpdate.itemId());
                        ps.setLong(3, toUpdate.itemInventoryId());
                    }
            );
        } catch (DataAccessException e) {
            LOGGER.error("Error occurred while updating item amounts.", e);
        }
    }

    public void closeInventory(int closeInventory) {
        try {
            jdbcTemplate.update(SQL_CLOSE_INVENTORY, closeInventory);
        } catch (DataAccessException e) {
            LOGGER.error("Error occurred while trying to close inventory.", e);
        }
    }
}