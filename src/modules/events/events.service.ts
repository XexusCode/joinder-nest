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
  async createEvent(createEventDto: EventDto): Promise<Event> {
    const eventEntity = await EventMapping.toEntity(createEventDto);
    return await this.eventRepository.createEvent(eventEntity);
  }

  async getEventByIdWithUser(id: number, username: string): Promise<Event> {
    const event = await this.eventRepository.getEventByIdWithUser(id, username);

    if (!event) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return event;
  }

  async getEventByIdWithoutUser(id: number): Promise<Event> {
    const event = await this.eventRepository.getEventByIdWithoutUser(id);

    if (!event) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return event;
  }

  async deleteEvent(id: number, username: string): Promise<string> {
    const event = await this.getEventByIdWithUser(id, username);
    await this.validateEvent(id, username);
    const allowed = await this.checkPermission(event, username);

    if (allowed) {
      this.eventRepository.remove(event);
      return `El evento ${id} ha sido borrado satisfactoriamente`;
    } else {
      throw new UnauthorizedException();
    }
  }

  async updateEvent(
    id: number,
    username: string,
    createEventDto: EventDto,
  ): Promise<Event> {
    const newEvent = await EventMapping.toEntity(createEventDto);
    const event = await this.getEventByIdWithUser(id, username);
    await this.validateEvent(id, username);
    const allowed = this.checkPermission(event, username);

    if (allowed) {
      newEvent.id = id;
      return await this.eventRepository.save(newEvent);
    } else {
      throw new UnauthorizedException();
    }
  }

  async getAllEvents(username: string) {
    const events = await this.eventRepository.getAllEvents(username);
    events.map((event) => delete event.users);

    return events;
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
    const event = await this.getEventByIdWithUser(id, username);

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
    return this.getEventByIdWithUser(id, username);
  }
}
