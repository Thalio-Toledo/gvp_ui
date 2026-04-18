import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Hospital } from '../models/hospital';
import { UrlBuilder } from '../utils/urlBuilder';
import { Patient } from '../models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = environment.baseUrl;
  
  constructor(private http: HttpClient) { }
  
  list() {
    const url = UrlBuilder.from(this.apiUrl)
      .addRoute('Patient')
      .build();
    return this.http.get<Patient[]>(url);
  }
  
  create(patient: Patient){
    const url = UrlBuilder.from(this.apiUrl)
      .addRoute('Patient')
      .build();

    return this.http.post<Patient>(url, patient)
  }
  
  update(patient: Patient){
    const url = UrlBuilder.from(this.apiUrl)
      .addRoute('Patient')
      .build();

    return this.http.put<Patient>(url, patient)
  }
  
  delete(patient: Patient){
    const url = UrlBuilder.from(this.apiUrl)
      .addRoute('Patient')
      .addRoute(patient.patientId)
      .build();

    return this.http.delete<Patient>(url)
  }
}
