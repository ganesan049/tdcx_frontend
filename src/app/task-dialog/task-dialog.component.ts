import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements AfterViewInit {

  name;
  completed = false;
  action;
  _id;
  @ViewChild('task') nameRef:ElementRef;
  constructor(private _service:ServiceService, private dialogRef:MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
      //console.log(this.data);
      if(this.data && this.data.action){
        //console.log('inside if')
        this.name = this.data.name;
        this.completed = this.data.completed;
        this.action = this.data.action;
        this._id  = this.data._id;
      }
    }

  ngAfterViewInit(): void {
    this.nameRef.nativeElement.focus();
  }

  updateTask(){
    this._service.putTasks({_id:this._id,name:this.name,completed:this.completed}).subscribe(
      res => {
        //console.log(res);
        this.data = {name:this.name,completed:this.completed,_id:this._id,action:this.action};
        this.dialogRef.close(this.data);
      },
      err => {
        console.error(err);
        this.dialogRef.close(this.data);
      }
    )
  }

  addTask(){
    this._service.addTasks({name:this.name}).subscribe(
      res => {
        //console.log(res);
        //console.log(`${this.name} added successfully`)
        //console.log('executed')
        this.data = {name:this.name,completed:this.completed,_id:res._id,action:this.action};
        this.dialogRef.close(this.data);
      },
      err => {
        console.error(err);
        this.dialogRef.close(this.data);
      }
    );
  }

}
