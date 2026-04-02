package com.inventarlista.persistence;

import com.inventarlista.dto.inventoryProgressChartResponseDto;
import com.inventarlista.dto.updateItemAmountDto;
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
    private static final String SQL_FIND_INVENTORY = "SELECT COUNT(*) FROM popisi WHERE id = ?";
    private static final String SQL_GET_INVENTORY_STATUS = "SELECT SUM(IF(kolicina_proizvoda_unesena = -1, 1, 0)) AS untouched_count, " +
            "SUM(IF(kolicina_proizvoda_unesena > -1, 1, 0)) AS started_count FROM artikli a JOIN popisi p ON a.popis_id = p.id WHERE p.id = ?";
    private final JdbcTemplate jdbcTemplate;
    private static final Logger LOGGER = LoggerFactory.getLogger(MethodHandles.lookup().lookupClass());

    public inventoryJdbcDao(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Retrieves all inventory records from the database.
     *
     * @return A collection of Inventory objects.
     */
    public Collection<Inventory> getInventory() {
        return jdbcTemplate.query(SQL_SELECT_POPISI, this::mapRowInventory);
    }

    /**
     * Retrieves all items associated with a specific inventory by ID.
     *
     * @param id - The ID of the inventory.
     * @return A collection of Item objects associated with the inventory.
     */
    public Collection<Item> getItems(int id) {
        if (checkInventoryExists(id)) {
            return jdbcTemplate.query(SQL_SELECT_ITEMS, this::mapRowItem, id);
        } else {
            throw new NotFoundException("Inventory wasn't found.");
        }
    }

    /**
     * Inserts a new inventory record into the database.
     *
     * @param inventory - An Inventory object containing the details of the inventory to create.
     */
    public boolean createNewInventory(Inventory inventory) {
        int rowsAffected = jdbcTemplate.update(SQL_INSERT_INTO_POPISI,
                inventory.getStatus(),
                inventory.getStartDate() != null ? java.sql.Date.valueOf(inventory.getStartDate()) : null,
                inventory.getEndDate() != null ? java.sql.Date.valueOf(inventory.getEndDate()) : null);
        return rowsAffected != 0;
    }

    /**
     * Retrieves the maximum inventory ID from the `popisi` table.
     *
     * @return The highest inventory ID as an integer. Returns -1 if no inventories exist.
     */
    public int getMaxInventoryId() {
        Integer highestId = jdbcTemplate.queryForObject(SQL_MAX_INVENTORY_ID, Integer.class);
        return highestId == null ? -1 : highestId;
    }

    /**
     * Saves a list of items in batch mode, inserting them into the `artikli` table.
     *
     * @param items - A list of Item objects to be saved.
     */
    public int[][] saveItems(List<Item> items) {
        return jdbcTemplate.batchUpdate(SQL_INSERT_INTO_ARTIKLI, items, items.size(), (ps, item) -> {
            ps.setInt(1, item.getId());
            ps.setString(2, item.getName());
            ps.setString(3, item.getMeasurement());
            ps.setBigDecimal(4, item.getPresentAmount());
            ps.setString(5, item.getBarcode());
            ps.setBigDecimal(6, item.getInputtedAmount());
            ps.setInt(7, item.getUserThatPutTheAmountIn());
            ps.setInt(8, item.getInventoryId());
        });
    }

    /**
     * Batch update item amounts in the inventory.
     *
     * @param updateItems - An array of updateItemAmount objects.
     */
    public int[][] batchUpdateItemAmounts(updateItemAmountDto[] updateItems) {
        return jdbcTemplate.batchUpdate(
                SQL_UPDATE_AMOUNT,
                Arrays.asList(updateItems),  // Convert array to list
                updateItems.length,
                (ps, toUpdate) -> {
                    ps.setBigDecimal(1, toUpdate.itemInputtedAmount());
                    ps.setLong(2, toUpdate.itemId());
                    ps.setLong(3, toUpdate.itemInventoryId());
                }
        );
    }

    /**
     * Closes the given Inventory. It is closed by updating its status in the database.
     *
     * @param closeInventory the id of the inventory that should be closed
     * @return boolean if the action was successful
     */
    public boolean closeInventory(int closeInventory) {
        int rowsAffected = jdbcTemplate.update(SQL_CLOSE_INVENTORY, closeInventory);
        return rowsAffected != 0;
    }

    public inventoryProgressChartResponseDto getInventoryStatus (int inventoryId) {
        return jdbcTemplate.queryForObject(SQL_GET_INVENTORY_STATUS, (rs, rowNum) -> new inventoryProgressChartResponseDto(
                inventoryId,
                rs.getInt("started_count"),
                rs.getInt("untouched_count")
        ), inventoryId);
    }

    /**
     * Maps a single row of the `popisi` table to an Inventory object.
     *
     * @param rs     - The ResultSet containing query results.
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
     * Maps a single row of the `artikli` table to an Item object.
     *
     * @param rs     - The ResultSet containing query results.
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
     * Checks if inventory with id exists.
     * @param id id of the inventory being queried
     * @return boolean if the inventory was found or not
     */
    private boolean checkInventoryExists(int id) {
        Integer count = jdbcTemplate.queryForObject(SQL_FIND_INVENTORY, Integer.class, id);
        return count != null && count > 0;
    }
}