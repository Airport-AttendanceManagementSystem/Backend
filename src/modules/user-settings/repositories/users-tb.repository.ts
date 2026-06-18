import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersTb } from '@common/entity/users-tb.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UserstbRepository {
  constructor(
    @InjectRepository(UsersTb)
    private readonly repo: Repository<UsersTb>,
  ) {}

  findByUsername(userName: string): Promise<UsersTb | null> {
    return this.repo.findOne({ where: { userName } });
  }

  create(data: Partial<UsersTb>): Promise<UsersTb> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  delete(userName: string) {
    return this.repo.delete({ userName });
  }

  updateStatus(userName: string, status: string) {
    return this.repo.update({ userName }, { userStatus: status });
  }

  updatePassword(
    userName: string,
    hashedPassword: string,
  ): Promise<UpdateResult> {
    return this.repo.update({ userName }, { password: hashedPassword });
  }
}
