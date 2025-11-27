import { Injectable } from '@angular/core';
import {CreateUser, User, Users, userToDelete, userToUpdate} from "../dto/user";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {inventories} from "../dto/inventories";
import {environment} from "../../enviroments/enviroment";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly userLevelKey = "userLevel";
  private readonly userIdKey = "userId";
  private managerBaseUrl = `${environment.backendUrl}/controller`;

  constructor(private http: HttpClient) {}

  /**
   * Sets the user level in localStorage.
   * @param level - The user level as a number.
   */
  setUserLevel(level: number) {
    localStorage.setItem(this.userLevelKey, level.toString());
  }

  /**
   * Retrieves the user level from localStorage.
   * @returns - The user level as a number, or null if not found.
   */
  getUserLevel(): number | null {
    const level = localStorage.getItem(this.userLevelKey);
    return level ? parseInt(level, 10) : null;
  }

  /**
   * Clears the user level from localStorage.
   */
  clearUserLevel() {
    localStorage.removeItem(this.userLevelKey);
  }

  /**
   * Sets the user ID in localStorage.
   * @param id - The user ID as a number.
   */
  setUserId(id: number) {
    localStorage.setItem(this.userIdKey, id.toString());
  }

  /**
   * Retrieves the user ID from localStorage.
   * @returns - The user ID as a number, or null if not found.
   */
  getUserId(): number | null {
    const level = localStorage.getItem(this.userIdKey);
    return level ? parseInt(level, 10) : null;
  }

  /**
   * Clears the user ID from localStorage.
   */
  clearUserId() {
    localStorage.removeItem(this.userIdKey);
  }

  getHeaders(): HttpHeaders {
    const token = (localStorage.getItem('authToken') || '').replace('Bearer ', '').trim();
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');;
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.managerBaseUrl}/get-users`, {headers: this.getHeaders()});
  }

  createNewUser(newUser: CreateUser): Observable<void> {
    return this.http.post<void>(`${this.managerBaseUrl}/create`, newUser, {headers: this.getHeaders()});
  }

  deleteUser(user: userToDelete): Observable<void> {
    return this.http.post<void>(`${this.managerBaseUrl}/user-deletion`, user, {headers: this.getHeaders()});
  }

  updateUser(user: userToUpdate): Observable<void> {
    return this.http.put<void>(`${this.managerBaseUrl}/user-edit`, user, {headers: this.getHeaders()});
  }
}
