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

  getInventory(): Observable<inventories> {
    return this.http.get<inventories>(this.baseUrl);
  }

  getItems(id: number): Observable<items>{
    return this.http.get<items>(`${this.baseUrl}/inventory/${id}`);
  }

  updateItemAmount(itemToUpdate: updateItemAmount): Observable<item>{
    return this.http.put<item>(`${this.baseUrl}/inventory/${itemToUpdate.itemId}`, itemToUpdate);
  }

  // closeInventory(id: number): Observable<item>{
  //   return this.http.post<item>()
  // }

  createNewInventory(selectedItems: selectedItems): Observable<selectedItems>{
    return this.http.post<selectedItems>(`${this.baseUrl}/inventory/create`, selectedItems);
  }
}
