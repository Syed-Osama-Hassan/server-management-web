import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';

/**
 * 
 * @author Syed Osama Hassan
 */
@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  
  constructor(private notifierService: NotifierService){}
  
 onDefault(message: string): void{
  this.notifierService.notify(Type.DEFAULT, message);
 }

 onSuccess(message: string): void{
  this.notifierService.notify(Type.SUCCESS, message);
 }

 onInfo(message: string): void{
  this.notifierService.notify(Type.INFO, message);
 }

 onWarning(message: string): void{
  this.notifierService.notify(Type.WARNING, message);
 }

 onError(message: string): void{
  this.notifierService.notify(Type.ERROR, message);
 }

}

enum Type{
  DEFAULT= 'default',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}
