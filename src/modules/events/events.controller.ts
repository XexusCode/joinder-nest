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
  UseInterceptors,
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
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TransformInterceptor } from '../../interceptor/transform.interceptor';
@UseInterceptors(TransformInterceptor)
@Controller('events')
@UseGuards(AuthGuard('jwt'))
export class EventsController {
  constructor(
    private eventsService: EventService,
    private commentService: CommentsService,
    private userEventService: UserEventService,
    private todoService: TodosService,
  ) {}

  @ApiTags('Events')
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
    type: User,
  })
  @Post()
  @UsePipes(ValidationPipe)
  async createEvent(
    @Body() createEventDto: EventDto,
    @GetUser() user: User,
  ): Promise<{ result: Event; message: string }> {
    const { event, message } = await this.eventsService.createEvent(
      createEventDto,
    );
    const { result } = await this.userEventService.joinUser(
      event.id,
      user,
      true,
    );
    event.userEvents = [result.userEvents[0]];
    return { message, result: event };
  }
  @ApiTags('Events')
  @Get()
  async getAllEvents(
    @GetUser() { username },
  ): Promise<{ result: Array<Event>; message: string }> {
    return await this.eventsService.getAllEvents(username);
  }

  @ApiTags('Events')
  @Get('/:id')
  getEventById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() { username },
  ): Promise<{ result: Event; message: string }> {
    return this.eventsService.getEvent(id, username);
  }

  @ApiTags('Events')
  @Delete('/:id')
  async deleteEvent(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() { username },
  ): Promise<{ message: string }> {
    return this.eventsService.deleteEvent(id, username);
  }

  @ApiTags('Events')
  @Patch('/:id')
  @UsePipes(ValidationPipe)
  async updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() { username },
    @Body() createEventDto: EventDto,
  ): Promise<{ message: string }> {
    return this.eventsService.updateEvent(id, username, createEventDto);
  }

  @ApiTags('UserEvent')
  @Post(':id/userEvent')
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: UserEvent,
  })
  @UsePipes(ValidationPipe)
  async joinUser(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<{ message: string }> {
    return this.userEventService.joinUser(id, user, false);
  }

  @ApiTags('UserEvent')
  @Get(':id/userEvent/')
  async getAllUser(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() { username },
  ): Promise<{ result: UserEvent[]; message: string }> {
    return this.userEventService.getAllUser(id, username);
  }

  @ApiTags('UserEvent')
  @Get(':id/userEvent/:targetUsername')
  async getUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('targetUsername') targetUsername: string,
    @GetUser() { username },
  ): Promise<{ result: UserEvent; message: string }> {
    return this.userEventService.getUser(id, targetUsername, username);
  }

  @ApiTags('UserEvent')
  @Delete(':id/userEvent/:targetUsername')
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('targetUsername') targetUsername: string,

    @GetUser() user: User,
  ): Promise<{ message: string }> {
    return this.userEventService.deleteUser(id, targetUsername, user);
  }

  @ApiTags('UserEvent')
  @Patch(':id/userEvent/:targetUsername')
  @UsePipes(ValidationPipe)
  async UpdateUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('targetUsername') targetUsername: string,

    @Body() userEventDto: UserEventDto,
    @GetUser() user: User,
  ): Promise<{ message: string }> {
    return this.userEventService.updateUser(
      id,
      targetUsername,
      user,
      userEventDto,
    );
  }

  @ApiTags('Comments')
  @Post(':id/comment')
  @UsePipes(ValidationPipe)
  async addComment(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() { username },
    @Body() commentDto: CommentDto,
  ): Promise<{ result: Comment; message: string }> {
    return await this.commentService.addComment(commentDto, id, username);
  }
  @ApiTags('Comments')
  @Get(':id/comment')
  @UsePipes(ValidationPipe)
  async getAllComments(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() { username },
  ): Promise<{ result: Comment[]; message: string }> {
    return this.commentService.getAllComments(id, username);
  }

  @ApiTags('Comments')
  @Get('/:id/comment/:idComment/')
  async getComment(
    @Param('id', ParseIntPipe) id: number,
    @Param('idComment', ParseIntPipe) idComment: number,
    @GetUser() { username },
  ): Promise<{ result: Comment; message: string }> {
    return this.commentService.getComment(id, username, idComment);
  }
  @ApiTags('comments')
  @Delete('/:id/comment/:idComment/')
  async deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @Param('idComment', ParseIntPipe) idComment: number,
    @GetUser() { username },
  ): Promise<{ message: string }> {
    return this.commentService.deleteComment(id, username, idComment);
  }
  @ApiTags('Comments')
  @UsePipes(ValidationPipe)
  @Patch('/:id/comment/:idComment/')
  async updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Param('idComment', ParseIntPipe) idComment: number,
    @GetUser() { username },
    @Body() createCommentDto: CommentDto,
  ): Promise<{ message: string }> {
    return this.commentService.updateComment(
      id,
      username,
      idComment,
      createCommentDto,
    );
  }
  @ApiTags('Todos')
  @Post(':id/todo')
  @UsePipes(ValidationPipe)
  async addTodo(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() { username },
    @Body() todoDto: TodoDto,
  ): Promise<{ message: string }> {
    return this.todoService.addTodo(todoDto, id, username);
  }
  @ApiTags('Todos')
  @Get(':id/todo')
  @UsePipes(ValidationPipe)
  async getAllTodos(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() { username },
  ): Promise<{ result: Todo[]; message: string }> {
    return this.todoService.getAllTodos(id, username);
  }
  @ApiTags('Todos')
  @Get('/:id/todo/:idTodo/')
  async getTodo(
    @Param('id', ParseIntPipe) id: number,
    @Param('idTodo', ParseIntPipe) idTodo: number,
    @GetUser() { username },
  ): Promise<{ result: Todo; message: string }> {
    return this.todoService.getTodo(id, username, idTodo);
  }
  @ApiTags('Todos')
  @Delete('/:id/todo/:idTodo/')
  async deleteTodo(
    @Param('id', ParseIntPipe) id: number,
    @Param('idTodo', ParseIntPipe) idTodo: number,
    @GetUser() { username },
  ): Promise<{ message: string }> {
    return this.todoService.deleteTodo(id, username, idTodo);
  }
  @ApiTags('Todos')
  @Patch('/:id/todo/:idTodo/')
  @UsePipes(ValidationPipe)
  async updateTodo(
    @Param('id', ParseIntPipe) id: number,
    @Param('idTodo', ParseIntPipe) idTodo: number,
    @GetUser() { username },
    @Body() todoDto: TodoDto,
  ): Promise<{ message: string }> {
    return this.todoService.updateTodo(id, username, idTodo, todoDto);
  }
}
