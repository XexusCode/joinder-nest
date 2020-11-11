import { EntityRepository, Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { User } from '../auth/user.entity';

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {
  async createTask(createTaskDto: CreateEventDto, user: User): Promise<Event> {
    const { title, location, nmax, startDate, endDate } = createTaskDto;

    const event = new Event();
    event.title = title;
    event.location = location;
    event.description = ' ';
    event.img = ' ';
    event.nmax = nmax;
    event.startDate = startDate;
    event.endDate = endDate;
    event.users = [user];

    try {
      await event.save();
    } catch (error) {
      console.log('error :(:', error);
    }
    delete event.users;

    return event;
  }
}
