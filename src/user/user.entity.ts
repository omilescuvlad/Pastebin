import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Paste } from '../paste/paste.entity';
import { Role } from 'src/enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Paste, (paste) => paste.user)
  pastes: Paste[];

  @Column({
    type: 'text',
    array: true,
    default: [Role.User],
  })
  roles: Role[];
}
