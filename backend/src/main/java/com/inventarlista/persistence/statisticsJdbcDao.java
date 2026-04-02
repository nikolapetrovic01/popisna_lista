package com.inventarlista.persistence;

import com.inventarlista.dto.ItemInventoryComparisonDto;
import com.inventarlista.dto.ItemInventoryComparisonRequestDto;
import com.inventarlista.dto.itemInventoryComparisonEntryDto;
import com.inventarlista.enums.ComparisonGroupingMode;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Repository;
import com.inventarlista.dto.itemNameDto;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Repository
public class statisticsJdbcDao {
    public static final String SQL_SELECT_ITEM_NAME = "SELECT DISTINCT naziv_proizvoda FROM " +
            "artikli a JOIN popisi p ON a.popis_id = p.id " +
            "WHERE p.start_date >= ? AND p.end_date <= ? " +
            "ORDER BY a.naziv_proizvoda";
    public static final String SQL_SELECT_ITEM_PER_YEAR = "SELECT kolicina_proizvoda_unesena, kolicina_proizvoda " +
            "FROM artikli a JOIN popisi p ON a.popis_id = p.id " +
            "WHERE p.start_date >= ? AND p.end_date <= ? AND p.status = 0 AND a.naziv_proizvoda LIKE ?";


    private final JdbcTemplate jdbcTemplate;

    public statisticsJdbcDao(JdbcTemplate statisticsJdbcDao) {
        this.jdbcTemplate = statisticsJdbcDao;
    }

    public List<itemNameDto> getItemNames(LocalDate startDate, LocalDate endDate) {
        return jdbcTemplate.query(SQL_SELECT_ITEM_NAME, this::mapRowItemName, startDate, endDate);
    }


    public List<ItemInventoryComparisonDto> getItemInventoryComparisons(ItemInventoryComparisonRequestDto request) {
        if (request.groupingMode().equals(ComparisonGroupingMode.YEAR)) {
            return getItemInventoryComparisonsPerYear(request);
        } else {
            return getItemInventoryComparisonsPerInventory(request);
        }
    }

    private List<ItemInventoryComparisonDto> getItemInventoryComparisonsPerYear(ItemInventoryComparisonRequestDto request) {
        List<ItemInventoryComparisonDto> comparisonsForAllItems = new ArrayList<>();

        for (int i = 0; i < request.itemNames().size(); i++) {
            LocalDate currentStart = request.startDate();
            String currentItemName = request.itemNames().get(i);
            List<itemInventoryComparisonEntryDto> yearlyEntriesForCurrentItem = new ArrayList<>();

            while (!currentStart.isAfter(request.endDate())) {
                LocalDate endOfYear = LocalDate.of(currentStart.getYear(), 12, 31);
                LocalDate currentEnd = request.endDate().isBefore(endOfYear) ? request.endDate() : endOfYear;

                List<itemInventoryComparisonEntryDto> rawRowsForCurrentYear =
                        jdbcTemplate.query(SQL_SELECT_ITEM_PER_YEAR, this::mapRowItemStats,
                                currentStart, currentEnd, "%" + currentItemName + "%");

                itemInventoryComparisonEntryDto yearlyComparisonEntry = getItemInventoryComparisonEntryDto(currentStart, rawRowsForCurrentYear);
                yearlyEntriesForCurrentItem.add(yearlyComparisonEntry);
                currentStart = currentEnd.plusDays(1);
            }
            ItemInventoryComparisonDto itemComparison = new ItemInventoryComparisonDto(currentItemName, ComparisonGroupingMode.YEAR, yearlyEntriesForCurrentItem);
            comparisonsForAllItems.add(itemComparison);
        }
        return comparisonsForAllItems;
    }

    @NonNull
    private static itemInventoryComparisonEntryDto getItemInventoryComparisonEntryDto(LocalDate currentStart, List<itemInventoryComparisonEntryDto> rawRowsForCurrentYear) {
        String currentYearLabel = String.valueOf(currentStart.getYear());
        int expectedAmountSum = 0;
        int actualAmountSum = 0;

        for (itemInventoryComparisonEntryDto itemInventoryComparisonEntryDto : rawRowsForCurrentYear) {
            expectedAmountSum += itemInventoryComparisonEntryDto.expectedAmount();
            actualAmountSum += itemInventoryComparisonEntryDto.actualAmount();
        }

        return new itemInventoryComparisonEntryDto(currentYearLabel, expectedAmountSum, actualAmountSum);
    }

    private List<ItemInventoryComparisonDto> getItemInventoryComparisonsPerInventory(ItemInventoryComparisonRequestDto request) {
        return null;
    }


    private itemNameDto mapRowItemName(ResultSet rs, int rowNum) throws SQLException {
        return new itemNameDto(
                rs.getString("naziv_proizvoda")
        );
    }


    private itemInventoryComparisonEntryDto mapRowItemStats(ResultSet rs, int rowNum) throws SQLException {
        return new itemInventoryComparisonEntryDto(
                "",
                rs.getInt("kolicina_proizvoda"),
                rs.getInt("kolicina_proizvoda_unesena")
        );
    }
}
