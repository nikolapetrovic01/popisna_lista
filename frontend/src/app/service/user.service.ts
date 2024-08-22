import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly userLevelKey = "userLevel";
  private readonly userIdKey = "userId";

  setUserLevel(level: number){
    localStorage.setItem(this.userLevelKey, level.toString());
  }

  getUserLevel(): number | null{
    const level = localStorage.getItem(this.userLevelKey);
    return level ? parseInt(level, 10) : null;
  }

  clearUserLevel(){
    localStorage.removeItem(this.userLevelKey);
  }

  setUserId(id: number){
    localStorage.setItem(this.userIdKey, id.toString());
  }

  getUserId(): number | null{
    const level = localStorage.getItem(this.userIdKey);
    return level ? parseInt(level, 10) : null;
  }

  clearUserId(){
    localStorage.removeItem(this.userIdKey);
  }
}
