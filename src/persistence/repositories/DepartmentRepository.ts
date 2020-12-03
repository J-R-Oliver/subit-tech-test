import { injectable, inject } from "inversify";
import { Repository } from "typeorm";
import BaseRepository from "./BaseRepository";
import DepartmentEntity from "../entities/DepartmentEntity";
import serviceIdentifiers from "../../constants/serviceIdentifiers";

@injectable()
export default class DepartmentRepository extends BaseRepository<
  DepartmentEntity
> {
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    @inject(serviceIdentifiers.DepartmentTypeORM)
    repository: Repository<DepartmentEntity>,
  ) {
    super(repository);
  }

  selectAll(): Promise<DepartmentEntity[]> {
    return this.repository.find({
      order: {
        departmentTitle: "ASC",
      },
    });
  }

  public async selectOne(id: string): Promise<DepartmentEntity> {
    const department = await this.repository.find({
      where: { id },
      relations: ["employees"],
    });

    if (department.length === 0) {
      const error = { code: 404, message: "Department Not Found" };
      throw error;
    }

    return department[0];
  }
}
