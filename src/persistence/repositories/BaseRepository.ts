import { injectable } from "inversify";
import { Repository } from "typeorm";
import IRead from "../../domain/repositories/IRead";
import IWrite from "../../domain/repositories/IWrite";

@injectable()
export default abstract class BaseRepository<T> implements IRead<T>, IWrite<T> {
  protected readonly repository: Repository<T>;

  public constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  selectAll(): Promise<T[]> {
    return this.repository.find();
  }

  async selectOne(id: string): Promise<T> {
    const entities = await this.repository.find({
      where: { id },
    });
    return entities[0];
  }

  insert(item: T): Promise<T> {
    return this.repository.save(item);
  }

  async update(id: string, item: T): Promise<T> {
    await this.repository.update(id, item);
    return this.selectOne(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return !!result.affected;
  }
}
