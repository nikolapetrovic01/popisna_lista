import {Injectable} from "@angular/core";
import {environment} from "../../enviroments/enviroment";
import {HttpClient} from "@angular/common/http";
import {loginRequest, loginResponse} from "../dto/login";
import {Observable} from "rxjs";
import {inventories} from "../dto/inventories";

@Injectable({
  providedIn: 'root',
})
export class InventoryService{
  private baseUrl = `${environment.backendUrl}/controller`;

  constructor(private http: HttpClient) {}

  getInventory(): Observable<inventories> {
    return this.http.get<inventories>(this.baseUrl);
  }
}
