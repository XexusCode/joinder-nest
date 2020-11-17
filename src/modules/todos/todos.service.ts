import { Injectable } from '@nestjs/common';
import { TodoDto } from './dto/todo.dto';
import { TodosMapping } from './todosMapping/todosMapping';

import { EventService } from '../events/events.service';
import { TodoRepository } from './repository/todo.repository';
import { Todo } from './entity/todo.entity';
import { Connection, DeleteResult } from 'typeorm';

@Injectable()
export class TodosService {
  private todoRepository: TodoRepository;

  constructor(
    private readonly connection: Connection,
    private eventService: EventService,
  ) {
    this.todoRepository = this.connection.getCustomRepository(TodoRepository);
  }

  async addTodo(todoDto: TodoDto, id: number, username: string): Promise<Todo> {
    await this.eventService.validateEvent(id, username);

    const event = await this.eventService.getEventByIdWithUser(id, username);
    const todo = await TodosMapping.toEntity(todoDto, event);
    return this.todoRepository.createTodo(todo);
  }

  async getAllTodos(id: number, username: string): Promise<Todo[]> {
    await this.eventService.validateEvent(id, username);

    const event = await this.eventService.getEventByIdWithUser(id, username);

    return event.todos;
  }
  async getTodo(id: number, username: string, idTodo: number): Promise<Todo> {
    await this.eventService.validateEvent(id, username);
    return this.todoRepository.getTodo(idTodo);
  }

  async deleteTodo(
    id: number,
    username: string,
    idTodo: number,
  ): Promise<DeleteResult> {
    await this.eventService.validateEvent(id, username);

    return await this.todoRepository.deleteTodo(idTodo);
  }

  async updateTodo(
    id: number,
    username: string,
    idTodo: number,
    todoDto: TodoDto,
  ) {
    await this.eventService.validateEvent(id, username);

    const event = await this.eventService.getEventByIdWithUser(id, username);

    const oldTodo = await this.todoRepository.getTodo(idTodo);
    const newTodo = await TodosMapping.toEntity(todoDto, event);
    newTodo.id = oldTodo.id;

    await this.todoRepository.update({ id: idTodo }, newTodo);
    return newTodo;
  }
}
