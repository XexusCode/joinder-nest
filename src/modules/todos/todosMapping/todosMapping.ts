import { Event } from '../../events/entity/event.entity';
import { TodoDto } from '../dto/todo.dto';
import { Todo } from '../entity/todo.entity';

export class TodosMapping {
  static async toEntity(todoDto: TodoDto, event: Event): Promise<Todo> {
    const todo = new Todo();

    todo.text = todoDto.text;
    todo.event = event;

    return todo;
  }
}
