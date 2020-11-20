import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { EventRepository } from './repository/event.repository';
import { EventDto } from './dto/event.dto';
import { Event } from './entity/event.entity';
import { UserEventRepository } from '../UserEvent/repository/userEvent.repository';
import { EventMapping } from './eventMapping/EventMapping';
import { Connection } from 'typeorm';
import { UserRepository } from '../auth/repository/user.repository';
import { typesMessages } from '../auth/types/types.messages';

@Injectable()
export class EventService {
  private eventRepository: EventRepository;
  private userEventRepository: UserEventRepository;
  private userRepository: UserRepository;
  constructor(private readonly connection: Connection) {
    this.eventRepository = this.connection.getCustomRepository(EventRepository);
    this.userRepository = this.connection.getCustomRepository(UserRepository);
    this.userEventRepository = this.connection.getCustomRepository(
      UserEventRepository,
    );
  }
  async createEvent(
    createEventDto: EventDto,
  ): Promise<{ event: Event; message: typesMessages }> {
    const eventEntity = await EventMapping.toEntity(createEventDto);
    const event = await this.eventRepository.createEvent(eventEntity);
    const message = typesMessages.EVENTCREATED;
    return { event, message };
  }

  async getEventById(id: number): Promise<Event> {
    const event = await this.eventRepository.getEventByIdWithUser(id);

    if (!event) {
      throw new NotFoundException(
        `${typesMessages.EVENT}"${id}" ${typesMessages.NOTFOUND}`,
      );
    }
    return event;
  }

  async getEventByIdWithoutUser(id: number): Promise<Event> {
    const event = await this.eventRepository.getEventByIdWithoutUser(id);

    if (!event) {
      throw new NotFoundException(
        `${typesMessages.EVENT} "${id}" ${typesMessages.NOTFOUND}`,
      );
    }
    return event;
  }

  async deleteEvent(
    id: number,
    username: string,
  ): Promise<{ message: string }> {
    const event = await this.getEventById(id);
    await this.validateEvent(id, username);
    const allowed = await this.checkPermission(event, username);

    if (allowed) {
      this.eventRepository.remove(event);
      return {
        message: `${typesMessages.EVENT} ${id} ${typesMessages.DELETED}`,
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  async updateEvent(
    id: number,
    username: string,
    createEventDto: EventDto,
  ): Promise<{ message: string }> {
    const event = await this.getEventById(id);
    const newEvent = await EventMapping.updateEvent(createEventDto, event);
    await this.validateEvent(id, username);
    const allowed = this.checkPermission(event, username);

    if (allowed) {
      newEvent.id = id;
      await this.eventRepository.save(newEvent);

      return {
        message: `${typesMessages.EVENT} ${id} ${typesMessages.UPDATED}`,
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  async getAllEvents(username: string) {
    const events = await this.eventRepository.getAllEvents(username);
    events.map((event) => delete event.users);
    const message = '';
    events.map((event) => event.comments.reverse());

    return { result: events, message };
  }

  private checkPermission(event: Event, username: string) {
    let allowed = false;
    event.userEvents.map((userEvent) => {
      if (userEvent.username == username && userEvent.rank === 0) {
        allowed = true;
      }
    });
    return allowed;
  }

  async validateEvent(id: number, username: string): Promise<boolean> {
    const event = await this.getEventById(id);

    if (
      event.userEvents.some(
        (userEventSearch) => userEventSearch.username === username,
      )
    ) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }

  async getEvent(id: number, username: string) {
    await this.validateEvent(id, username);
    const result = await this.getEventById(id);
    const message = '';
    return { result, message };
  }
}
