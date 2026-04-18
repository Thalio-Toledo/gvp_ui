import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Patient } from '../models/patient';
import { UrlBuilder } from '../utils/urlBuilder';
import { Visitor } from '../models/visitor';

@Injectable({
  providedIn: 'root'
})
export class VisitorService {

  private apiUrl = environment.baseUrl;
  
  constructor(private http: HttpClient) { }
    
  list() {
    const url = UrlBuilder.from(this.apiUrl)
      .addRoute('Visitor')
      .build();
    return this.http.get<Visitor[]>(url);
  }
  
  create(visitor: Visitor){
    const url = UrlBuilder.from(this.apiUrl)
      .addRoute('Visitor')
      .build();

    return this.http.post<Visitor>(url, visitor)
  }
    
  update(visitor: Visitor){
    const url = UrlBuilder.from(this.apiUrl)
      .addRoute('Visitor')
      .build();

    return this.http.put<Visitor>(url, visitor)
  }
  
  delete(visitor: Visitor){
    const url = UrlBuilder.from(this.apiUrl)
      .addRoute('Visitor')
      .addRoute(visitor.visitorId)
      .build();

    return this.http.delete<Visitor>(url)
  }   
}
