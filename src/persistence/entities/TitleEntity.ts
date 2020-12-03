import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
// eslint-disable-next-line import/no-cycle
import EmployeeEntity from "./EmployeeEntity";

@Entity({ name: "titles" })
export default class TitleEntity {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({ length: 100, name: "job_Title" })
  jobTitle!: string;

  @OneToMany(() => EmployeeEntity, employee => employee.jobTitle)
  employees!: EmployeeEntity[];
}
