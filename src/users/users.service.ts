
import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        userId: 1,
        username: 'john',
        password: 'changeme',
        githubId: 'jochan'
      },
      {
        userId: 2,
        username: 'chris',
        password: 'secret',
        githubId: 'chsec'
      },
      {
        userId: 3,
        username: 'maria',
        password: 'guess',
        githubId: 'maguess'
      },
    ];
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

}