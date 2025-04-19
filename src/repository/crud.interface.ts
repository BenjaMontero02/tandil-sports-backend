export interface CrudRepository<T> {
    create(item: T): Promise<T>;
    getById(id: string): Promise<T | null>;
    getAll(): Promise<T[]>;
    update(id: string, item: T): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}