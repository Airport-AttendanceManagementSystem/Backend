import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AaslUserSection } from '../../../common/entity/aasl-user-section.entity';

@Injectable()
export class AaslUserSectionRepository extends Repository<AaslUserSection> {
  constructor(private dataSource: DataSource) {
    super(AaslUserSection, dataSource.createEntityManager());
  }
  async findSectionsByUsername(username: string): Promise<number[]> {
    const sections = await this.find({
      where: { username },
      select: ['section'],
    });
    return sections.map((s) => s.section);
  }
}
