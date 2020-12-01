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
import { Event } from '../events/entity/event.entity';
import { JoinEventDto } from './dto/JoinEventDto';

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
    joinEventDto: JoinEventDto,
    admin: boolean,
  ): Promise<{ result: Event; message: string }> {
    let event = await this.eventService.getEventById(id);
    const userEvent = await EventMapping.toUserEvent(user, event, admin);

    console.log(event.nmax);
    console.log(event.userEvents.length);
    if (event.userEvents.length >= event.nmax) {
      throw new ConflictException('El evento esta lleno!');
    }

    if (
      event.users.some(
        (userOnEvents) => userOnEvents.username === user.username,
      )
    )
      throw new ConflictException('Este usuario ya esta en el evento');
    if (event.password !== joinEventDto.password) {
      throw new UnauthorizedException('La contraseña es incorrecta!');
    }

    await this.userEventRepository.createUserEvent(userEvent);

    event = await this.eventService.getEventById(id);
    event.users.push(user);

    await this.eventRepository.save(event);

    event = await this.eventService.getEventById(id);

    return {
      message: `${typesMessages.USER} ${userEvent.username} ${typesMessages.JOINED}`,
      result: event,
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

    if (
      userEventToDelete.rank < userEventTrigger.rank ||
      (userEventTrigger.rank === 3 &&
        userEventTrigger.username !== userEventToDelete.username)
    )
      throw new UnauthorizedException();

    let event = await this.eventService.getEventById(id);
    this.eventService.validateEvent(id, userEventToDelete.username);
    event.users = event.users.filter(
      (user) => user.username !== userEventToDelete.username,
    );

    await this.userEventRepository.deleteUserEvent(userEventToDelete);
    await this.eventRepository.save(event);

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
      userEventTrigger.rank === 2
    ) {
      throw new UnauthorizedException();
    }
    this.userEventRepository.updateUserEvent(userEventUpdated);
    return {
      message: `${typesMessages.USER} ${userEventTarget.username} ${typesMessages.UPDATED}`,
    };
  }
}
