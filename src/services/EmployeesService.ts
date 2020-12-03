import { injectable, inject } from "inversify";
import IReadService from "../domain/services/IReadService";
import EmployeeResponse from "../domain/services/communication/EmployeeResponse";
import IWriteService from "../domain/services/IWriteService";
import Employee from "../domain/models/Employee";
import EmployeeRepository from "../persistence/repositories/EmployeeRepository";
import serviceIdentifiers from "../constants/serviceIdentifiers";
import EmployeeEntity from "../persistence/entities/EmployeeEntity";
import EntityToModel from "../mapping/EntityToModel";
import ModelToEntity from "../mapping/ModelToEntity";

@injectable()
export default class EmployeesService
  implements
    IReadService<EmployeeResponse>,
    IWriteService<Employee, EmployeeResponse> {
  private readonly _employeeRepository: EmployeeRepository;

  public constructor(
    @inject(serviceIdentifiers.EmployeeRepository)
    employeeRepository: EmployeeRepository,
  ) {
    this._employeeRepository = employeeRepository;
  }

  public selectAll(): Promise<EmployeeResponse>;
  public selectAll(sort: string, order: string): Promise<EmployeeResponse>;
  public async selectAll(
    sort?: string,
    order?: string,
  ): Promise<EmployeeResponse> {
    try {
      let employeeEntities: EmployeeEntity[];

      if (sort && order) {
        employeeEntities = await this._employeeRepository.selectAll(
          sort,
          order,
        );
      } else {
        employeeEntities = await this._employeeRepository.selectAll();
      }

      const employees = EntityToModel.toEmployee(employeeEntities);
      return new EmployeeResponse(true, employees);
    } catch (error) {
      return new EmployeeResponse(
        false,
        undefined,
        "Internal Server Error",
        500,
      );
    }
  }

  public async selectOne(id: string): Promise<EmployeeResponse> {
    try {
      const employeeEntity = await this._employeeRepository.selectOne(id);
      const employee = EntityToModel.toEmployee(employeeEntity);
      return new EmployeeResponse(true, employee);
    } catch (error) {
      if (error.code === "22P02") {
        return new EmployeeResponse(
          false,
          undefined,
          "Invalid Request ID",
          400,
        );
      }

      if (error.code === 404) {
        return new EmployeeResponse(
          false,
          undefined,
          error.message,
          error.code,
        );
      }

      return new EmployeeResponse(
        false,
        undefined,
        "Internal Server Error",
        500,
      );
    }
  }

  public async insert(newEmployee: Employee): Promise<EmployeeResponse> {
    try {
      const newEmployeeEntity = ModelToEntity.toEmployeeEntity(newEmployee);
      const employeeEntity = await this._employeeRepository.insert(
        newEmployeeEntity,
      );

      const employee = EntityToModel.toEmployee(employeeEntity);
      return new EmployeeResponse(true, employee);
    } catch (error) {
      if (error.code === "23502") {
        return new EmployeeResponse(
          false,
          undefined,
          "Invalid Request Body",
          400,
        );
      }

      return new EmployeeResponse(
        false,
        undefined,
        "Internal Server Error",
        500,
      );
    }
  }

  public async update(
    id: string,
    updateEmployee: Employee,
  ): Promise<EmployeeResponse> {
    try {
      const newEmployeeEntity = ModelToEntity.toEmployeeEntity(updateEmployee);
      const employeeEntity = await this._employeeRepository.update(
        id,
        newEmployeeEntity,
      );

      const employee = EntityToModel.toEmployee(employeeEntity);
      return new EmployeeResponse(true, employee);
    } catch (error) {
      if (error.code === 404) {
        return new EmployeeResponse(
          false,
          undefined,
          error.message,
          error.code,
        );
      }

      return new EmployeeResponse(
        false,
        undefined,
        "Internal Server Error",
        500,
      );
    }
  }

  public async delete(id: string): Promise<EmployeeResponse> {
    try {
      const result = await this._employeeRepository.delete(id);

      if (result) return new EmployeeResponse(result);
      return new EmployeeResponse(result, undefined, "Employee Not Found", 404);
    } catch (error) {
      if (error.code === "22P02") {
        return new EmployeeResponse(
          false,
          undefined,
          "Invalid Request ID",
          400,
        );
      }

      return new EmployeeResponse(
        false,
        undefined,
        "Internal Server Error",
        500,
      );
    }
  }
}
