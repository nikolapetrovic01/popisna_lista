import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import { loginRequest, loginResponse } from "../dto/login";
import {environment} from "../../enviroments/enviroment";

@Injectable({
  providedIn: 'root',
})
export class loginService {
  private baseUrl = `${environment.backendUrl}/login`;

  constructor(private http: HttpClient) {}

  login(data: loginRequest): Observable<loginResponse> {
    return this.http.post<loginResponse>(this.baseUrl, data);
  }
}
