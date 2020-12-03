export default interface IRead<T> {
  selectAll(): Promise<T[]>;
  selectOne(id: string): Promise<T>;
}
