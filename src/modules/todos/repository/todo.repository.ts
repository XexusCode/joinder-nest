import { EntityRepository, Repository } from 'typeorm';
import { Todo } from '../entity/todo.entity';

@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {
  createTodo(todo: Todo) {
    return todo.save();
  }

  getTodo(idTodo: number): Promise<Todo> {
    console.log(this);
    return this.findOne({ id: idTodo });
  }

  async deleteTodo(idTodo: number) {
    return this.delete({ id: idTodo });
  }
}
