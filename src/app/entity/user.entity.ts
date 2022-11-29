import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  Entity,
  Column,
  BeforeInsert,
  ManyToMany,
  OneToMany,
  Index,
} from 'typeorm';
import { CustomBaseEntity } from '@entity/base';
import { kryptos } from '@app/utils/crypto';
import { ONG } from '@entity/ongs.entity';
import { UserToken } from '@entity/user-token.entity';
import { Animal } from './animal.entity';

export enum UserStatus {
  Created = 'created', // Criado
  Invited = 'invited', // Convidado
  Confirmed = 'confirmed', // Confirmedo
  Blocked = 'blocked', // Bloqueado
}

@Entity()
export class User extends CustomBaseEntity {
  @Column({ nullable: false })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column({ nullable: false })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Index()
  @Column('enum', {
    default: UserStatus.Created,
    enum: UserStatus,
  })
  status: UserStatus;

  @Column({ select: false, nullable: true })
  password: string;

  @OneToMany(() => UserToken, (token) => token.user)
  tokens: UserToken[];

  @ManyToMany(() => ONG, (ong) => ong.users)
  ongs: ONG[];

  @OneToMany(() => Animal, animal => animal.creator)
  animals: Animal[]

  @BeforeInsert()
  hashPassword(): void {
    if (this.password) {
      this.password = kryptos.encrypt(this.password);
    }
  }
}
