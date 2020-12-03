import {
  controller,
  BaseHttpController,
  httpGet,
  queryParam,
  requestParam,
  httpPost,
  requestBody,
  httpPatch,
  httpDelete,
} from "inversify-express-utils";
import { inject } from "inversify";
import IReadService from "../domain/services/IReadService";
import EmployeeResponse from "../domain/services/communication/EmployeeResponse";
import IWriteService from "../domain/services/IWriteService";
import ServiceIdentifiers from "../constants/serviceIdentifiers";
import Employee from "../domain/models/Employee";

@controller("/api/employees")
export default class EmployeesController extends BaseHttpController {
  private readonly _employeeService: IReadService<EmployeeResponse> &
    IWriteService<Employee, EmployeeResponse>;

  public constructor(
    @inject(ServiceIdentifiers.EmployeesService)
    _employeeService: IReadService<EmployeeResponse> &
      IWriteService<Employee, EmployeeResponse>,
  ) {
    super();
    this._employeeService = _employeeService;
  }

  @httpGet("/")
  private async getEmployees(
    @queryParam("sort") sort: string,
    @queryParam("order") order: string,
  ) {
    const response = await this._employeeService.selectAll(sort, order);

    if (response.success) return response.resource;

    return this.json(response.errorMessage, response.errorStatusCode);
  }

  @httpGet("/:id")
  private async getEmployee(@requestParam("id") id: string) {
    const response = await this._employeeService.selectOne(id);

    if (response.success) return response.resource;

    return this.json(response.errorMessage, response.errorStatusCode);
  }

  @httpPost("/")
  private async postEmployee(@requestBody() newEmployee: Employee) {
    const response = await this._employeeService.insert(newEmployee);

    if (response.success) return this.json(response.resource, 201);

    return this.json(response.errorMessage, response.errorStatusCode);
  }

  @httpPatch("/:id")
  private async patchEmployee(
    @requestParam("id") id: string,
    @requestBody() updatedEmployee: Employee,
  ) {
    const response = await this._employeeService.update(id, updatedEmployee);

    if (response.success) return this.json(response.resource, 201);

    return this.json(response.errorMessage, response.errorStatusCode);
  }

  @httpDelete("/:id")
  private async deleteEmployee(@requestParam("id") id: string) {
    const response = await this._employeeService.delete(id);

    if (response.success) return this.statusCode(204);

    return this.json(response.errorMessage, response.errorStatusCode);
  }
}
