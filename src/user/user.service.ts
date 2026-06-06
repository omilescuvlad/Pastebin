import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // CREATE
  async create(body: any): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(body.password, salt);
    const user = this.usersRepository.create({
      fullName: body.fullName,
      username: body.username,
      password: hash,
      email: body.email,
    });

    return this.usersRepository.save(user);
  }

  // READ ALL
  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['pastes'],
    });
  }

  // READ ONE
  async findOne(id: number): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['pastes'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    return user;
  }

  // UPDATE
  async update(id: number, body: any): Promise<User> {
    const user = await this.findOne(id);

    user.fullName = body.fullName ?? user.fullName;
    user.username = body.username ?? user.username;
    const salt = await bcrypt.genSalt();
    user.password = body.password
      ? await bcrypt.hash(body.password, salt)
      : user.password;
    user.email = body.email ?? user.email;

    return this.usersRepository.save(user);
  }

  // DELETE
  async remove(id: number) {
    const user = await this.findOne(id);

    await this.usersRepository.remove(user);

    return {
      message: `User with id ${id} was deleted successfully`,
    };
  }
}
