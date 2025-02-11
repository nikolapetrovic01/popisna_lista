import {Injectable} from "@angular/core";
import {environment} from "../../enviroments/enviroment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {inventories} from "../dto/inventories";
import {item, items, selectedItems, updateItemAmount} from "../dto/item";

@Injectable({
  providedIn: 'root',
})
export class InventoryService{
  private managerBaseUrl = `${environment.backendUrl}/controller`;
  private workerBaseUrl = `${environment.backendUrl}/worker`;
  constructor(private http: HttpClient) {}

  getHeaders(): HttpHeaders {
    const token = (localStorage.getItem('authToken') || '').replace('Bearer ', '').trim();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  /**
   * Retrieves the inventory list from the backend.
   * @returns - An observable of `inventories`, which is the inventory list data.
   */
  getInventory(): Observable<inventories> {
    return this.http.get<inventories>(`${this.managerBaseUrl}`, {headers: this.getHeaders()});
  }

  /**
   * Retrieves the items within a specific inventory by ID.
   * @param id - The ID of the inventory.
   * @returns - An observable of `items` representing the list of items in the specified inventory.
   */
  getItems(id: number): Observable<items>{
    return this.http.get<items>(`${this.managerBaseUrl}/inventory/${id}`, {headers: this.getHeaders()});
  }

  /**
   * Updates the amount of a specific item within an inventory.
   * @param itemToUpdate - An object containing the item data to update.
   * @returns - An observable of `item` with the updated data.
   */
  updateItemAmount(itemToUpdate: updateItemAmount): Observable<item>{
    return this.http.put<item>(`${this.managerBaseUrl}/inventory/${itemToUpdate.itemId}`, itemToUpdate, {headers: this.getHeaders()});
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
    return this.http.post<selectedItems>(`${this.managerBaseUrl}/inventory/create`, selectedItems, {headers: this.getHeaders()});
  }

  //WORKER SERVICE

  getWorkerInventory(): Observable<inventories> {
    return this.http.get<inventories>(`${this.workerBaseUrl}`, {headers: this.getHeaders()});
  }

  getWorkerItems(id: number): Observable<items>{
    return this.http.get<items>(`${this.workerBaseUrl}/inventory/${id}`, {headers: this.getHeaders()});
  }

  saveWorkerChangedItems(items: item[]): Observable<item> {
    return this.http.put<item>(`${this.managerBaseUrl}/inventory/saveChanges`, items, {headers: this.getHeaders()});
  }
}
