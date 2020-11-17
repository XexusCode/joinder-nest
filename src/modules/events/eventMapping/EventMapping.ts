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
    event.description = eventCredentials.description || 'Description';
    event.startDate = eventCredentials.startDate;
    event.endDate = eventCredentials.endDate;
    event.img = eventCredentials.img;

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
}
