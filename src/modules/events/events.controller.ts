import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { EventService } from './events.service';
import { EventDto } from './dto/event.dto';
import { Event } from './entity/event.entity';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { User } from '../auth/entity/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { CommentDto } from '../comments/dto/comment.dto';
import { Comment } from '../comments/entity/comments.entity';
import { CommentsService } from '../comments/comments.service';
import { UserEvent } from '../UserEvent/userEvent.entity';
import { UserEventDto } from '../UserEvent/dto/userEvent.dto';
import { UserEventService } from '../UserEvent/userEvents.service';
import { TodoDto } from '../todos/dto/todo.dto';
import { TodosService } from '../todos/todos.service';
import { Todo } from '../todos/entity/todo.entity';
import { DeleteResult } from 'typeorm';

@Controller('events')
@UseGuards(AuthGuard('jwt'))
export class EventsController {
  constructor(
    private eventsService: EventService,
    private commentService: CommentsService,
    private userEventService: UserEventService,
    private todoService: TodosService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createEvent(
    @Body() createEventDto: EventDto,
    @GetUser() user: User,
  ): Promise<Event> {
    const event = await this.eventsService.createEvent(createEventDto, user);
    this.userEventService.joinUser(event.id, user, true);
    return event;
  }

  @Get()
  getAllEvents(@GetUser() { username }): Promise<Array<Event>> {
    return this.eventsService.getAllEvents(username);
  }

  @Get('/:id')
  getEventById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() { username },
  ): Promise<Event> {
    return this.eventsService.getEvent(id, username);
  }

  @Delete('/:id')
  async deleteEvent(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() { username },
  ): Promise<string> {
    return this.eventsService.deleteEvent(id, username);
  }

  @Patch('/:id')
  async updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() { username },
    @Body() createEventDto: EventDto,
  ): Promise<Event> {
    return this.eventsService.updateEvent(id, username, createEventDto);
  }

  @Post(':id/user')
  @UsePipes(ValidationPipe)
  async joinUser(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.userEventService.joinUser(id, user, false);
  }

  @Get(':id/user/')
  async getAllUser(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() { username },
  ): Promise<UserEvent[]> {
    return this.userEventService.getAllUser(id, username);
  }

  @Get(':id/user/:targetUsername')
  async getUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('targetUsername') targetUsername: string,
    @GetUser() { username },
  ): Promise<UserEvent> {
    return this.userEventService.getUser(id, targetUsername, username);
  }

  @Delete(':id/user/:targetUsername')
  @UsePipes(ValidationPipe)
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('targetUsername') targetUsername: string,

    @GetUser() user: User,
  ): Promise<void> {
    return this.userEventService.deleteUser(id, targetUsername, user);
  }

  @Patch(':id/user/:targetUsername')
  @UsePipes(ValidationPipe)
  async UpdateUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('targetUsername') targetUsername: string,
    @Body() userEventDto: UserEventDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.userEventService.updateUser(
      id,
      targetUsername,
      user,
      userEventDto,
    );
  }

  @Post(':id/comment')
  @UsePipes(ValidationPipe)
  async addComment(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() { username },
    @Body() commentDto: CommentDto,
  ): Promise<Comment> {
    return this.commentService.addComment(commentDto, id, username);
  }

  @Get(':id/comment')
  @UsePipes(ValidationPipe)
  async getAllComments(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() { username },
  ): Promise<Comment[]> {
    return this.commentService.getAllComments(id, username);
  }

  @Get('/:id/comment/:idComment/')
  async getComment(
    @Param('id', ParseIntPipe) id: number,
    @Param('idComment', ParseIntPipe) idComment: number,
    @GetUser() { username },
  ): Promise<Comment> {
    return this.commentService.getComment(id, username, idComment);
  }

  @Delete('/:id/comment/:idComment/')
  async deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @Param('idComment', ParseIntPipe) idComment: number,
    @GetUser() { username },
  ): Promise<void> {
    return this.commentService.deleteComment(id, username, idComment);
  }

  @Patch('/:id/comment/:idComment/')
  async updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Param('idComment', ParseIntPipe) idComment: number,
    @GetUser() { username },
    @Body() createCommentDto: CommentDto,
  ): Promise<CommentDto> {
    return this.commentService.updateComment(
      id,
      username,
      idComment,
      createCommentDto,
    );
  }
  @Post(':id/todo')
  @UsePipes(ValidationPipe)
  async addTodo(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() { username },
    @Body() todoDto: TodoDto,
  ): Promise<Todo> {
    return this.todoService.addTodo(todoDto, id, username);
  }

  @Get(':id/todo')
  @UsePipes(ValidationPipe)
  async getAllTodos(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() { username },
  ): Promise<Todo[]> {
    return this.todoService.getAllTodos(id, username);
  }

  @Get('/:id/todo/:idTodo/')
  async getTodo(
    @Param('id', ParseIntPipe) id: number,
    @Param('idTodo', ParseIntPipe) idTodo: number,
    @GetUser() { username },
  ): Promise<Todo> {
    return this.todoService.getTodo(id, username, idTodo);
  }

  @Delete('/:id/todo/:idTodo/')
  async deleteTodo(
    @Param('id', ParseIntPipe) id: number,
    @Param('idTodo', ParseIntPipe) idTodo: number,
    @GetUser() { username },
  ): Promise<DeleteResult> {
    return this.todoService.deleteTodo(id, username, idTodo);
  }

  @Patch('/:id/todo/:idTodo/')
  async updateTodo(
    @Param('id', ParseIntPipe) id: number,
    @Param('idTodo', ParseIntPipe) idTodo: number,
    @GetUser() { username },
    @Body() todoDto: TodoDto,
  ): Promise<Todo> {
    return this.todoService.updateTodo(id, username, idTodo, todoDto);
  }
}
