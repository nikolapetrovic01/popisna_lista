package com.inventarlista.service;

import com.inventarlista.exceptions.NotFoundException;
import com.inventarlista.exceptions.ValidationException;
import com.inventarlista.persistence.statisticsJdbcDao;
import org.springframework.stereotype.Service;
import com.inventarlista.dto.itemNameDto;
import com.inventarlista.dto.ItemInventoryComparisonDto;
import com.inventarlista.dto.ItemInventoryComparisonRequestDto;
import java.time.LocalDate;
import java.util.List;

@Service
public class statisticsService {
    private final statisticsJdbcDao statisticsJdbcDao;

    public statisticsService(statisticsJdbcDao statisticsJdbcDao) {
        this.statisticsJdbcDao = statisticsJdbcDao;
    }


    public List<itemNameDto> getItemNames(LocalDate startDate, LocalDate endDate) throws ValidationException {
        if (startDate.isAfter(endDate)) {
            throw new ValidationException("Start date can't be after end date.");
        }

        List<itemNameDto> res = statisticsJdbcDao.getItemNames(startDate, endDate);

        if (res.isEmpty()) {
            throw new NotFoundException("Names weren't found");
        }

        return res;
    }

    public List<ItemInventoryComparisonDto> getItemInventoryComparisons(ItemInventoryComparisonRequestDto request) throws ValidationException {
        if (!request.startDate().isAfter(request.endDate())) {
            throw new ValidationException("Start date can't be after end date.");
        }

        List<ItemInventoryComparisonDto> res = statisticsJdbcDao.getItemInventoryComparisons(request);

        if (res.isEmpty()) {
            throw new NotFoundException("Items weren't found");
        }

        return res;
    }
}
