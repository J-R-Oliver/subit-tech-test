export default class Employee {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  startDate: Date;
  jobTitle?: string;
  department?: string;

  public constructor(
    id: string,
    createdAt: Date,
    updatedAt: Date,
    title: string,
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    startDate: Date,
    jobTitle?: string,
    department?: string,
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.title = title;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone;
    this.startDate = startDate;
    this.jobTitle = jobTitle;
    this.department = department;
  }
}
