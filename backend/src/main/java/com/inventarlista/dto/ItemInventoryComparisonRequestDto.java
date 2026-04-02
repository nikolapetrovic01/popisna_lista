package com.inventarlista.dto;

import com.inventarlista.enums.ComparisonGroupingMode;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record ItemInventoryComparisonRequestDto(
        @NotNull
        LocalDate startDate,
        @NotNull
        LocalDate endDate,
        @NotNull
        ComparisonGroupingMode groupingMode,
        @NotEmpty
        List<String> itemNames
) {
}
