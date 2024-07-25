package com.inventarlista.dto;

import java.time.LocalDate;

public record inventoriesPiece(
        int id,
        LocalDate startDate,
        LocalDate endDate,
        int status

) {
}
