import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  id = '';
  name = '';
  error = false;

  @Output() data = new EventEmitter<any>();
  constructor(private _service:ServiceService, private router:Router) { }

  ngOnInit(): void {
  }

  onSubmit(){
    console.log('submitted',this)
    if(this.id.length == 0 || this.name.length == 0){
      this.error = true;
    }else{
      console.log('submitted')
      this._service.login({name:this.name,apiKey:this.id}).subscribe(
        res => {
          this.data.emit(res);
        },
        err => {
          if(err){
            this.error = true;
          }
        }
      )
    }
  }
}
