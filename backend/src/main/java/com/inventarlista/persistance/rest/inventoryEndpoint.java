package com.inventarlista.persistance.rest;

import com.inventarlista.dto.inventoriesDto;
import com.inventarlista.dto.inventoriesPiece;
import com.inventarlista.service.inventoryServiceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
            System.out.println("Reached Endpoint!");
            return inventoryService.getAllInventories();
        }catch (Exception e){
            throw new Exception(e);
        }
    }
}