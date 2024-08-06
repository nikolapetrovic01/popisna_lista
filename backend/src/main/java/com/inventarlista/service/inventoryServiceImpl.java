package com.inventarlista.service;

import com.inventarlista.dto.*;
import com.inventarlista.entity.Inventory;
import com.inventarlista.entity.Item;
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
        List<Inventory> inventories = (List<Inventory>) inventoryJdbcDao.getInventory();
        List<inventoriesPieceDto> inventoriesPieceDtos = inventories.stream()
                .map(this:: mapToInventoryPiece)
                .toList();
        return new inventoriesDto(inventoriesPieceDtos);
    }

    private inventoriesPieceDto mapToInventoryPiece(Inventory inventory){
        return new inventoriesPieceDto(
                inventory.getId(),
                inventory.getStartDate(),
                inventory.getEndDate(),
                inventory.getStatus()
        );
    }

    public inventoryItemsDto getItems(int id){
        List<Item> itemsList = (List<Item>) inventoryJdbcDao.getItems(id);
        List<inventoryItemDto> inventoryItemsDtos = itemsList.stream()
                .map(this:: mapToInventoryItem).toList();
        return new inventoryItemsDto(inventoryItemsDtos);
    }

    private inventoryItemDto mapToInventoryItem(Item item){
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

    public void updateItemAmount(updateItemAmount update){
        inventoryJdbcDao.updateItemAmount(update);
    }
}
