import { Injectable } from '@angular/core';
import { User } from '../interfaces';

const USER_STORAGE_KEY = 'auth_user';

@Injectable({
    providedIn: 'root'
})
export class UserStorageService {
    public get(): User | null {
        try {
            const stored = localStorage.getItem(USER_STORAGE_KEY);

            return stored ? (JSON.parse(stored) as User) : null;
        } catch {
            return null;
        }
    }

    public set(user: User): void {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }

    public clear(): void {
        localStorage.removeItem(USER_STORAGE_KEY);
    }
}
