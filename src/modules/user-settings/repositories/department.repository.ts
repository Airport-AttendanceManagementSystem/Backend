import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Department } from '@common/entity/department.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DepartmentRepository {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  findAll(): Promise<Department[]> {
    return this.departmentRepository.find();
  }
}
