import { injectable, inject } from "inversify";
import IReadService from "../domain/services/IReadService";
import serviceIdentifiers from "../constants/serviceIdentifiers";
import DepartmentRepository from "../persistence/repositories/DepartmentRepository";
import DepartmentResponse from "../domain/services/communication/DepartmentResponse";
import EntityToModel from "../mapping/EntityToModel";

@injectable()
export default class DepartmentsService
  implements IReadService<DepartmentResponse> {
  private readonly _departmentRepository: DepartmentRepository;

  public constructor(
    @inject(serviceIdentifiers.DepartmentRepository)
    departmentRepository: DepartmentRepository,
  ) {
    this._departmentRepository = departmentRepository;
  }

  public async selectAll(): Promise<DepartmentResponse> {
    try {
      const departmentEntities = await this._departmentRepository.selectAll();
      const departments = EntityToModel.toDepartment(departmentEntities);
      return new DepartmentResponse(true, departments);
    } catch (error) {
      return new DepartmentResponse(
        false,
        undefined,
        "Internal Server Error",
        500,
      );
    }
  }

  public async selectOne(id: string): Promise<DepartmentResponse> {
    try {
      const departmentEntity = await this._departmentRepository.selectOne(id);
      const departments = EntityToModel.toDepartment(departmentEntity);
      return new DepartmentResponse(true, departments);
    } catch (error) {
      if (error.code === "22P02") {
        return new DepartmentResponse(
          false,
          undefined,
          "Invalid Request ID",
          400,
        );
      }

      if (error.code === 404) {
        return new DepartmentResponse(
          false,
          undefined,
          error.message,
          error.code,
        );
      }

      return new DepartmentResponse(
        false,
        undefined,
        "Internal Server Error",
        500,
      );
    }
  }
}
