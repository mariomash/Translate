import { HttpClient } from '@angular/common/http';
import { retry, tap, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import * as Sentry from '@sentry/browser';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private subscription: Subscription = new Subscription();

  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      Sentry.captureMessage(
        `http: ${operation} failed: ${JSON.stringify(error)}`,
        Sentry.Severity.Error
      );
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  constructor(
    private httpClient: HttpClient) { }

    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }

    public getAvailableLanguagesFromServer(): Observable<Array<string>> {
      const url = `${environment.apiUrl}//translation/getAvailableLanguages/`;
      return this.httpClient.get(url).pipe(
        retry(3),
        tap((result: any) => {
          if (environment.production === false) {
            return console.log(
              `${
                this.constructor.name
              }.getAvailableLanguagesFromServer(): ${JSON.stringify(result)}`
            );
          }
        }),
        catchError(
          this.handleError<any>('getAuditEntriesFromServer')
        )
      );
    }

}
