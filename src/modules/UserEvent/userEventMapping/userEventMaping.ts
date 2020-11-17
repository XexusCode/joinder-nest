import { UserEventDto } from '../dto/userEvent.dto';
import { UserEvent } from '../userEvent.entity';

export class UserEventMapping {
  static async toEntity(
    userEventCredentials: UserEventDto,
  ): Promise<UserEvent> {
    const userEvent = new UserEvent();

    userEvent.username = userEventCredentials.username;
    userEvent.rank = userEventCredentials.rank;
    userEvent.color = userEventCredentials.color;

    return userEvent;
  }
}
