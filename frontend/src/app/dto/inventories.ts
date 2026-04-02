export interface inventoriesPiece {
  id: number;
  startDate: Date;
  endDate: Date;
  status: number;
}
export interface inventories {
  tables: inventoriesPiece[];
}
export interface inventoryProgressChartRequestDto {
  inventoryId: number;
}

export interface inventoryProgressChartResponseDto {
  inventoryId: number;
  startedCount: number;
  untouchedCount: number;
}
