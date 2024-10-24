package com.inventarlista.persistance.rest;

import com.inventarlista.dto.*;
import com.inventarlista.service.inventoryServiceImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class inventoryEndpoint {
    private final inventoryServiceImpl inventoryService;

    public inventoryEndpoint(inventoryServiceImpl inventoryService){
        this.inventoryService = inventoryService;
    }

    @GetMapping("/controller")
    public inventoriesDto getInventories() throws Exception {
        try {
            return inventoryService.getAllInventories();
        }catch (Exception e){
            throw new Exception(e);
        }
    }

    @GetMapping("/controller/inventory/{id}")
    public inventoryItemsDto getItems(@PathVariable int id) throws Exception{
        try {
            return inventoryService.getItems(id);
        }catch (Exception e){
            throw new Exception(e);
        }
    }

    @PutMapping("/controller/inventory/{id}")
    public ResponseEntity<Void> updateItemAmount(@PathVariable int id, @RequestBody updateItemAmount update){
        try {
            inventoryService.updateItemAmount(update);
            return ResponseEntity.ok().build();
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

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