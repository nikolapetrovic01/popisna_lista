package com.inventarlista.dto;

import java.math.BigDecimal;
//TODO: CHANGE TO LONG ID
public record updateItemAmountDto(
        int itemId,
        String itemName,
        String itemMeasurement,
        BigDecimal itemPresentAmount,
        String itemBarcode,
        BigDecimal itemInputtedAmount,
        int itemUserThatPutTheAmountIn,
        int itemInventoryId
) {
}