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

  async deleteUserEvent(userEventToDelete: UserEvent, eventId:number) {
    const prueba = await this.createQueryBuilder('userEvent')
      .leftJoinAndSelect("userEvent.event", "event")
      .where(`userEvent.username = "${userEventToDelete.username}"`)
      .andWhere(`event.id = ${eventId}`).getOne()


    console.log(prueba);
    try {
      await this.delete(prueba)
    }
    catch (err) {
      console.log(err);
    }


  }

  getUser(targetUsername: string): Promise<UserEvent> {
    return this.findOne({ where: [{ username: targetUsername }] });
  }
}
