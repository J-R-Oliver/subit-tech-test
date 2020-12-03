import Employee from "../domain/models/Employee";
import EmployeeEntity from "../persistence/entities/EmployeeEntity";
import TitleEntity from "../persistence/entities/TitleEntity";
import DepartmentEntity from "../persistence/entities/DepartmentEntity";

export default class ModelToEntity {
  public static toEmployeeEntity(employee: Employee): EmployeeEntity {
    const employeeTitle = new TitleEntity();
    if (employee.jobTitle) employeeTitle.jobTitle = employee.jobTitle;

    const employeeDepartment = new DepartmentEntity();
    if (employee.department)
      employeeDepartment.departmentTitle = employee.department;

    const newEmployee = new EmployeeEntity();
    newEmployee.id = employee.id;
    newEmployee.title = employee.title;
    newEmployee.firstName = employee.firstName;
    newEmployee.lastName = employee.lastName;
    newEmployee.email = employee.email;
    newEmployee.phone = employee.phone;
    newEmployee.startDate = employee.startDate;
    newEmployee.jobTitle = employeeTitle;
    newEmployee.department = employeeDepartment;

    return newEmployee;
  }
}
