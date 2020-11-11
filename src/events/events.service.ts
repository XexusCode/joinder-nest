import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRepository } from './event.repository';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './event.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventRepository)
    private eventRepository: EventRepository,
  ) {}

  async createEvent(
    createEventDto: CreateEventDto,
    user: User,
  ): Promise<Event> {
    return this.eventRepository.createTask(createEventDto, user);
  }

  async getEventById(id: number, user: User): Promise<Event> {
    const event = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.users', 'user')
      .where(`event.id = ${id} AND user.id = ${user.id}`)
      .getOne();

    if (!event) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return event;
  }
}
