import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UrlBuilder } from '../utils/urlBuilder';
import { Hospital } from '../models/hospital';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  list() {
    const url = UrlBuilder.from(this.apiUrl)
      .addRoute('Hospital')
      .build();
    return this.http.get<Hospital[]>(url);
  }

  create(hospital: Hospital){
    const url = UrlBuilder.from(this.apiUrl)
      .addRoute('Hospital')
      .build();

    return this.http.post<Hospital>(url, hospital)
  }

  update(hospital: Hospital){
    const url = UrlBuilder.from(this.apiUrl)
      .addRoute('Hospital')
      .build();

    return this.http.put<Hospital>(url, hospital)
  }

  delete(hospital: Hospital){
    const url = UrlBuilder.from(this.apiUrl)
      .addRoute('Hospital')
      .addRoute(hospital.hospitalId)
      .build();

    return this.http.delete<Hospital>(url)
  }
}
