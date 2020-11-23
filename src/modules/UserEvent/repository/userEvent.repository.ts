import { EntityRepository, Repository } from 'typeorm';
import { UserEvent } from '../userEvent.entity';

@EntityRepository(UserEvent)
export class UserEventRepository extends Repository<UserEvent> {
  async createUserEvent(userEvent: UserEvent) {
    return await userEvent.save();
  }

  updateUserEvent(userEventUpdated: UserEvent) {
    userEventUpdated.save();
  }

  async deleteUserEvent(userEventToDelete: UserEvent) {
    await this.remove(userEventToDelete);
  }

  getUser(username: string): Promise<UserEvent> {
    return this.findOne({ where: [{ username: username }] });
  }
}
