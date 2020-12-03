import EmployeeEntity from "../persistence/entities/EmployeeEntity";
import Employee from "../domain/models/Employee";
import DepartmentEntity from "../persistence/entities/DepartmentEntity";
import Department from "../domain/models/Department";
import TitleEntity from "../persistence/entities/TitleEntity";
import Title from "../domain/models/Title";

export default class EntityToModel {
  public static toEmployee(employeeEntity: EmployeeEntity): Employee;
  public static toEmployee(employeeEntity: EmployeeEntity[]): Employee[];
  public static toEmployee(
    employeeEntity: EmployeeEntity | EmployeeEntity[],
  ): Employee | Employee[] {
    const changeEmployee = (employee: EmployeeEntity) => {
      return new Employee(
        employee.id,
        employee.createdAt,
        employee.updatedAt,
        employee.title,
        employee.firstName,
        employee.lastName,
        employee.email,
        employee.phone,
        employee.startDate,
        employee.jobTitle?.jobTitle,
        employee.department?.departmentTitle,
      );
    };

    if (Array.isArray(employeeEntity)) {
      return employeeEntity.map(changeEmployee);
    }

    return changeEmployee(employeeEntity);
  }

  public static toDepartment(department: DepartmentEntity): Department;
  public static toDepartment(
    departmentEntity: DepartmentEntity[],
  ): Department[];
  public static toDepartment(
    departmentEntity: DepartmentEntity | DepartmentEntity[],
  ): Department | Department[] {
    const changeDepartment = (department: DepartmentEntity) => {
      let employees;

      if (department.employees) {
        employees = EntityToModel.toEmployee(department.employees);
      }

      return new Department(
        department.id,
        department.departmentTitle,
        employees,
      );
    };

    if (Array.isArray(departmentEntity)) {
      return departmentEntity.map(changeDepartment);
    }

    return changeDepartment(departmentEntity);
  }

  public static toTitle(TitleEntityEntity: TitleEntity): Title;
  public static toTitle(TitleEntityEntity: TitleEntity[]): Title[];
  public static toTitle(
    TitleEntityEntity: TitleEntity | TitleEntity[],
  ): Title | Title[] {
    const changeTitleEntity = (title: TitleEntity) => {
      let employees;

      if (title.employees) {
        employees = EntityToModel.toEmployee(title.employees);
      }

      return new Title(title.id, title.jobTitle, employees);
    };

    if (Array.isArray(TitleEntityEntity)) {
      return TitleEntityEntity.map(changeTitleEntity);
    }

    return changeTitleEntity(TitleEntityEntity);
  }
}
