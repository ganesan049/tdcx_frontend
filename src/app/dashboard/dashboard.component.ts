import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ServiceService } from '../service.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
import { eventNames } from 'process';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  isLoggedIn = false;
  tasksCompleted:number;
  totalTasks:number;
  latestTasks:any[] = [];
  searchTaskList:any[] = [];
  taskList:any[] = [];
  searchText = '';
  constructor(private _service:ServiceService, private dialog:MatDialog, private changeDetection: ChangeDetectorRef) { }
  pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)'],
    },
  ];
  pieChartData: number[] = [];
  public pieChartLabels: Label[] = ['Completed','Incompleted'];
  pieChartType: ChartType = 'pie';
  public pieChartPlugins = ['Completed','Incompleted'];
  pieChartLegend = true;

  ngOnInit(): void {
    //console('dialog')
    this.isLoggedIn = this._service.loggedIn();
    this._service.dashboard().subscribe(
      res => {
        this.tasksCompleted = res.tasksCompleted;
        this.totalTasks = res.totalTasks;
        this.latestTasks = res.latestTasks;
      },
      err => {
        console.error(err);
      }
    )
    this.getTask();



    // this.taskList = [...this.latestTasks];
  }

  getTask(){
    this._service.getTasks().subscribe(
      res => {
        this.taskList = res;
        this.searchTaskList = [...this.taskList];
        //console(this.searchTaskList)
        this.getCounts();
      },
      err => {
        console.error(err);
      }
    )
  }
  addTask(_id,name?,completed?,action?){
    //console(
      // _id,
      // name,
      // completed,
      // action)
    const dialogRef = this.dialog.open(TaskDialogComponent,{
      data:{
          _id,
          name,
          completed,
          action
      }
    });
    dialogRef
      .afterClosed()
      .subscribe(result => {
        //console(result);
          if(result && result.action == 'update'){
            //console({name:result.name,completed:result.completed})
            // this.taskList.splice(result._id,1,{name:result.name,completed:result.completed})
            this.taskList = this.taskList.map(task => {
              if(task._id == _id){
                return {
                  name,completed,_id:_id
                }
              }else{
                return task;
              }
            })
          }else if(result){
            this.latestTasks.shift();
            this.latestTasks.unshift(result);
            this.taskList.unshift(result);
          }
          this.getCounts();
      })
  }
  getCounts(){
    this.tasksCompleted = this.taskList.filter(task => task.completed).length;
    this.totalTasks = this.taskList.length;
    this.pieChartData = [this.tasksCompleted,this.totalTasks - this.tasksCompleted];
    this.latestTasks = [...this.taskList];
    this.searchTaskList = [...this.taskList];
    this.changeDetection.detectChanges();
    this.searchText = '';

  }
  editTask(_id,name,completed){
    //console(_id,name,completed," edit");
    this._service.putTasks({_id,name,completed}).subscribe(
      res => {
        console.log(`successfully udpated the task ${name}`);
        // this.getTask();
      },
      err => {
        console.error(`error occured during update of task ${name}`)
      }
    )
    // this.taskList.splice(_id,1,{name,completed})
    this.taskList = this.taskList.map(task => {
      if(task._id == _id){
        return {
          name,completed,_id:_id
        }
      }else{
        return task;
      }
    })
    this.getCounts();
  }
  deleteTask(_id,name){
    //console(_id,name," delete")
    this._service.deleteTasks(_id).subscribe(
      res => {
        console.log(`successfully deleted the task ${name}`);
        // this.getTask();
      },
      err => {
        console.error(`error occured during delete of task ${name}`)
      }
    )
    // this.taskList.splice(_id,1)
    this.taskList = this.taskList.filter(task => {
      if(task._id == _id){
        return false;
      }else{
        return true;
      }
    })
    this.getCounts();
  }
  searchTask(searchText){
    this.searchText = searchText;
    this.searchTaskList = [...this.taskList];
    //console(this.searchText,this.taskList,this.searchTaskList,this.searchText.length);
    if(this.searchTask.length > 0){
      let searchTaskList = this.searchTaskList.filter(task => {
        if(task.name.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0){
          return true;
        }else{
          return false;
        }
      });
      this.searchTaskList = searchTaskList;
    }
    //console(this.searchTaskList);
    // this.changeDetection.detectChanges();
  }
}
