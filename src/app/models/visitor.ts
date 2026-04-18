import { Visit } from "./visit"

export class Visitor{
    visitorId = ''
    name = ''
    birthDate: Date = null
    emailJwpub = ''
    emailPersonal  = ''
    phoneNumber = ''
    visits?: Visit[] = []
}