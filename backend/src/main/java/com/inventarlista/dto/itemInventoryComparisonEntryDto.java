package com.inventarlista.dto;


public record itemInventoryComparisonEntryDto(
        String label,
        int expectedAmount,
        int actualAmount
) {
}
