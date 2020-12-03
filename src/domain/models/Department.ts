import Employee from "./Employee";

export default class Department {
  id: string;
  departmentTitle: string;
  employees?: Employee[];

  public constructor(
    id: string,
    departmentTitle: string,
    employees?: Employee[],
  ) {
    this.id = id;
    this.departmentTitle = departmentTitle;
    this.employees = employees;
  }
}
