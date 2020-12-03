import { injectable, inject } from "inversify";
import { Repository } from "typeorm";
import BaseRepository from "./BaseRepository";
import TitleEntity from "../entities/TitleEntity";
import serviceIdentifiers from "../../constants/serviceIdentifiers";

@injectable()
export default class TitleRepository extends BaseRepository<TitleEntity> {
  // eslint-disable-next-line no-useless-constructor
  public constructor(
    @inject(serviceIdentifiers.TitleTypeORM)
    repository: Repository<TitleEntity>,
  ) {
    super(repository);
  }

  selectAll(): Promise<TitleEntity[]> {
    return this.repository.find({
      order: {
        jobTitle: "ASC",
      },
    });
  }

  public async selectOne(id: string): Promise<TitleEntity> {
    const title = await this.repository.find({
      where: { id },
      relations: ["employees"],
    });

    if (title.length === 0) {
      const error = { code: 404, message: "Title Not Found" };
      throw error;
    }

    return title[0];
  }
}
