import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Status } from '../enum/status.enum';
import { CustomResponse } from '../interface/custom-response';
import { Server } from '../interface/server';

/**
 * 
 * @author Syed Osama Hassan
 */
@Injectable({
  providedIn: 'root',
})
export class ServerService {
  private readonly apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  /**
   * GET: Get all servers
   */
  servers$ = <Observable<CustomResponse>>(
    this.http
      .get<CustomResponse>(`${this.apiUrl}/server/list`)
      .pipe(tap(console.log), catchError(this.handleError))
  );

  /**
   * POST: Send request to create new server
   * 
   * @param server 
   * @returns 
   */
  save$ = (server: Server) =>
    <Observable<CustomResponse>>(
      this.http
        .post<CustomResponse>(`${this.apiUrl}/server/save`, server)
        .pipe(tap(console.log), catchError(this.handleError))
    );

    /**
     * GET: Ping the given ip address
     * 
     * @param ipAddress 
     * @returns 
     */
  ping$ = (ipAddress: string) =>
    <Observable<CustomResponse>>(
      this.http
        .get<CustomResponse>(`${this.apiUrl}/server/ping/${ipAddress}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   * Filter server based on status
   * 
   * @param status 
   * @param response 
   * @returns 
   */
  filter$ = (status: Status, response: CustomResponse) =>
    <Observable<CustomResponse>>new Observable<CustomResponse>((subscriber) => {
      console.log(response);
      subscriber.next(
        status === Status.ALL
          ? { ...response, message: `Servers filtered by ${status} status` }
          : {
              ...response,
              message:
                response.data.servers.filter(
                  (server) => server.status === status
                ).length > 0
                  ? `Servers filtered by 
          ${status === Status.SERVER_UP ? 'SERVER_UP' : 'SERVER_DOWN'} status`
                  : `No servers of ${status} found`,
              data: {
                servers: response.data.servers?.filter(
                  (server) => server.status === status
                ),
              },
            }
      );
      subscriber.complete();
    }).pipe(tap(console.log), catchError(this.handleError));

  /**
   * DELETE: Send request to delete the server against server id
   * 
   * @param serverId 
   * @returns 
   */
  delete$ = (serverId: number) =>
    <Observable<CustomResponse>>(
      this.http
        .delete<CustomResponse>(`${this.apiUrl}/server/delete/${serverId}`)
        .pipe(tap(console.log), catchError(this.handleError))
    );

  /**
   * Throw error
   * 
   * @param error 
   * @returns 
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`ERROR OCCURRED | ERROR_CODE=${error.status}`);
  }
}
