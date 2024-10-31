import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class StorageService {

  /**
   * Stores an item in localStorage by converting it to a JSON string.
   * @param key - The key under which the data will be stored
   * @param value - The data to be stored; it will be serialized to a JSON string
   */
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Retrieves an item from localStorage, parsing it from a JSON string back into its original form.
   * @param key - The key under which the data was stored
   * @returns - The parsed data, or null if the item does not exist
   */
  getItem<T>(key: string): T | null {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  /**
   * Removes a specific item from localStorage.
   * @param key - The key of the item to remove
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
}
