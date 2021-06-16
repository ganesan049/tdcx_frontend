import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ServiceService } from './service.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor{

  constructor(private _service:ServiceService) { }
  intercept(request:HttpRequest<any>, next:HttpHandler): Observable<any>{
    request = this.addAuthHeader(request)
    return next.handle(request).pipe(
      catchError((error:HttpErrorResponse) => {
        console.log(error)
        return throwError(error)
      })
    )
  }

  addAuthHeader(request:HttpRequest<any>){
    const token = `Bearer ${this._service.getToken()}`;

    if(token){
      return request.clone({
        setHeaders: {
          'x-access-token': token
        }
      })
    }
    return request;
  }
  // intercept(req,next){
  //   let tokenizedReq = req.clone({
  //     setHeaders:{
  //       Authorization: `Bearer ${this._service.getToken()}`
  //     }
  //   });
  //   return next.handle(tokenizedReq);
  // }
}
