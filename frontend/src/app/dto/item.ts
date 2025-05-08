export interface item {
  itemId: number;
  itemName: string;
  itemMeasurement: string;
  itemPresentAmount: number;
  itemBarcode: string;
  itemInputtedAmount: number;
  itemUserThatPutTheAmountIn: number;
  itemInventoryId: number;
  modalTriggered?: boolean;
}

export interface items {
  items: item[];
}

export interface updateItemAmount {
  itemId: number;
  itemName: string;
  itemMeasurement: string;
  itemPresentAmount: number;
  itemBarcode: string;
  itemInputtedAmount: number;
  itemUserThatPutTheAmountIn: number;
  itemInventoryId: number;
}

export interface selectItem {
  itemId: number;
  itemName: string;
  itemMeasurement: string;
  itemPresentAmount: number;
  itemBarcode: string;
  itemInputtedAmount: number;
  itemUserThatPutTheAmountIn: number;
  itemInventoryId: number;
  selected?: boolean;
}

export interface selectedItems {
  selectedItems: selectItem[];
  startDate: Date;
  endDate: Date;
}
