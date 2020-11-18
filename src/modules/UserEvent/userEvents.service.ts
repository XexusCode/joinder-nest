import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserEventRepository } from './repository/userEvent.repository';
import { User } from '../auth/entity/user.entity';
import { UserEventDto } from './dto/userEvent.dto';
import { UserEventMapping } from './userEventMapping/userEventMaping';
import { EventMapping } from '../events/eventMapping/EventMapping';
import { UserEvent } from './userEvent.entity';
import { EventRepository } from '../events/repository/event.repository';
import { Connection } from 'typeorm';
import { EventService } from '../events/events.service';
import { typesMessages } from '../auth/types/types.messages';

@Injectable()
export class UserEventService {
  private eventRepository: EventRepository;
  private userEventRepository: UserEventRepository;
  private eventService: EventService;

  constructor(
    private readonly connection: Connection,
    eventService: EventService,
  ) {
    this.eventRepository = this.connection.getCustomRepository(EventRepository);
    this.userEventRepository = this.connection.getCustomRepository(
      UserEventRepository,
    );
    this.eventService = eventService;
  }

  async joinUser(
    id: number,
    user: User,
    admin: boolean,
  ): Promise<{ message: string }> {
    const event = await this.eventService.getEventByIdWithoutUser(id);
    const userEvent = await EventMapping.toUserEvent(user, event, admin);

    if (
      event.users.some(
        (userOnEvents) => userOnEvents.username === user.username,
      )
    )
      throw new ConflictException('User already on event');

    this.userEventRepository.createUserEvent(userEvent);
    event.users.push(user);
    this.eventRepository.save(event);
    return {
      message: `${typesMessages.USER} ${userEvent.username} ${typesMessages.JOINED}`,
    };
  }

  async deleteUser(
    id: number,
    userUsername: string,
    user: User,
  ): Promise<{ message: string }> {
    const { result: userEventToDelete } = await this.getUser(
      id,
      userUsername,
      user.username,
    );
    const { result: userEventTrigger } = await this.getUser(
      id,
      user.username,
      user.username,
    );

    console.log('activador', userEventTrigger);
    console.log('para elimanar', userEventToDelete);
    if (
      userEventToDelete.rank < userEventTrigger.rank ||
      (userEventTrigger.rank === 3 &&
        userEventTrigger.username !== userEventToDelete.username)
    )
      throw new UnauthorizedException();

    let event = await this.eventService.getEventById(id);
    this.eventService.validateEvent(id, userEventToDelete.username);
    event.users = event.users.filter((user) => user.id !== user.id);
    this.eventRepository.save(event);
    this.userEventRepository.deleteUserEvent(userEventToDelete);

    return {
      message: `${typesMessages.USER} ${userEventToDelete.username} ${typesMessages.DELETED}`,
    };
  }

  async getUser(
    id: number,
    userTarget: string,
    username: string,
  ): Promise<{ result: UserEvent; message: string }> {
    await this.eventService.validateEvent(id, username);
    const userEvent = await this.userEventRepository.getUser(userTarget);

    if (!userEvent) {
      throw new NotFoundException(`User  "${userTarget}" not found`);
    }
    return {
      message: '',
      result: userEvent,
    };
  }

  async getAllUser(
    id: number,
    username: string,
  ): Promise<{ result: UserEvent[]; message: string }> {
    await this.eventService.validateEvent(id, username);

    const event = await this.eventService.getEventById(id);

    return {
      message: '',
      result: event.userEvents,
    };
  }

  async updateUser(
    id: number,
    targetUsername: string,
    user: User,
    userEventDto: UserEventDto,
  ): Promise<{ message: string }> {
    await this.eventService.validateEvent(id, user.username);

    console.log(userEventDto);
    const { result: userEventTrigger } = await this.getUser(
      id,
      user.username,
      user.username,
    );
    const userEventUpdated = await UserEventMapping.toEntity(userEventDto);
    const { result: userEventTarget } = await this.getUser(
      id,
      targetUsername,
      user.username,
    );

    userEventUpdated.id = userEventTarget.id;
    if (
      userEventTarget.rank < userEventTrigger.rank ||
      userEventTrigger.rank === 3
    )
      throw new UnauthorizedException();

    this.userEventRepository.updateUserEvent(userEventUpdated);
    return {
      message: `${typesMessages.USER} ${userEventTarget.username} ${typesMessages.UPDATED}`,
    };
  }
}
