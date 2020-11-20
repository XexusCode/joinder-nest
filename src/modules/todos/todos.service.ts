import { Injectable, NotFoundException } from '@nestjs/common';
import { TodoDto } from './dto/todo.dto';
import { TodosMapping } from './todosMapping/todosMapping';

import { EventService } from '../events/events.service';
import { TodoRepository } from './repository/todo.repository';
import { Todo } from './entity/todo.entity';
import { Connection } from 'typeorm';
import { typesMessages } from '../auth/types/types.messages';

@Injectable()
export class TodosService {
  private todoRepository: TodoRepository;

  constructor(
    private readonly connection: Connection,
    private eventService: EventService,
  ) {
    this.todoRepository = this.connection.getCustomRepository(TodoRepository);
  }

  async addTodo(
    todoDto: TodoDto,
    id: number,
    username: string,
  ): Promise<{ result: Todo; message: string }> {
    await this.eventService.validateEvent(id, username);

    const event = await this.eventService.getEventById(id);
    let todo = await TodosMapping.toEntity(todoDto, event);
    todo = await this.todoRepository.createTodo(todo);
    delete todo.event;

    return {
      result: todo,
      message: `${typesMessages.TODO} ${typesMessages.CREATED}`,
    };
  }

  async getAllTodos(
    id: number,
    username: string,
  ): Promise<{ result: Todo[]; message: string }> {
    await this.eventService.validateEvent(id, username);

    const event = await this.eventService.getEventById(id);

    return {
      result: event.todos,
      message: '',
    };
  }
  async getTodo(
    id: number,
    username: string,
    idTodo: number,
  ): Promise<{ result: Todo; message: string }> {
    await this.eventService.validateEvent(id, username);
    const todo = await this.todoRepository.getTodo(idTodo);

    if (!todo) throw new NotFoundException();

    return {
      result: todo,
      message: '',
    };
  }

  async deleteTodo(
    id: number,
    username: string,
    idTodo: number,
  ): Promise<{ message: string }> {
    await this.eventService.validateEvent(id, username);

    const result = await this.todoRepository.deleteTodo(idTodo);

    if (result.affected === 0) {
      throw new NotFoundException();
    }

    return {
      message: `${typesMessages.TODO} ${idTodo} ${typesMessages.DELETED}`,
    };
  }

  async updateTodo(
    id: number,
    username: string,
    idTodo: number,
    todoDto: TodoDto,
  ) {
    await this.eventService.validateEvent(id, username);

    const event = await this.eventService.getEventById(id);

    const { result: oldTodo } = await this.getTodo(id, username, idTodo);
    const newTodo = await TodosMapping.toEntity(todoDto, event);
    newTodo.id = oldTodo.id;

    if (!oldTodo) throw new NotFoundException();

    const result = await this.todoRepository.update({ id: idTodo }, newTodo);

    if (result.affected === 0) {
      throw new NotFoundException();
    }
    return {
      message: `${typesMessages.TODO} ${idTodo} ${typesMessages.UPDATED}`,
    };
  }
}
