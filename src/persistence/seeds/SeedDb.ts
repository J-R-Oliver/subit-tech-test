import { Seeder, Factory } from "typeorm-seeding";
import TitleEntity from "../entities/TitleEntity";
import DepartmentEntity from "../entities/DepartmentEntity";
import EmployeeEntity from "../entities/EmployeeEntity";

export default class SeedDb implements Seeder {
  // eslint-disable-next-line class-methods-use-this
  public async run(factory: Factory): Promise<void> {
    const [jobTitle, department] = await Promise.all([
      factory(TitleEntity)().create({
        jobTitle: "TV Presenter",
      }),
      factory(DepartmentEntity)().create({
        departmentTitle: "Broadcasting",
      }),
    ]);

    await factory(EmployeeEntity)().create({
      id: "5f126748-fc7f-45e4-9315-f42bc9e2f4f0",
      title: "Mr",
      firstName: "Alan",
      lastName: "Partridge",
      email: "a.partridge@sniggscorp.com",
      phone: "07712 713496",
      startDate: new Date("1965-10-14T00:00:00.000Z"),
      jobTitle,
      department,
    });

    const [jobTitles, departmentEntities] = await Promise.all([
      factory(TitleEntity)().createMany(10),
      factory(DepartmentEntity)().createMany(10),
    ]);

    let counter = 0;

    await factory(EmployeeEntity)()
      .map(async employeeEntity => {
        // eslint-disable-next-line no-param-reassign
        employeeEntity.jobTitle = jobTitles[counter % 10];
        // eslint-disable-next-line no-param-reassign
        employeeEntity.department = departmentEntities[counter % 10];
        counter += 1;
        return employeeEntity;
      })
      .createMany(99);
  }
}
