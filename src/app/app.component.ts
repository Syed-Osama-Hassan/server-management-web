import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { DataState } from './enum/data-state.enum';
import { Status } from './enum/status.enum';
import { AppState } from './interface/app-state';
import { CustomResponse } from './interface/custom-response';
import { Server } from './interface/server';
import { NotificationService } from './service/notification.service';
import { ServerService } from './service/server.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  appState$: Observable<AppState<CustomResponse>>;

  readonly DataState = DataState;
  readonly Status = Status;
  private filterSubject = new BehaviorSubject<string>('');
  private dataSubject = new BehaviorSubject<CustomResponse>(null);
  filterStatus$ = this.filterSubject.asObservable();
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  constructor(private serverService: ServerService, private notifier: NotificationService){ }

  ngOnInit(): void{
    this.appState$ = this.serverService.servers$.pipe(
      map(response => {
        this.dataSubject.next(response);
        this.notifier.onDefault(response.message);
        return { dataState: DataState.LOADED_STATE, appData: { ...response, data: { servers: response.data.servers.reverse() } } }
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: string) => {
        this.notifier.onDefault(error);
        return of({ dataState: DataState.ERROR_STATE, error })
      })
    );
  }

  /**
   * 
   * @param ipAddress 
   */
  pingServer(ipAddress: string): void{
    this.filterSubject.next(ipAddress);

    this.appState$ = this.serverService.ping$(ipAddress)
    .pipe(
      map(response => {
        this.dataSubject.value.data.servers[
          this.dataSubject.value.data.servers.findIndex(server => server.id === response.data.server.id)
        ] = response.data.server;
        this.filterSubject.next('');
        this.notifier.onDefault(response.message);
        return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
      }),
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      catchError((error: string) => {
        this.filterSubject.next('');
        return of({ dataState: DataState.ERROR_STATE, error })
      })
    );
  }

  /**
   * 
   * @param serverForm 
   */
  saveServer(serverForm: NgForm): void{
    this.isLoading.next(true);

    this.appState$ = this.serverService.save$(serverForm.value)
    .pipe(
      map(response => {
        this.dataSubject.next(
          { ...response, data: { servers: [response.data.server, ...this.dataSubject.value.data.servers] }}
        );
        document.getElementById('closeModal').click();
        this.isLoading.next(false);
        serverForm.resetForm({ status: this.Status.SERVER_DOWN });
        this.notifier.onDefault(response.message);
        return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
      }),
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      catchError((error: string) => {
        this.isLoading.next(false);
        return of({ dataState: DataState.ERROR_STATE, error })
      })
    );
  }

  /**
   * 
   * @param status 
   */
  filterServers(status: Status): void{

    this.appState$ = this.serverService.filter$(status, this.dataSubject.value)
    .pipe(
      map(response => {
        this.notifier.onDefault(response.message);
        return { dataState: DataState.LOADED_STATE, appData: response }
      }),
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error })
      })
    );
  }

  /**
   * 
   * @param server 
   */
  deleteServer(server: Server): void{
    this.appState$ = this.serverService.delete$(server.id)
    .pipe(
      map(response => {
        this.dataSubject.next(
          {...response, data: {servers: this.dataSubject.value.data.servers.filter(s => s.id !== server.id) } }
        );
        this.notifier.onDefault(response.message);
        return { dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }
      }),
      startWith({ dataState: DataState.LOADED_STATE, appData: this.dataSubject.value }),
      catchError((error: string) => {
        return of({ dataState: DataState.ERROR_STATE, error })
      })
    );
  }

  /**
   * Download servers report
   */
  printReport(): void{
    let dataType = 'application/vnd.ms-excel.sheet.macroEnabled.12';
    let tableSelect = document.getElementById('servers');
    let tableHtml = tableSelect.outerHTML.replace(/ /g, '%20');
    let downloadButton = document.createElement('a');
    document.body.appendChild(downloadButton);
    downloadButton.href = 'data:'+ dataType + ', ' + tableHtml;
    downloadButton.download = 'server-report.xls';
    downloadButton.click();
    document.body.removeChild(downloadButton);
  }

}
