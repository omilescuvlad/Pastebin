import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // CREATE
  async create(body: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(body.password, salt);

    const user = this.usersRepository.create({
      fullName: body.fullName,
      username: body.username,
      password: hash,
      email: body.email,
      emailNotifications: true,
      unsubscribeToken: randomUUID(),
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
  async update(id: number, body: UpdateUserDto): Promise<User> {
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

  //UNSUBSCRIBE
  async unsubscribe(token: string) {
    const user = await this.usersRepository.findOne({
      where: { unsubscribeToken: token },
    });

    if (!user) {
      throw new NotFoundException('Invalid unsubscribe token');
    }

    user.emailNotifications = false;

    await this.usersRepository.save(user);

    return {
      message: 'You have successfully unsubscribed from email notifications',
    };
  }
}
