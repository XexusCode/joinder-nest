import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';

export class AuthMapping {
  static async toEntity(authCredentials: AuthCredentialsDto): Promise<User> {
    const user = new User();

    user.username = authCredentials.username;
    user.password = authCredentials.password;
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(user.password, user.salt);

    return user;
  }
}
