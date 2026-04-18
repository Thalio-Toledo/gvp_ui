import { Patient } from "./patient"
import { Visitor } from "./visitor"

export class Visit{
    visitId = ''
    dateVisit: Date = null
    durationInHour = 0
    patientId = ''
    patient :Patient = null
    visitors? :Visitor[] = [] 
}