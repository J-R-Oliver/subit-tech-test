import Employee from "./Employee";

export default class Title {
  id: string;
  jobTitle: string;
  employees?: Employee[];

  public constructor(id: string, jobTitle: string, employees?: Employee[]) {
    this.id = id;
    this.jobTitle = jobTitle;
    this.employees = employees;
  }
}
