package com.inventarlista.dto;

import java.math.BigDecimal;

public record selectItemDto(
        int itemId,
        String itemName,
        String itemMeasurement,
        BigDecimal itemPresentAmount,
        String itemBarcode,
        BigDecimal itemInputtedAmount,
        int itemUserThatPutTheAmountIn,
        int itemInventoryId,
        boolean selected
) {
}
