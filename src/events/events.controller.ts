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
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './event.entity';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto } from '../comments/dto/create-comment.dto';
import { Comment } from '../comments/comments.entity';
import { CommentsService } from '../comments/comments.service';

@Controller('events')
@UseGuards(AuthGuard('jwt'))
export class EventsController {
  constructor(
    private eventsService: EventService,
    private commentService: CommentsService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  createEvent(
    @Body() createEventDto: CreateEventDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.eventsService.createEvent(createEventDto, user);
  }

  @Get('/:id')
  getEventById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Event> {
    return this.eventsService.getEventByIdWithUser(id, user);
  }

  @Delete('/:id')
  async deleteEvent(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    const event = await this.getEventById(id, user);
    return this.eventsService.deleteEvent(event);
  }

  @Patch('/:id')
  async updateEvent(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() createEventDto: CreateEventDto,
  ): Promise<Event> {
    const event = await this.getEventById(id, user);
    return this.eventsService.updateEvent(event, createEventDto);
  }

  @Post(':id/comment')
  @UsePipes(ValidationPipe)
  async addComment(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const event = await this.getEventById(id, user);
    return this.commentService.addComment(createCommentDto, event);
  }

  @Delete('/:id/comment/:idComment/')
  async deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @Param('idComment', ParseIntPipe) idComment: number,
    @GetUser() user: User,
  ): Promise<void> {
    const event = await this.getEventById(id, user);
    return this.commentService.deleteComment(event, idComment);
  }

  @Patch('/:id/comment/:idComment/')
  async updateComment(
    @Param('id', ParseIntPipe) id: number,
    @Param('idComment', ParseIntPipe) idComment: number,
    @GetUser() user: User,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CreateCommentDto> {
    const event = await this.getEventById(id, user);
    return this.commentService.updateComment(
      event,
      idComment,
      createCommentDto,
    );
  }

  @Post(':id/user')
  @UsePipes(ValidationPipe)
  async joinUser(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.eventsService.joinUser(id, user);
  }

  @Get(':id/user/')
  async getAllUser(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<User[]> {
    const event = await this.getEventById(id, user);
    return this.eventsService.getAllUser(event);
  }

  @Get(':id/user/:userId')
  async getUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @GetUser() user: User,
  ): Promise<User> {
    const event = await this.getEventById(id, user);
    return this.eventsService.getUser(event, userId);
  }

  @Delete(':id/user/:userId')
  @UsePipes(ValidationPipe)
  async deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @GetUser() user: User,
  ): Promise<void> {
    const event = await this.getEventById(id, user);
    return this.eventsService.deleteUser(userId, event);
  }

  @Patch(':id/user/:userId')
  @UsePipes(ValidationPipe)
  async UpdateUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('userId', ParseIntPipe) userId: number,
    @GetUser() user: User,
  ): Promise<void> {
    const event = await this.getEventById(id, user);
    return this.eventsService.updateUser(userId, event);
  }
}
