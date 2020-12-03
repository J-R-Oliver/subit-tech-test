import { injectable, inject } from "inversify";
import { Repository } from "typeorm";
import BaseRepository from "./BaseRepository";
import EmployeeEntity from "../entities/EmployeeEntity";
import serviceIdentifiers from "../../constants/serviceIdentifiers";

@injectable()
export default class EmployeeRepository extends BaseRepository<EmployeeEntity> {
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    @inject(serviceIdentifiers.EmployeeTypeORM)
    repository: Repository<EmployeeEntity>,
  ) {
    super(repository);
  }

  public selectAll(): Promise<EmployeeEntity[]>;
  public selectAll(sort: string, order: string): Promise<EmployeeEntity[]>;
  public selectAll(sort?: string, order?: string): Promise<EmployeeEntity[]> {
    if (sort && order) {
      return this.repository.find({
        relations: ["jobTitle", "department"],
        order: {
          [sort]: order,
        },
      });
    }

    return this.repository.find({
      relations: ["jobTitle", "department"],
    });
  }

  async selectOne(id: string): Promise<EmployeeEntity> {
    const employee = await this.repository.find({
      where: { id },
      relations: ["jobTitle", "department"],
    });

    if (employee.length === 0) {
      const error = { code: 404, message: "Employee Not Found" };
      throw error;
    }

    return employee[0];
  }

  async update(id: string, item: EmployeeEntity): Promise<EmployeeEntity> {
    (Object.keys(item) as Array<keyof EmployeeEntity>).forEach(key => {
      // eslint-disable-next-line no-param-reassign, security/detect-object-injection
      if (!item[key]) delete item[key];
    });

    const employee = await this.selectOne(id);
    const updateEmployee = {
      ...employee,
      ...item,
      updatedAt: new Date(new Date().toISOString()),
    };

    await this.repository.update(id, updateEmployee);
    return updateEmployee;
  }
}
