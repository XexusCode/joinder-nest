import { EntityRepository, Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { User } from '../auth/user.entity';
import { UserEvent } from '../userEvent/userEvent.entity';

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {
  async createEvent(createTaskDto: CreateEventDto, user: User): Promise<Event> {
    const userEvent = new UserEvent();

    userEvent.id = user.id;
    userEvent.username = user.username;
    userEvent.color = 'generarcolor';
    userEvent.rank = 0;

    const { title, location, nmax, startDate, endDate } = createTaskDto;

    const event = new Event();
    event.title = title;
    event.location = location;
    event.description = ' ';
    event.img = ' ';
    event.nmax = nmax;
    event.startDate = startDate;
    event.endDate = endDate;
    event.users = [userEvent];

    try {
      await event.save();
    } catch (error) {
      console.log('error :(:', error);
    }

    return event;
  }
}
