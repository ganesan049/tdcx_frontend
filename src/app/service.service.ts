import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  // private _url = 'https://dev-dl.tdcx.com:3092/'
  private _url = 'http://localhost:8080';
  private img = '';

  constructor(private http:HttpClient) { }

  login(user){
    let url = `${this._url}/login`;
    return this.http.post<any>(url,user);
  }

  dashboard(){
    return this.http.get<any>(`${this._url}/dashboard`);
  }

  getTasks(){
    return this.http.get<any>(`${this._url}/tasks`);
  }

  addTasks(task){
    return this.http.post<any>(`${this._url}/tasks`,task);
  }

  putTasks(task){
    return this.http.put<any>(`${this._url}/tasks/${task._id}`,task);
  }

  deleteTasks(id){
    return this.http.delete<any>(`${this._url}/tasks/${id}`);
  }

  loggedIn(){
    return !!localStorage.getItem('token');
  }

  getToken(){
    return localStorage.getItem('token');
  }
}
