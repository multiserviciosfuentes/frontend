import { ERole } from '@/shared/enums'

export default class User {
  constructor(
    fullName = null,
    phone = null,
    email = null,
    username = null,
    password = null,
    roles = [ERole.user],
    checkPass = null
  ) {
    this.fullName = fullName
    this.phone = phone
    this.email = email
    this.username = username
    this.password = password
    this.roles = roles
    this.checkPass = checkPass
  }
}
