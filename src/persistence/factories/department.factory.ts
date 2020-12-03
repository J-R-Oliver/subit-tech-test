import { define } from "typeorm-seeding";
import Faker from "faker";
import DepartmentEntity from "../entities/DepartmentEntity";

define(DepartmentEntity, (faker: typeof Faker) => {
  const department = new DepartmentEntity();

  department.departmentTitle = faker.name.jobType();

  return department;
});
