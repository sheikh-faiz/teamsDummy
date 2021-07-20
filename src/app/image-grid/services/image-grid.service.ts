import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators'

import { ImageGrid, TestListModel } from '../interfaces/image-grid.interface';

@Injectable()
export class ImageGridService {
  constructor(private httpClient : HttpClient) {}

  getImages(): Observable<ImageGrid[]> {
    return this.httpClient.get<ImageGrid[]>('https://jsonplaceholder.typicode.com/albums/1/photos?_limit=100')
    .pipe(
        catchError( this.handleError<ImageGrid[]>('getImages', []) ),
    );
  }

  getExam(): Observable<TestListModel[]> {
    const token = localStorage.getItem('token')
    const headers = 'Bearer '+ token
    return this.httpClient.get<TestListModel[]>('https://cloudlabs-practice-test-api-qa.azurewebsites.net/users/exams', {
      headers: new HttpHeaders().set('Authorization', headers )
    })
    .pipe(
        catchError( this.handleError<TestListModel[]>('getData', []) ),
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
        console.error(error); // log to console instead
        console.log(`${operation} failed: ${error.message}`);
        return of(result as T);
    };
}
}
