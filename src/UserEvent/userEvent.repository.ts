import { EntityRepository, Repository } from 'typeorm';
import { UserEvent } from './userEvent.entity';
import { User } from '../auth/user.entity';
import { Event } from '../events/event.entity';

@EntityRepository(UserEvent)
export class UserEventRepository extends Repository<UserEvent> {
  createUserEvent(user: User, event: Event) {
    const userEvent = new UserEvent();

    userEvent.username = user.username;
    userEvent.user = user;
    userEvent.rank = 3;
    userEvent.color = 'Porfa';
    userEvent.event = event;
    userEvent.save();
  }
}
