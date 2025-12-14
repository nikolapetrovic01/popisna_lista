package com.inventarlista.dto;

import java.time.LocalDate;
import java.util.List;

public record selectedItemsDto(
        List<selectItemDto> selectedItems,
        LocalDate startDate,
        LocalDate endDate
) {
}
