import {
  controller,
  BaseHttpController,
  httpGet,
  requestParam,
} from "inversify-express-utils";
import { inject } from "inversify";
import IReadService from "../domain/services/IReadService";
import TitleResponse from "../domain/services/communication/TitleResponse";
import ServiceIdentifiers from "../constants/serviceIdentifiers";

@controller("/api/Titles")
export default class TitleController extends BaseHttpController {
  private readonly _TitleService: IReadService<TitleResponse>;

  public constructor(
    @inject(ServiceIdentifiers.TitlesService)
    TitleService: IReadService<TitleResponse>,
  ) {
    super();
    this._TitleService = TitleService;
  }

  @httpGet("/")
  private async getTitles() {
    const response = await this._TitleService.selectAll();

    if (response.success) return response.resource;

    return this.json(response.errorMessage, response.errorStatusCode);
  }

  @httpGet("/:id")
  private async getTitle(@requestParam("id") id: string) {
    const response = await this._TitleService.selectOne(id);

    if (response.success) return response.resource;

    return this.json(response.errorMessage, response.errorStatusCode);
  }
}
