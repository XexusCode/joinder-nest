import { EntityRepository, Repository } from 'typeorm';
import { UserEvent } from '../userEvent.entity';

@EntityRepository(UserEvent)
export class UserEventRepository extends Repository<UserEvent> {
  createUserEvent(userEvent: UserEvent) {
    return userEvent.save();
  }

  updateUserEvent(userEventUpdated: UserEvent) {
    userEventUpdated.save();
  }

  deleteUserEvent(userEventToDelete: UserEvent) {
    this.remove(userEventToDelete);
  }

  getUser(username: string): Promise<UserEvent> {
    return this.findOne({ where: [{ username: username }] });
  }
}
