import { define } from "typeorm-seeding";
import Faker from "faker";
import Employee from "../entities/EmployeeEntity";

define(Employee, (faker: typeof Faker) => {
  const employee = new Employee();

  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  employee.title = faker.name.prefix();
  employee.firstName = firstName;
  employee.lastName = lastName;
  employee.email = `${firstName.slice(0, 1)}.${lastName}@sniggscorp.com`;
  employee.phone = faker.phone.phoneNumber("07### ######");
  employee.startDate = faker.date.past();

  return employee;
});
