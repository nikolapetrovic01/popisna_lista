package com.inventarlista.endpoint;

import com.inventarlista.dto.*;
import com.inventarlista.exceptions.ValidationException;
import com.inventarlista.service.inventoryServiceImpl;
import org.springframework.http.ResponseEntity;
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

    /**
     * Closes the specified inventory.
     *
     * @param closeInventory The ID of the inventory to close.
     * @return A ResponseEntity with HTTP 200 if the inventory was successfully closed.
     */
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PutMapping("/controller/inventory/closeInventory")
    public ResponseEntity<Void> closeInventoryManager(@RequestBody int closeInventory) {
        inventoryService.closeInventory(closeInventory);
        return ResponseEntity.ok().build();
    }

    /**
     * Updates item amounts in an inventory on behalf of a manager.
     *
     * @param selectItems An array of item update DTOs containing the modified values.
     * @return A ResponseEntity with HTTP 200 if the update was successful.
     * @throws ValidationException if the provided update data is invalid.
     */
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PutMapping("/controller/inventory/saveChanges")
    public ResponseEntity<Void> updateManagerChangedItems(@RequestBody updateItemAmountDto[] selectItems) throws ValidationException {
        inventoryService.managerUpdateItemAmount(selectItems);
        return ResponseEntity.ok().build();
    }

    /**
     * Creates a new inventory with selected items.
     *
     * @param selectedItemsDto - A selectedItems object containing the items to be added to the new inventory.
     * @return A ResponseEntity indicating the status of the creation operation.
     */
    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PostMapping("/controller/inventory/create")
    public ResponseEntity<Void> createNewInventory(@RequestBody selectedItemsDto selectedItemsDto) {
        inventoryService.createNewInventory(selectedItemsDto);
        return ResponseEntity.ok().build();
    }

    /**
     * Retrieves all active inventories available to workers.
     *
     * @return An inventoriesDto object containing inventories visible to workers.
     */
    @PreAuthorize("hasAnyRole('ROLE_WORKER_ADMIN', 'ROLE_WORKER')")
    @GetMapping("/worker")
    public inventoriesDto getInventoriesWorker() {
        return inventoryService.getAllInventoriesForWorkers();
    }

    /**
     * Retrieves items in a specific inventory for workers.
     *
     * @param id The ID of the inventory.
     * @return An inventoryItemsDto containing items in the specified inventory.
     */
    @PreAuthorize("hasAnyRole('ROLE_WORKER_ADMIN', 'ROLE_WORKER')")
    @GetMapping("/worker/inventory/{id}")
    public inventoryItemsDto getWorkerItems(@PathVariable int id) {
        return inventoryService.getItems(id);
    }

    /**
     * Updates item amounts in an inventory on behalf of a worker.
     *
     * @param selectItems An array of item update DTOs containing the modified values.
     * @return A ResponseEntity with HTTP 200 if the update was successful.
     * @throws ValidationException if the provided update data is invalid.
     */
    @PreAuthorize("hasAnyRole('ROLE_WORKER_ADMIN', 'ROLE_WORKER')")
    @PutMapping("/worker/inventory/saveChanges")
    public ResponseEntity<Void> updateWorkerChangedItems(@RequestBody updateItemAmountDto[] selectItems) throws ValidationException {
        System.out.println("Array of length" + selectItems.length);
        inventoryService.workerUpdateItemAmount(selectItems);
        return ResponseEntity.ok().build();
    }
}