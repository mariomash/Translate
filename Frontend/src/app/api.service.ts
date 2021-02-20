import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { retry, tap, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Subscription, Observable, of } from 'rxjs';
import * as Sentry from '@sentry/browser';
import { environment } from 'src/environments/environment';
import { FormGroup } from '@angular/forms';
import { TranslationResponse } from './translate/TranslationResponse';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private subscription: Subscription = new Subscription();

  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      if (environment.production === false) {
        if (error.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
        }
      }
      Sentry.captureMessage(
        `http: ${operation} failed: ${JSON.stringify(error)}`,
        Sentry.Severity.Error
      );
      // We could keep the app running by returning an empty result.
      return of(result as T);
    };
  }

  constructor(
    private httpClient: HttpClient) { }

    ngOnDestroy(): void {
      this.subscription.unsubscribe();
    }

    public getAvailableLanguagesFromServer(): Observable<Array<string>> {
      const url = `${environment.apiUrl}/translation/getAvailableLanguages/`;
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

    public translateText(formData: FormData): Observable<TranslationResponse | HttpErrorResponse> {
      const url = `${environment.apiUrl}/translation/translate/`;
      return this.httpClient.post(url, formData).pipe(
        retry(3),
        tap((result: any) => {
          if (environment.production === false) {
            return console.log(
              `${
                this.constructor.name
              }.translateText(): ${JSON.stringify(result)}`
            );
          }
        }),
        catchError(
          this.handleError<any>('getAuditEntriesFromServer')
        )
      );
    }
}
