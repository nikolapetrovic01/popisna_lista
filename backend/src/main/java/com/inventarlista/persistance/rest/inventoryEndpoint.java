package com.inventarlista.persistance.rest;

import com.inventarlista.dto.inventoriesDto;
import com.inventarlista.dto.inventoryItemsDto;
import com.inventarlista.service.inventoryServiceImpl;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

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
}