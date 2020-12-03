export default interface IWriteService<T, U> {
  insert(newItem: T): Promise<U>;
  update(id: string, updatedItem: T): Promise<U>;
  delete(id: string): Promise<U>;
}
