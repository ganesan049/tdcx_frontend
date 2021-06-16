import { Component, OnInit } from '@angular/core';
import { ServiceService } from './service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  isLoggedIn = false;
  img='';
  name='';

  constructor(private _service:ServiceService){
  }

  ngOnInit(){
    this.isLoggedIn = this._service.loggedIn();
  }

  logOut(){
    localStorage.clear();
    this.isLoggedIn = false;
  }

  setData(event){
    // console.log(event);
    localStorage.setItem('token',event.token.token);
    this.img = event.img;
    this.name = event.name;
    this.isLoggedIn = true;
  }
}
