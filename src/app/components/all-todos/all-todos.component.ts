import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-todos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-todos.component.html',
  styleUrl: './all-todos.component.scss',
})
export class AllTodosComponent {
  todos: any = [];
  error!: string;
  constructor(private http: HttpClient) {}

  async ngOnInit() {
    try {
      this.todos = await this.loadTodos();
      console.log(this.todos);
    } catch (e) {
      console.error('Error: ', e);
      this.error = 'Fehler beim laden';
    }
  }

  loadTodos() {
    const url = environment.baseUrl + '/todos/';
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Token ' + localStorage.getItem('token'));
    return lastValueFrom(this.http.get(url, {
      headers: headers
    }));
  }
}
