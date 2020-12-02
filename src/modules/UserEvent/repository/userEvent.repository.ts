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
    console.log(userEventToDelete);
    const prueba = await this.delete({ id: userEventToDelete.id });
    console.log(prueba);
  }

  getUser(targetId: number): Promise<UserEvent> {
    return this.findOne({ where: [{ id: targetId }] });
  }
}
