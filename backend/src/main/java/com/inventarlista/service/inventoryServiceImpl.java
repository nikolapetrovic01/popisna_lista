package com.inventarlista.service;

import com.inventarlista.dto.*;
import com.inventarlista.entity.Inventory;
import com.inventarlista.entity.Item;
import com.inventarlista.exceptions.NotFoundException;
import com.inventarlista.exceptions.PersistenceException;
import com.inventarlista.exceptions.ValidationException;
import com.inventarlista.persistence.inventoryJdbcDao;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataAccessException;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Statement;
import java.util.List;

@Service
public class inventoryServiceImpl {
    private final inventoryJdbcDao inventoryJdbcDao;

    public inventoryServiceImpl(inventoryJdbcDao inventoryJdbcDao) {
        this.inventoryJdbcDao = inventoryJdbcDao;
    }

    /**
     * Retrieves all inventories and maps them to a DTO.
     *
     * @return An inventoriesDto object containing a list of all inventory records.
     * @throws NotFoundException if no inventories are found.
     */
    public inventoriesDto getAllInventories() {
        List<Inventory> inventories = (List<Inventory>) inventoryJdbcDao.getInventory();
        if (inventories.isEmpty()) {
            throw new NotFoundException("The inventory wasn't found.");
        }

        List<inventoriesPieceDto> inventoriesPieceDtos = inventories.stream()
                .map(this::mapToInventoryPiece)
                .toList();
        return new inventoriesDto(inventoriesPieceDtos);
    }

    /**
     * Retrieves all items within a specified inventory.
     *
     * @param id - The ID of the inventory.
     * @return An inventoryItemsDto object containing items in the specified inventory.
     * @throws NotFoundException if the inventory or items within it are not found.
     */
    public inventoryItemsDto getItems(int id) {
        List<Item> itemsList = (List<Item>) inventoryJdbcDao.getItems(id);
        if (itemsList.isEmpty()) {
            throw new NotFoundException("No items found.");
        }
        List<inventoryItemDto> inventoryItemsDtos = itemsList.stream()
                .map(this::mapToInventoryItem).toList();
        return new inventoryItemsDto(inventoryItemsDtos);
    }

    /**
     * Creates a new inventory record with selected items and saves it to the database.
     *
     * @param selectedItemsDto - The selectedItems DTO containing items and inventory details.
     */
    @Transactional
    public void createNewInventory(selectedItemsDto selectedItemsDto) {
        Inventory newInventory = new Inventory(
                0,
                1,
                selectedItemsDto.startDate(),
                selectedItemsDto.endDate()
        );

        boolean created = inventoryJdbcDao.createNewInventory(newInventory);
        if (!created) {
            throw new PersistenceException("Inventory could not be created.");
        }

        int maxId = inventoryJdbcDao.getMaxInventoryId();
        if (maxId <= 0) {
            throw new PersistenceException("Could not determine the created inventory id.");
        } else {
            newInventory.setId(maxId);

            List<Item> itemsToSave = selectedItemsDto.selectedItems().stream().map(
                    selectItem -> new Item(
                            selectItem.itemId(),
                            selectItem.itemName(),
                            selectItem.itemMeasurement(),
                            selectItem.itemPresentAmount(),
                            selectItem.itemBarcode(),
                            selectItem.itemInputtedAmount(),
                            selectItem.itemUserThatPutTheAmountIn(),
                            maxId
                    )
            ).toList();

            int[][] results = inventoryJdbcDao.saveItems(itemsToSave);
            if (results == null || results.length == 0) {
                throw new PersistenceException("Items could not be saved.");
            }
            for (int[] batch : results) {
                for (int result : batch) {
                    if (result == java.sql.Statement.EXECUTE_FAILED) {
                        throw new PersistenceException("At least one item could not be saved.");
                    }
                }
            }
        }
    }

    /**
     * Closes an inventory by setting its status accordingly in the database.
     *
     * @param closeInventory The ID of the inventory to close.
     * @throws PersistenceException if the inventory could not be closed.
     */
    public void closeInventory(int closeInventory) {
        if (!inventoryJdbcDao.closeInventory(closeInventory)) {
            throw new PersistenceException("Inventory could not be closed.");
        }
    }

    /**
     * Retrieves all inventories that are still open for workers.
     *
     * @return An inventoriesDto object containing only inventories with open status.
     * @throws NotFoundException if no inventories are found.
     */
    public inventoriesDto getAllInventoriesForWorkers() {
        List<Inventory> inventories = (List<Inventory>) inventoryJdbcDao.getInventory();
        if (inventories.isEmpty()) {
            throw new NotFoundException("The inventory wasn't found.");
        }
        List<inventoriesPieceDto> inventoriesPieceDtos = inventories.stream()
                .filter(inventory -> inventory.getStatus() == 1)
                .map(this::mapToInventoryPiece)
                .toList();
        return new inventoriesDto(inventoriesPieceDtos);
    }

    /**
     * Updates item amounts in an inventory on behalf of a manager.
     *
     * @param updateItems The array of items whose amounts should be updated.
     * @throws ValidationException  if the input data is invalid.
     * @throws PersistenceException if the database update fails.
     * @throws NotFoundException    if one of the items could not be found.
     */
    public void managerUpdateItemAmount(updateItemAmountDto[] updateItems) throws ValidationException {
        updateItemAmounts(updateItems);
    }

    /**
     * Updates item amounts in an inventory on behalf of a worker.
     *
     * @param updateItems The array of items whose amounts should be updated.
     * @throws ValidationException  if the input data is invalid.
     * @throws PersistenceException if the database update fails.
     * @throws NotFoundException    if one of the items could not be found.
     */
    public void workerUpdateItemAmount(updateItemAmountDto[] updateItems) throws ValidationException {
        updateItemAmounts(updateItems);
    }

    public inventoryProgressChartResponseDto getInventoryStatus(int inventoryId) throws ValidationException {
        if (inventoryId <= 0) {
            throw new ValidationException("Validation failed", List.of("Inventory ID must be greater than 0"));
        }

        inventoryProgressChartResponseDto result = inventoryJdbcDao.getInventoryStatus(inventoryId);

        if (result == null) {
            throw new NotFoundException("No inventory status found for inventory id " + inventoryId);
        }

        return result;
    }

    /**
     * Validates and performs a batch update of item amounts in an inventory.
     *
     * @param updateItems The array of item update DTOs to process.
     * @throws ValidationException  if the input array is null, empty, or contains null elements.
     * @throws PersistenceException if the batch update fails or returns an unexpected result.
     * @throws NotFoundException    if one of the items in the inventory could not be found.
     */
    private void updateItemAmounts(updateItemAmountDto[] updateItems) throws ValidationException {
        if (updateItems == null || updateItems.length == 0) {
            throw new ValidationException("No items to update.");
        }

        for (updateItemAmountDto item : updateItems) {
            if (item == null) {
                throw new ValidationException("One of the update items is null.");
            }
        }

        try {
            int[][] results = inventoryJdbcDao.batchUpdateItemAmounts(updateItems);

            if (results == null || results.length == 0) {
                throw new PersistenceException("Batch update returned no result.");
            }

            int checked = getChecked(updateItems, results);

            if (checked != updateItems.length) {
                throw new PersistenceException("Unexpected batch update result size.");
            }

        } catch (DataAccessException e) {
            throw new PersistenceException("Database error while updating item amounts.");
        }
    }

    /**
     * Checks the results of a batch update operation and ensures that all requested updates succeeded.
     *
     * @param updateItems The original array of requested item updates.
     * @param results     The batch update results returned by the JDBC layer.
     * @return The number of processed update results.
     * @throws PersistenceException if one of the batch operations failed.
     * @throws NotFoundException    if one of the targeted items was not found.
     */
    private static int getChecked(updateItemAmountDto[] updateItems, int[][] results) {
        int checked = 0;

        for (int[] batch : results) {
            for (int result : batch) {
                updateItemAmountDto current = updateItems[checked];

                if (result == Statement.EXECUTE_FAILED) {
                    throw new PersistenceException("Failed to update item.");
                }

                if (result == 0) {
                    throw new NotFoundException("Item in inventory was not found.");
                }
                checked++;
            }
        }
        return checked;
    }

    /**
     * Maps an Inventory object to inventoriesPieceDto.
     *
     * @param inventory - The Inventory object to map.
     * @return An inventoriesPieceDto object.
     */
    private inventoriesPieceDto mapToInventoryPiece(Inventory inventory) {
        return new inventoriesPieceDto(
                inventory.getId(),
                inventory.getStartDate(),
                inventory.getEndDate(),
                inventory.getStatus()
        );
    }

    /**
     * Maps an Item object to an inventoryItemDto.
     *
     * @param item - The Item object to map.
     * @return An inventoryItemDto object.
     */
    private inventoryItemDto mapToInventoryItem(Item item) {
        return new inventoryItemDto(
                item.getId(),
                item.getName(),
                item.getMeasurement(),
                item.getPresentAmount(),
                item.getBarcode(),
                item.getInputtedAmount(),
                item.getUserThatPutTheAmountIn(),
                item.getInventoryId()

        );
    }
}