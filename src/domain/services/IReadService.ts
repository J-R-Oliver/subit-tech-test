export default interface IReadService<T> {
  selectAll(): Promise<T>;
  selectAll(sort: string, order: string): Promise<T>;
  selectOne(id: string): Promise<T>;
}
