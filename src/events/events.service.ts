import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRepository } from './event.repository';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './event.entity';
import { User } from '../auth/user.entity';
import { UserEventRepository } from '../UserEvent/userEvent.repository';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventRepository)
    private eventRepository: EventRepository,
    private userEventRepository: UserEventRepository,
  ) {}

  async createEvent(createEventDto: CreateEventDto, user: User): Promise<void> {
    const event = await this.eventRepository.createEvent(createEventDto, user);

    this.userEventRepository.createUserEvent(user, event);
  }

  async getEventByIdWithUser(id: number, user: User): Promise<Event> {
    const event = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.userEvents', 'userEvent')
      .getOne();
    console.log('prueba', event);
    //
    // const exist = await this.eventRepository
    //   .createQueryBuilder('event')
    //   .leftJoinAndSelect('event.UserEvents', 'userEvent')
    //   .where(`event.id = ${id} AND userEvent.id = ${user.id}`)
    //   .getOne();
    //
    // if (!event || !exist) {
    //   throw new NotFoundException(`Task with ID "${id}" not found`);
    // }

    return event;
  }

  async getEventByIdWithoutUser(id: number): Promise<Event> {
    const event = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.users', 'user')
      .where(`event.id = ${id}`)
      .getOne();

    if (!event) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return event;
  }

  async deleteEvent(event: Event): Promise<void> {
    await this.eventRepository.remove(event);
  }

  async updateEvent(
    event: Event,
    createEventDto: CreateEventDto,
  ): Promise<Event> {
    event.description = createEventDto.description;
    event.startDate = createEventDto.startDate;
    event.endDate = createEventDto.endDate;
    event.nmax = createEventDto.nmax;
    event.location = createEventDto.location;
    event.title = createEventDto.title;

    await this.eventRepository.save(event);

    return event;
  }

  async joinUser(id: number, user: User) {
    const event = await this.getEventByIdWithoutUser(id);

    this.userEventRepository.createUserEvent(user, event);

    event.users.push(user);

    this.eventRepository.save(event);
  }

  async deleteUser(deleteid: number, event: Event) {
    const user = this.getUser(event, deleteid);

    event.users.splice(event.users.indexOf(user), 1);

    this.eventRepository.save(event);
  }

  getUser(event: Event, userId: number): User {
    const user = event.users.find((user) => user.id === userId);

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }
    return user;
  }

  getAllUser(event: Event): User[] {
    return event.users;
  }

  updateUser(userId: number, event: Event) {
    const user = this.getUser(event, userId);
    // user.color = 'Cambio de color';

    event.users.splice(event.users.indexOf(user), 1, user);

    this.eventRepository.save(event);
  }
}
