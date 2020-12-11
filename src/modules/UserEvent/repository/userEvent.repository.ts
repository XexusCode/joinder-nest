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

  async deleteUserEvent(userEventToDelete: UserEvent, eventId: number) {
    const user = await this.getUser(userEventToDelete.username, eventId);

    try {
      await this.delete(user);
    } catch (err) {
      console.log(err);
    }
  }

  async getUser(targetUsername: string, eventId: number): Promise<UserEvent> {
    return await this.createQueryBuilder('userEvent')
      .leftJoinAndSelect('userEvent.event', 'event')
      .where(`userEvent.username = "${targetUsername}"`)
      .andWhere(`event.id = ${eventId}`)
      .getOne();
  }
}
