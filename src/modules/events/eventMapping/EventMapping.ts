import { User } from '../../auth/entity/user.entity';
import { EventDto } from '../dto/event.dto';
import { Event } from '../entity/event.entity';
import { UserEvent } from '../../UserEvent/userEvent.entity';

export class EventMapping {
  static async toEntity(eventCredentials: EventDto): Promise<Event> {
    const event = new Event();
    event.title = eventCredentials.title;
    event.location = eventCredentials.location;
    event.nmax = eventCredentials.nmax;
    event.description =
      eventCredentials.description ||
      'Introduce aqui la descripcipción para quieras que tenga el evento';
    event.startDate = eventCredentials.startDate;
    event.endDate = eventCredentials.endDate;
    event.img = eventCredentials.img;
    event.password = Math.round(Math.random() * 99999 + 10000).toString();
    event.todos = [];
    event.comments = [];

    return event;
  }

  static async toUserEvent(
    user: User,
    event: Event,
    admin: boolean,
  ): Promise<UserEvent> {
    const userEvent = new UserEvent();
    userEvent.username = user.username;
    userEvent.rank = admin ? 0 : 3;
    userEvent.color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    userEvent.event = event;
    userEvent.user = user;

    return userEvent;
  }

  static async updateEvent(
    createEventDto: EventDto,
    event: Event,
  ): Promise<Event> {
    event.title = createEventDto.title;
    event.description = createEventDto.description;
    event.img = createEventDto.img;
    event.startDate = createEventDto.startDate;
    event.endDate = createEventDto.endDate;
    event.location = createEventDto.location;
    event.nmax = createEventDto.nmax;

    return event;
  }
}
