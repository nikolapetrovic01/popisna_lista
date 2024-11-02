package com.inventarlista.persistance.rest;

import com.inventarlista.dto.*;
import com.inventarlista.service.inventoryServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class inventoryEndpoint {
    private final inventoryServiceImpl inventoryService;

    public inventoryEndpoint(inventoryServiceImpl inventoryService) {
        this.inventoryService = inventoryService;
    }

    /**
     * Retrieves all inventories.
     *
     * @return An inventoriesDto object containing all inventory data.
     * @throws Exception if an error occurs during the retrieval process.
     */
    @GetMapping("/controller")
    public inventoriesDto getInventories() throws Exception {
        return inventoryService.getAllInventories();
    }

    /**
     * Retrieves items in a specific inventory.
     *
     * @param id - The ID of the inventory.
     * @return An inventoryItemsDto containing items in the specified inventory.
     * @throws Exception if an error occurs during the retrieval process.
     */
    @GetMapping("/controller/inventory/{id}")
    public inventoryItemsDto getItems(@PathVariable int id) throws Exception {
        return inventoryService.getItems(id);
    }

    /**
     * Updates the amount for a specific item within an inventory.
     *
     * @param id     - The ID of the inventory containing the item.
     * @param update - An updateItemAmount object containing the item ID and the new amount.
     * @return A ResponseEntity indicating the status of the update operation.
     */
    @PutMapping("/controller/inventory/{id}")
    public ResponseEntity<Void> updateItemAmount(@PathVariable int id, @RequestBody updateItemAmount update) {
        inventoryService.updateItemAmount(update);
        return ResponseEntity.ok().build();
    }

    /**
     * Creates a new inventory with selected items.
     *
     * @param selectedItems - A selectedItems object containing the items to be added to the new inventory.
     * @return A ResponseEntity indicating the status of the creation operation.
     */
    @PostMapping("/controller/inventory/create")
    public ResponseEntity<Void> createNewInventory(@RequestBody selectedItems selectedItems) {
        inventoryService.createNewInventory(selectedItems);
        return ResponseEntity.ok().build();
    }
}