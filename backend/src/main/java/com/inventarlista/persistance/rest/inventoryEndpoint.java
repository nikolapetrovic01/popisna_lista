package com.inventarlista.persistance.rest;

import com.inventarlista.dto.*;
import com.inventarlista.service.inventoryServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class inventoryEndpoint {
    private final inventoryServiceImpl inventoryService;

    //TODO: CHANGE THE EXCEPTIONS
    public inventoryEndpoint(inventoryServiceImpl inventoryService){
        this.inventoryService = inventoryService;
    }

    /**
     * Retrieves all inventories.
     * @return An inventoriesDto object containing all inventory data.
     * @throws Exception if an error occurs during the retrieval process.
     */
    @GetMapping("/controller")
    public inventoriesDto getInventories() throws Exception {
        try {
            return inventoryService.getAllInventories();
        }catch (Exception e){
            throw new Exception(e);
        }
    }

    /**
     * Retrieves items in a specific inventory.
     * @param id - The ID of the inventory.
     * @return An inventoryItemsDto containing items in the specified inventory.
     * @throws Exception if an error occurs during the retrieval process.
     */
    @GetMapping("/controller/inventory/{id}")
    public inventoryItemsDto getItems(@PathVariable int id) throws Exception{
        try {
            return inventoryService.getItems(id);
        }catch (Exception e){
            throw new Exception(e);
        }
    }

    /**
     * Updates the amount for a specific item within an inventory.
     * @param id - The ID of the inventory containing the item.
     * @param update - An updateItemAmount object containing the item ID and the new amount.
     * @return A ResponseEntity indicating the status of the update operation.
     */
    @PutMapping("/controller/inventory/{id}")
    public ResponseEntity<Void> updateItemAmount(@PathVariable int id, @RequestBody updateItemAmount update){
        try {
            inventoryService.updateItemAmount(update);
            return ResponseEntity.ok().build();
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Creates a new inventory with selected items.
     * @param selectedItems - A selectedItems object containing the items to be added to the new inventory.
     * @return A ResponseEntity indicating the status of the creation operation.
     */
    @PostMapping("/controller/inventory/create")
    public ResponseEntity<Void> createNewInventory(@RequestBody selectedItems selectedItems){
        try {
            inventoryService.createNewInventory(selectedItems);
            return ResponseEntity.ok().build();
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}