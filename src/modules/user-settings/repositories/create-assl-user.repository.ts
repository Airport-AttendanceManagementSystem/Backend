import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AaslUser } from '@common/entity/aasl-user.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class CreateAsslUserRepository {
  constructor(
    @InjectRepository(AaslUser)
    private readonly userRepository: Repository<AaslUser>,
  ) {}

  findByUsername(username: string): Promise<AaslUser | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  findAll(): Promise<AaslUser[]> {
    return this.userRepository.find();
  }

  create(data: Partial<AaslUser>): Promise<AaslUser> {
    const entity = this.userRepository.create(data);
    return this.userRepository.save(entity);
  }

  delete(username: string) {
    return this.userRepository.delete({ username });
  }

  updateStatus(username: string, status: number) {
    return this.userRepository.update({ username }, { userStatus: status });
  }

  updatePassword(
    username: string,
    hashedPassword: string,
  ): Promise<UpdateResult> {
    return this.userRepository.update(
      { username },
      { password: hashedPassword },
    );
  }
}
