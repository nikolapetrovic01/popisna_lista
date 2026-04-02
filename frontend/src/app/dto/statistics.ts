import {ComparisonGroupingMode} from "../shared/constants/comparison-grouping-mode";

export interface dateFilterDto {
  startDate: string,
  endDate: string
}
export interface itemName {
  nameOfItem: string
}
export interface itemInventoryComparisonRequestDto {
  startDate: string,
  endDate: string,
  groupingMode: ComparisonGroupingMode,
  itemNames: string[]
}
export interface ItemInventoryComparisonDto {
  nameOfItem: string,
  groupingMode: ComparisonGroupingMode,
  comparisons: itemInventoryComparisonEntryDto[]
}
export interface itemInventoryComparisonEntryDto {
  label: string,
  expectedAmount: number,
  actualAmount: number
}
