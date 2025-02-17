export interface inventoriesPiece {
  id: number;
  startDate: Date;
  endDate: Date;
  status: number;
}

export interface inventories {
  tables: inventoriesPiece[];
}
