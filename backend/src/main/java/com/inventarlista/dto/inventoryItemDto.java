package com.inventarlista.dto;

import java.math.BigDecimal;

public record inventoryItemDto(
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
