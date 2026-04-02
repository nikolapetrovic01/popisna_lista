package com.inventarlista.dto;

public record inventoryProgressChartResponseDto(
        int inventoryId,
        int startedCount,
        int untouchedCount
) {
}
