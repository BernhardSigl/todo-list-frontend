import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-all-todos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './all-todos.component.html',
  styleUrl: './all-todos.component.scss',
})
export class AllTodosComponent {
  todos: any = [];
  error!: string;
  addTodoInput!: string;
  token!: string | null;
  headers!: any;
  editMode = false;

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    try {
      this.token = localStorage.getItem('token');
      this.headers = { Authorization: `Token ${this.token}` };
      this.todos = await this.loadTodos();
    } catch (e) {
      console.error('Error all-todos: ', e);
      this.error = 'Fehler beim laden';
    }
  }

  loadTodos() {
    const url = environment.baseUrl + '/todos/';
    return lastValueFrom(this.http.get(url));
  }

  async send() {
    try {
      const url = environment.baseUrl + '/todos/';
      const author = Number(localStorage.getItem('author'));

      const body = {
        title: this.addTodoInput,
        author: author,
        checked: false,
      };

      await this.http.post(url, body, this.headers).toPromise();

      this.addTodoInput = '';
      this.todos = await this.loadTodos();
    } catch (e) {
      console.error('Fehler: ', e);
    }
  }

  async delete(idx: number) {
    try {
      const url = environment.baseUrl + '/todos/';
      await this.http.delete(url, { headers: this.headers, body: this.todos[idx] }).toPromise();
      this.todos.splice(idx, 1);
    } catch (e) {
      console.error('Fehler beim Löschen des ToDo-Elements:', e);
    }
  }

  async toggleEditMode() {
    this.editMode = !this.editMode;
  }

  async update(idx: number) {
    try {
      const updatedTitle = this.todos[idx].title.endsWith(' (bearbeitet)') ?
      this.todos[idx].title.slice(0, -13) : this.todos[idx].title;

      const url = environment.baseUrl + '/todos/';
      
      const updatedBody = { id: this.todos[idx].id, title: updatedTitle }; // Nur ID und aktualisierter Titel senden
      
      await this.http.put(url, updatedBody,{ headers: this.headers }).toPromise(); // Verwende PUT-Anfrage für Aktualisierung
      this.todos = await this.loadTodos(); // Aktualisierte Liste von Todos abrufen
    } catch (e) {
      console.error('Fehler beim Aktualisieren des Todos:', e);
    }
    this.editMode = false;
  }
}
