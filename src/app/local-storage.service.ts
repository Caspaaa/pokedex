import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  // how to type this?
  setItem(key: string, value: any) {
    // this is to avoid getting localStorage is not defined error
    if (typeof window !== 'undefined') {
      try {
        const stringifiedValue = JSON.stringify(value);
        localStorage.setItem(key, stringifiedValue);
      } catch (error) {
        console.error('Error saving in localStorage', error);
      }
    }
  }

  // how to type this?
  getItem(key: string) {
    // this is to avoid getting localStorage is not defined error
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('Error getting item in localStorage', error);
      }
    }
  }

  // how to type this?
  removeItem(key: string) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from localStorage', error);
    }
  }
}
