import {Injectable} from "@angular/core";
import {environment} from "../../enviroments/enviroment";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {
  itemName,
  dateFilterDto,
  itemInventoryComparisonRequestDto,
  ItemInventoryComparisonDto
} from "../dto/statistics";

@Injectable({
  providedIn: 'root',
})

export class StatisticsService {
  private managerBaseUrl = `${environment.backendUrl}/controller`;

  constructor(private http: HttpClient) {}

  getHeaders(): HttpHeaders {
    const token = (localStorage.getItem('authToken') || '').replace('Bearer ', '').trim();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getItemsForDropdown(dates: dateFilterDto): Observable<itemName[]> {
    const params = new HttpParams()
      .set('startDate', dates.startDate)
      .set('endDate', dates.endDate)
    return this.http.get<itemName[]>(`${this.managerBaseUrl}/statistics/get-itemNames`, {headers: this.getHeaders(), params: params});
  }

  getItemInventoryComparisons(request: itemInventoryComparisonRequestDto): Observable<ItemInventoryComparisonDto[]> {
    return this.http.post<ItemInventoryComparisonDto[]>(`${this.managerBaseUrl}/statistics/item-inventory-comparison`, request, {headers: this.getHeaders()});
  }

}
