import { injectable, inject } from "inversify";
import ReadService from "../domain/services/IReadService";
import serviceIdentifiers from "../constants/serviceIdentifiers";
import TitleRepository from "../persistence/repositories/TitleRepository";
import TitleResponse from "../domain/services/communication/TitleResponse";
import EntityToModel from "../mapping/EntityToModel";

@injectable()
export default class TitlesService implements ReadService<TitleResponse> {
  private readonly _titleRepository: TitleRepository;

  public constructor(
    @inject(serviceIdentifiers.TitleRepository)
    titleRepository: TitleRepository,
  ) {
    this._titleRepository = titleRepository;
  }

  public async selectAll(): Promise<TitleResponse> {
    try {
      const jobTitleEntities = await this._titleRepository.selectAll();
      const jobTitles = EntityToModel.toTitle(jobTitleEntities);
      return new TitleResponse(true, jobTitles);
    } catch (error) {
      return new TitleResponse(false, undefined, "Internal Server Error", 500);
    }
  }

  public async selectOne(id: string): Promise<TitleResponse> {
    try {
      const jobTitleEntity = await this._titleRepository.selectOne(id);
      const jobTitle = EntityToModel.toTitle(jobTitleEntity);
      return new TitleResponse(true, jobTitle);
    } catch (error) {
      if (error.code === "22P02") {
        return new TitleResponse(false, undefined, "Invalid Request ID", 400);
      }

      if (error.code === 404) {
        return new TitleResponse(false, undefined, error.message, error.code);
      }

      return new TitleResponse(false, undefined, "Internal Server Error", 500);
    }
  }
}
