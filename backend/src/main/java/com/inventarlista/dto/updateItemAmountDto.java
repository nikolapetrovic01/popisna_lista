package com.inventarlista.dto;

import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;

public record updateItemAmountDto(
        @NotBlank
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