package com.inventarlista.dto;

import java.util.List;

public record inventoriesDto(
        List<inventoriesPieceDto> tables
) {
}
