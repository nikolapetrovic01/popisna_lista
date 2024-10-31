import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import { loginRequest, loginResponse } from "../dto/login";
import {environment} from "../../enviroments/enviroment";

@Injectable({
  providedIn: 'root',
})
export class loginService {
  private baseUrl = `${environment.backendUrl}/login`;

  constructor(private http: HttpClient) {}

  /**
   * Sends a login request to the backend with user credentials.
   * @param data - The login request payload containing username and password.
   * @returns - An observable of `loginResponse`, which contains the server response for the login.
   */
  login(data: loginRequest): Observable<loginResponse> {
    return this.http.post<loginResponse>(this.baseUrl, data).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Handles HTTP errors by determining the error type and returning an appropriate error message.
   * @param error - The error response from the HTTP request.
   * @returns - An observable that throws a formatted error message.
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error && error.error.message) {
        errorMessage = `Error: ${error.error.message}\nDetails: ${error.error.details}`;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    return throwError(errorMessage);
  }
}
