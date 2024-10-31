import {Injectable} from "@angular/core";
import {environment} from "../../enviroments/enviroment";
import {HttpClient} from "@angular/common/http";
import {loginRequest, loginResponse} from "../dto/login";
import {Observable} from "rxjs";
import {inventories} from "../dto/inventories";
import {item, items, selectedItems, selectItem, updateItemAmount} from "../dto/item";

@Injectable({
  providedIn: 'root',
})
export class InventoryService{
  private baseUrl = `${environment.backendUrl}/controller`;

  constructor(private http: HttpClient) {}

  /**
   * Retrieves the inventory list from the backend.
   * @returns - An observable of `inventories`, which is the inventory list data.
   */
  getInventory(): Observable<inventories> {
    return this.http.get<inventories>(this.baseUrl);
  }

  /**
   * Retrieves the items within a specific inventory by ID.
   * @param id - The ID of the inventory.
   * @returns - An observable of `items` representing the list of items in the specified inventory.
   */
  getItems(id: number): Observable<items>{
    return this.http.get<items>(`${this.baseUrl}/inventory/${id}`);
  }

  /**
   * Updates the amount of a specific item within an inventory.
   * @param itemToUpdate - An object containing the item data to update.
   * @returns - An observable of `item` with the updated data.
   */
  updateItemAmount(itemToUpdate: updateItemAmount): Observable<item>{
    return this.http.put<item>(`${this.baseUrl}/inventory/${itemToUpdate.itemId}`, itemToUpdate);
  }

  // closeInventory(id: number): Observable<item>{
  //   return this.http.post<item>()
  // }

  /**
   * Creates a new inventory with the selected items.
   * @param selectedItems - An object representing the items and details for the new inventory.
   * @returns - An observable of `selectedItems` as confirmation of the created inventory.
   */
  createNewInventory(selectedItems: selectedItems): Observable<selectedItems>{
    return this.http.post<selectedItems>(`${this.baseUrl}/inventory/create`, selectedItems);
  }
}
