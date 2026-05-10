import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Paste } from './paste.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class PastesService {
  constructor(
    @InjectRepository(Paste)
    private readonly pastesRepository: Repository<Paste>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  // CREATE
  async create(body: any): Promise<Paste> {
    const user = await this.usersRepository.findOne({
      where: { id: body.userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${body.userId} not found`);
    }

    const paste = this.pastesRepository.create({
      content: body.content,
      userId: body.userId,
      user: user,
    });

    return this.pastesRepository.save(paste);
  }

  // READ ALL
  async findAll(): Promise<Paste[]> {
    return this.pastesRepository.find({
      relations: ['user'],
    });
  }

  // READ ONE
  async findOne(id: number): Promise<Paste> {
    const paste = await this.pastesRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!paste) {
      throw new NotFoundException(`Paste with id ${id} not found`);
    }

    return paste;
  }

  // UPDATE
  async update(id: number, body: any): Promise<Paste> {
    const paste = await this.findOne(id);

    paste.content = body.content ?? paste.content;

    return this.pastesRepository.save(paste);
  }

  // DELETE
  async remove(id: number) {
    const paste = await this.findOne(id);

    await this.pastesRepository.remove(paste);

    return {
      message: `Paste with id ${id} was deleted successfully`,
    };
  }
}