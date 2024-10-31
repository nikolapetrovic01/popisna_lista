import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly userLevelKey = "userLevel";
  private readonly userIdKey = "userId";

  /**
   * Sets the user level in localStorage.
   * @param level - The user level as a number.
   */
  setUserLevel(level: number){
    localStorage.setItem(this.userLevelKey, level.toString());
  }

  /**
   * Retrieves the user level from localStorage.
   * @returns - The user level as a number, or null if not found.
   */
  getUserLevel(): number | null{
    const level = localStorage.getItem(this.userLevelKey);
    return level ? parseInt(level, 10) : null;
  }

  /**
   * Clears the user level from localStorage.
   */
  clearUserLevel(){
    localStorage.removeItem(this.userLevelKey);
  }

  /**
   * Sets the user ID in localStorage.
   * @param id - The user ID as a number.
   */
  setUserId(id: number){
    localStorage.setItem(this.userIdKey, id.toString());
  }

  /**
   * Retrieves the user ID from localStorage.
   * @returns - The user ID as a number, or null if not found.
   */
  getUserId(): number | null{
    const level = localStorage.getItem(this.userIdKey);
    return level ? parseInt(level, 10) : null;
  }

  /**
   * Clears the user ID from localStorage.
   */
  clearUserId(){
    localStorage.removeItem(this.userIdKey);
  }
}
