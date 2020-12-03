import {
  controller,
  BaseHttpController,
  httpGet,
  requestParam,
} from "inversify-express-utils";
import { inject } from "inversify";
import IReadService from "../domain/services/IReadService";
import DepartmentResponse from "../domain/services/communication/DepartmentResponse";
import ServiceIdentifiers from "../constants/serviceIdentifiers";

@controller("/api/departments")
export default class DepartmentsController extends BaseHttpController {
  private readonly _departmentService: IReadService<DepartmentResponse>;

  public constructor(
    @inject(ServiceIdentifiers.DepartmentsService)
    departmentService: IReadService<DepartmentResponse>,
  ) {
    super();
    this._departmentService = departmentService;
  }

  @httpGet("/")
  private async getTitles() {
    const response = await this._departmentService.selectAll();

    if (response.success) return response.resource;

    return this.json(response.errorMessage, response.errorStatusCode);
  }

  @httpGet("/:id")
  private async getTitle(@requestParam("id") id: string) {
    const response = await this._departmentService.selectOne(id);

    if (response.success) return response.resource;

    return this.json(response.errorMessage, response.errorStatusCode);
  }
}
