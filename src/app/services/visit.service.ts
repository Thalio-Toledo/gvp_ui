import { Injectable } from '@angular/core';
import { Visit } from '../models/visit';
import { Visitor } from '../models/visitor';
import { UrlBuilder } from '../utils/urlBuilder';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisitService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  create(visitor: Visit){
      const url = UrlBuilder.from(this.apiUrl)
        .addRoute('Visitor')
        .build();
  
      return this.http.post<Visit>(url, visitor)
    }
}
