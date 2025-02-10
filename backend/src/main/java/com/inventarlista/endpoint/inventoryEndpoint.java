package com.inventarlista.endpoint;

import com.inventarlista.dto.*;
import com.inventarlista.service.inventoryServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @Secured("ROLE_MANAGER")
    @GetMapping("/controller")
    public inventoriesDto getInventories() throws Exception {
        return inventoryService.getAllInventories();
    }

    /**
     * Retrieves items in a specific inventory.
     *
     * @param id - The ID of the inventory.
     * @return An inventoryItemsDto containing items in the specified inventory.
     */
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @Secured("ROLE_MANAGER")
    @GetMapping("/controller/inventory/{id}")
    public inventoryItemsDto getItems(@PathVariable int id) {
        return inventoryService.getItems(id);
    }

    /**
     * Updates the amount for a specific item within an inventory.
     *
     * @param id     - The ID of the inventory containing the item.
     * @param update - An updateItemAmount object containing the item ID and the new amount.
     * @return A ResponseEntity indicating the status of the update operation.
     */
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @Secured("ROLE_MANAGER")
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
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @Secured("ROLE_MANAGER")
    @PostMapping("/controller/inventory/create")
    public ResponseEntity<Void> createNewInventory(@RequestBody selectedItems selectedItems) {
        inventoryService.createNewInventory(selectedItems);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ROLE_WORKER_ADMIN')")
    @Secured("ROLE_WORKER_ADMIN")
    @GetMapping("/worker")
    public inventoriesDto getInventoriesWorker() {
        return inventoryService.getAllInventoriesForWorkers();
    }

    @PreAuthorize("hasRole('ROLE_WORKER_ADMIN')")
    @Secured("ROLE_WORKER_ADMIN")
    @GetMapping("/worker/inventory/{id}")
    public inventoryItemsDto getWorkerItems(@PathVariable int id) {
        return inventoryService.getItems(id);
    }
}