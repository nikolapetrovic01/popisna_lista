import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private readonly dateStartKey = 'dateStartKey';
  private readonly dateEndKey = 'dateEndKey';

  /**
   * Stores the start date in localStorage.
   * @param date - The start date to be saved, expected as a Date object.
   */
  setStartDate(date: Date) {
    localStorage.setItem(this.dateStartKey, date.toISOString().substring(0, 10));
  }

  /**
   * Retrieves the start date from localStorage.
   * @returns - The start date as a string (YYYY-MM-DD) if it exists, otherwise null.
   */
  getStartDate(): string | null {
    const startDate = localStorage.getItem(this.dateStartKey);
    return startDate ? startDate : null;
  }

  /**
   * Stores the end date in localStorage.
   * @param date - The end date to be saved, expected as a Date object.
   */
  setEndDate(date: Date) {
    localStorage.setItem(this.dateEndKey, date.toISOString().substring(0, 10));
  }

  /**
   * Retrieves the end date from localStorage.
   * @returns - The end date as a string (YYYY-MM-DD) if it exists, otherwise null.
   */
  getEndDate(): string | null {
    const endDate = localStorage.getItem(this.dateEndKey);
    return endDate ? endDate : null;
  }
}
