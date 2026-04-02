package com.inventarlista.dto;

import com.inventarlista.enums.ComparisonGroupingMode;

import java.util.List;

public record ItemInventoryComparisonDto(
        String nameOfItem,
        ComparisonGroupingMode groupingMode,
        List<itemInventoryComparisonEntryDto> comparisons
) {
}
