import {TodoRepository} from '../repository/todoRepository.mjs'

export class TodoService {
    constructor() {
        this.repo = new TodoRepository();
    }

    async getAll(userId) {
        return await this.repo.getAll(userId);
    }
    
    async get(userId, todoId) {
        return await this.repo.get(userId, todoId);
    }
    
    async insert(todoEntity) {
        return await this.repo.insert(todoEntity);
    }
    
    async update(userId, todoId, todoEntity) {
        return this.repo.update(userId, todoId, todoEntity)
    }
    
    async remove(userId, todoId) {
        return await this.repo.remove(userId, todoId);
    }
}
