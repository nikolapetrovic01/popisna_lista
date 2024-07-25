export interface inventories {
  tables: inventoriesPiece[];
}

export interface inventoriesPiece{
  id: number;
  startDate: Date;
  endDate: Date;
  status: number;
}
