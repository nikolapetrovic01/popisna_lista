package com.inventarlista.dto;

import java.time.LocalDate;
import java.util.List;

public record selectedItems(
        List<selectItem> selectedItems,
        LocalDate startDate,
        LocalDate endDate
) {
}
