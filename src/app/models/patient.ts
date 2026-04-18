import { Hospital } from "./hospital"
import { Visit } from "./visit"

export class Patient{
    patientId = ''
    name = ''
    age = 0
    entranceAt: Date = null
    exitAt: Date = null
    hospitalId = ''
    hospital: Hospital
    visits: Visit[] = [] 
}