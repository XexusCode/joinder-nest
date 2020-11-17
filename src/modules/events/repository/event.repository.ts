import { EntityRepository, Repository } from 'typeorm';
import { Event } from '../entity/event.entity';

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {
  async createEvent(event: Event): Promise<Event> {
    try {
      return event.save();
    } catch (error) {
      console.log('error :(:', error);
    }

    return event;
  }

  async getEventByIdWithoutUser(id: number): Promise<Event> {
    return await this.createQueryBuilder('event')
      .leftJoinAndSelect('event.users', 'user')
      .where(`event.id = ${id}`)
      .getOne();
  }

  async getAllEvents(username: string): Promise<Array<Event>> {
    return await this.createQueryBuilder('event')
      .leftJoinAndSelect('event.users', 'user')
      .leftJoinAndSelect('event.userEvents', 'userEvent')
      .leftJoinAndSelect('event.comments', 'comment')
      .where(`user.username = "${username}"`)
      .getMany();
  }

  async getEventByIdWithUser(id: number): Promise<Event> {
    return await this.createQueryBuilder('event')
      .leftJoinAndSelect('event.users', 'user')
      .leftJoinAndSelect('event.userEvents', 'userEvent')
      .leftJoinAndSelect('event.comments', 'comment')
      .leftJoinAndSelect('event.todos', 'todo')
      .where(`event.id = ${id}`) //user.username = "${username}" AND
      .getOne();
  }
}
