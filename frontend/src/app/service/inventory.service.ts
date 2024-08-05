import {Injectable} from "@angular/core";
import {environment} from "../../enviroments/enviroment";
import {HttpClient} from "@angular/common/http";
import {loginRequest, loginResponse} from "../dto/login";
import {Observable} from "rxjs";
import {inventories} from "../dto/inventories";
import {item, items, updateItemAmount} from "../dto/item";

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

  updateItemAmount(id: number, amount: number, inventoryId: number): Observable<item>{
    const body : updateItemAmount = {
      itemId: id,
      inventoryId: inventoryId,
      amount: amount
    };

    return this.http.put<item>(`${this.baseUrl}/inventory/${id}`, body);
  }

  // closeInventory(id: number): Observable<item>{
  //   return this.http.post<item>()
  // }
}
