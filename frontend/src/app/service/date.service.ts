import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateService {
  private readonly dateStartKey = 'dateStartKey';
  private readonly dateEndKey = 'dateEndKey';


  setStartDate(date: Date) {
    console.log('Setting Start Date:', date);
    // localStorage.setItem(this.dateStartKey, date.toDateString());
    localStorage.setItem(this.dateStartKey, date.toISOString().substring(0, 10));
  }

  getStartDate(): string | null {
    const startDate = localStorage.getItem(this.dateStartKey);
    console.log('Retrieved Start Date from localStorage:', startDate);
    return startDate ? startDate : null;
  }

  setEndDate(date: Date) {
    console.log('Setting End Date:', date);
    // localStorage.setItem(this.dateEndKey, date.toDateString());
    localStorage.setItem(this.dateEndKey, date.toISOString().substring(0, 10));
  }

  getEndDate(): string | null {
    const endDate = localStorage.getItem(this.dateEndKey);
    console.log('Retrieved End Date from localStorage:', endDate);
    return endDate ? endDate : null;
  }

}
