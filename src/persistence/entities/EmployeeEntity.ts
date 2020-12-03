/* eslint-disable import/no-cycle */
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from "typeorm";
import TitleEntity from "./TitleEntity";
import DepartmentEntity from "./DepartmentEntity";

@Entity({ name: "employees", orderBy: { firstName: "ASC" } })
export default class EmployeeEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @Column({ length: 10 })
  title!: string;

  @Column({ length: 20, name: "first_name" })
  firstName!: string;

  @Column({ length: 20, name: "last_name" })
  lastName!: string;

  @Column({ length: 50 })
  email!: string;

  @Column({ length: 12 })
  phone!: string;

  @Column({ name: "start_date" })
  startDate!: Date;

  @ManyToOne(() => TitleEntity, Title => Title.jobTitle, {
    cascade: true,
  })
  jobTitle!: TitleEntity;

  @ManyToOne(() => DepartmentEntity, department => department.departmentTitle, {
    cascade: true,
  })
  department!: DepartmentEntity;
}
