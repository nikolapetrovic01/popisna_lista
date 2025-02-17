import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable, tap, throwError} from "rxjs";
import { loginRequest, loginResponse } from "../dto/login";
import { jwtDecode } from "jwt-decode";
import {environment} from "../../enviroments/enviroment";
import {UserService} from "./user.service";

@Injectable({
  providedIn: 'root',
})
export class loginService {
  private baseUrl = `${environment.backendUrl}/login`;

  constructor(private http: HttpClient,
              private userService: UserService) {}

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

  getUserRole() {
    const token = this.getToken();

    if (!token) {
      return "UNDEFINED"; // Token is missing, return default role
    }

    try {
      const decoded: any = jwtDecode(token);
      const authInfo: string[] = decoded.roles || []; // Use "roles" as per backend

      if (authInfo.includes("ROLE_ADMIN")) {
        return "ADMIN";
      } else if (authInfo.includes("ROLE_MANAGER")) {
        return "MANAGER";
      } else if (authInfo.includes("ROLE_WORKER_ADMIN")) {
        return "WORKER_ADMIN";
      } else if (authInfo.includes("ROLE_WORKER")) {
        return "WORKER";
      }
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return "UNDEFINED"; // Return default role if decoding fails
    }

    return "UNDEFINED";
  }

  /**
   * Check if a valid JWT token is saved in the localStorage
   */
  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }

    const expirationDate = this.getTokenExpirationDate(token);
    return expirationDate !== null && expirationDate.valueOf() > new Date().valueOf();
  }

  logoutUser() {
    localStorage.removeItem("authToken");
    this.userService.clearUserId();
    this.userService.clearUserLevel();
  }

  getToken() {
    return localStorage.getItem("authToken");
  }

  private getTokenExpirationDate(token: string): Date {
    const decoded: any = jwtDecode(token);
    if (decoded.exp === undefined) {
      throw new Error("Token does not have an expiration date.");
    }

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
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
