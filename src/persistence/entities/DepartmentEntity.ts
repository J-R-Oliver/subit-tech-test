import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
// eslint-disable-next-line import/no-cycle
import Employee from "./EmployeeEntity";

@Entity({ name: "departments" })
export default class DepartmentEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ length: 100, name: "department_Title" })
  departmentTitle!: string;

  @OneToMany(() => Employee, employee => employee.department)
  employees!: Employee[];
}
