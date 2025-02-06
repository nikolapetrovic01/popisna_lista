package com.inventarlista.service;

import com.inventarlista.dto.*;
import com.inventarlista.entity.Inventory;
import com.inventarlista.entity.Item;
import com.inventarlista.exceptions.NotFoundException;
import com.inventarlista.persistence.inventoryJdbcDao;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class inventoryServiceImpl {
    private final inventoryJdbcDao inventoryJdbcDao;

    public inventoryServiceImpl(inventoryJdbcDao inventoryJdbcDao) {
        this.inventoryJdbcDao = inventoryJdbcDao;
    }

    /**
     * Retrieves all inventories and maps them to a DTO.
     * @return An inventoriesDto object containing a list of all inventory records.
     * @throws NotFoundException if no inventories are found.
     */
    public inventoriesDto getAllInventories() {
        List<Inventory> inventories;
        try{
            inventories = (List<Inventory>) inventoryJdbcDao.getInventory();
            List<inventoriesPieceDto> inventoriesPieceDtos = inventories.stream()
                    .map(this::mapToInventoryPiece)
                    .toList();
            return new inventoriesDto(inventoriesPieceDtos);
        } catch (NotFoundException e){
            throw new NotFoundException("No inventories");
        }
    }

    /**
     * Maps an Inventory object to inventoriesPieceDto.
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
     * Retrieves all items within a specified inventory.
     * @param id - The ID of the inventory.
     * @return An inventoryItemsDto object containing items in the specified inventory.
     * @throws NotFoundException if the inventory or items within it are not found.
     */
    public inventoryItemsDto getItems(int id) {
        List<Item> itemsList;
        try{
            itemsList = (List<Item>) inventoryJdbcDao.getItems(id);
            List<inventoryItemDto> inventoryItemsDtos = itemsList.stream()
                    .map(this::mapToInventoryItem).toList();
            return new inventoryItemsDto(inventoryItemsDtos);
        } catch (NotFoundException e){
            throw new NotFoundException("Could not find inventory with ID %d".formatted(id));
        }
    }

    /**
     * Maps an Item object to an inventoryItemDto.
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

    /**
     * Updates the amount of a specific item in an inventory.
     * @param update - The updateItemAmount DTO containing the item ID, inventory ID, and new amount.
     */
    public void updateItemAmount(updateItemAmount update) {
        inventoryJdbcDao.updateItemAmount(update);
    }

    /**
     * Creates a new inventory record with selected items and saves it to the database.
     * @param selectedItems - The selectedItems DTO containing items and inventory details.
     */
    public void createNewInventory(selectedItems selectedItems) {
        Inventory newInventory = new Inventory(
                0,
                1,
                selectedItems.startDate(),
                selectedItems.endDate()
        );

        inventoryJdbcDao.createNewInventory(newInventory);
        int maxId = inventoryJdbcDao.getMaxInventoryId();
        newInventory.setId(maxId);

        List<Item> itemsToSave = selectedItems.selectedItems().stream().map(
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
        inventoryJdbcDao.saveItems(itemsToSave);
    }
}