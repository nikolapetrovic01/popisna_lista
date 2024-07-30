package com.inventarlista.dto;

import java.time.LocalDate;

public record inventoriesPieceDto(
        int id,
        LocalDate startDate,
        LocalDate endDate,
        int status

) {
}
