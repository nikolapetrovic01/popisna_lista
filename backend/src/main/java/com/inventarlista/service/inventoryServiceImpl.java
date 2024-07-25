package com.inventarlista.service;

import com.inventarlista.dto.inventoriesDto;
import com.inventarlista.dto.inventoriesPiece;
import com.inventarlista.entity.Inventory;
import com.inventarlista.persistance.impl.inventoryJdbcDao;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class inventoryServiceImpl {
    private final inventoryJdbcDao inventoryJdbcDao;

    public inventoryServiceImpl(inventoryJdbcDao inventoryJdbcDao){
        this.inventoryJdbcDao = inventoryJdbcDao;
    }

    public inventoriesDto getAllInventories(){
        System.out.println("Reached ServiceImpl!");
        List<Inventory> inventories = (List<Inventory>) inventoryJdbcDao.getInventory();
        System.out.println("SQL Response in ServiceImpl" + inventories.stream().map(Object::toString)
                .collect(Collectors.joining(", ")));
        List<inventoriesPiece> inventoriesPieces = inventories.stream()
                .map(this:: mapToInventoryPiece)
                .toList();
        return new inventoriesDto(inventoriesPieces);
    }

    private inventoriesPiece mapToInventoryPiece(Inventory inventory){
        return new inventoriesPiece(
                inventory.getId(),
                inventory.getStartDate(),
                inventory.getEndDate(),
                inventory.getStatus()
        );
    }
}
