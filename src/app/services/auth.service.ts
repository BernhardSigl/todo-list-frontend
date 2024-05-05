import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http'; // add "provideHttpClient" -> app.config.ts

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public loginWithUsernameAndPassword(username: string, password: string) {
    const url = environment.baseUrl + '/login/';

    const raw = {
      "username": username,
      "password": password,
    };

    return lastValueFrom(this.http.post(url, raw));
  }
}
