import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import { loginRequest, loginResponse } from "../dto/login";
// import { jwtDecode } from "jwt-decode";
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
    return this.http.post<loginResponse>(this.baseUrl, data)
      .pipe(
      tap((authResponse: loginResponse) => this.setToken(authResponse)),
      catchError(((error) => this.handleError(error)))
    );
  }

  private setToken(authResponse: loginResponse) {
    localStorage.setItem("authToken", authResponse.jwtToken);
    localStorage.setItem("userLevel", authResponse.level.toString()); // Store user level
  }

  //TODO: FIX
  /**
   * Check if a valid JWT token is saved in the localStorage
   */
  isLoggedIn(): boolean {
    console.log("Is logged in!");
    return true;
  }

  logoutUser() {
    localStorage.removeItem("authToken");
  }

  getToken() {
    return localStorage.getItem("authToken");
  }

  // private getTokenExpirationDate(token: string): Date {
  //   const decoded: any = jwtDecode(token);
  //   if (decoded.exp === undefined) {
  //     return null;
  //   }
  //
  //   const date = new Date(0);
  //   date.setUTCSeconds(decoded.exp);
  //   return date;
  // }

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
      // Server-side error handling
      if (error.status === 0) {
        errorMessage = 'System down: Unable to connect to the server.';
      } else if (error.status === 401 || error.status === 403 || error.status === 404) {
        errorMessage = 'Invalid credentials: Please check your username and password.';
      } else if (error.status === 500) {
        errorMessage = 'Server error: Please try again later.';
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    return throwError(() => new Error(errorMessage));
  }
}
