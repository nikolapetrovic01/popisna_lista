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
     */
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @GetMapping("/controller")
    public inventoriesDto getInventories() {
        return inventoryService.getAllInventories();
    }

    /**
     * Retrieves items in a specific inventory.
     *
     * @param id - The ID of the inventory.
     * @return An inventoryItemsDto containing items in the specified inventory.
     */
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @GetMapping("/controller/inventory/{id}")
    public inventoryItemsDto getItems(@PathVariable int id) {
        return inventoryService.getItems(id);
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PutMapping("/controller/inventory/closeInventory")
    public ResponseEntity<Void> closeInventoryManager(@RequestBody int closeInventory) {
        inventoryService.closeInventory(closeInventory);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PutMapping("/controller/inventory/saveChanges")
    public ResponseEntity<Void> updateManagerChangedItems(@RequestBody updateItemAmount[] selectItems) {
        inventoryService.managerUpdateItemAmount(selectItems);
        return ResponseEntity.ok().build();
    }

    /**
     * Creates a new inventory with selected items.
     *
     * @param selectedItems - A selectedItems object containing the items to be added to the new inventory.
     * @return A ResponseEntity indicating the status of the creation operation.
     */
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PostMapping("/controller/inventory/create")
    public ResponseEntity<Void> createNewInventory(@RequestBody selectedItems selectedItems) {
        inventoryService.createNewInventory(selectedItems);
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasAnyRole('ROLE_WORKER_ADMIN', 'ROLE_WORKER')")
    @GetMapping("/worker")
    public inventoriesDto getInventoriesWorker() {
        return inventoryService.getAllInventoriesForWorkers();
    }

    @PreAuthorize("hasAnyRole('ROLE_WORKER_ADMIN', 'ROLE_WORKER')")
    @GetMapping("/worker/inventory/{id}")
    public inventoryItemsDto getWorkerItems(@PathVariable int id) {
        return inventoryService.getItems(id);
    }

    @PreAuthorize("hasAnyRole('ROLE_WORKER_ADMIN', 'ROLE_WORKER')")
    @PutMapping("/worker/inventory/saveChanges")
    public ResponseEntity<Void> updateWorkerChangedItems(@RequestBody updateItemAmount[] selectItems) {
        System.out.println("Array of length" + selectItems.length);
        inventoryService.workerUpdateItemAmount(selectItems);
        return ResponseEntity.ok().build();
    }
}