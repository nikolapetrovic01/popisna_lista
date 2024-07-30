package com.inventarlista.dto;

import java.util.List;

public record inventoryItemsDto(
        List<inventoryItemDto> items
) {
}
