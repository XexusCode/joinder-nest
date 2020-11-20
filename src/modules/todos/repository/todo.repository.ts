import { EntityRepository, Repository } from 'typeorm';
import { Todo } from '../entity/todo.entity';

@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {
  async createTodo(todo: Todo) {
    return await todo.save();
  }

  getTodo(idTodo: number): Promise<Todo> {
    return this.findOne({ id: idTodo });
  }

  async deleteTodo(idTodo: number) {
    return this.delete({ id: idTodo });
  }
}
