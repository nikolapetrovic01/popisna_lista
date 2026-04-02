package com.inventarlista.endpoint;

import com.inventarlista.dto.itemNameDto;
import com.inventarlista.dto.ItemInventoryComparisonDto;
import com.inventarlista.dto.ItemInventoryComparisonRequestDto;
import com.inventarlista.exceptions.ValidationException;
import com.inventarlista.service.statisticsService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
public class statisticsEndpoint {
    private final statisticsService statisticsService;

    public statisticsEndpoint(statisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @GetMapping("/controller/statistics/get-itemNames")
    public List<itemNameDto> getItemNames(
            @RequestParam @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @NotNull @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) throws ValidationException {
        return statisticsService.getItemNames(startDate, endDate);
    }

    @PreAuthorize("hasRole('ROLE_MANAGER')")
    @PostMapping("/controller/statistics/item-inventory-comparison")
    public List<ItemInventoryComparisonDto> getItemInventoryComparisons(
            @RequestBody @Valid ItemInventoryComparisonRequestDto request
    ) throws ValidationException {
        return statisticsService.getItemInventoryComparisons(request);
    }
}
