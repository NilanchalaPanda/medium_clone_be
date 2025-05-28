import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcrypt';
import { Article } from '@app/article/article.entity';

@Entity()
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  // The select option is set to false to prevent the password from being selected by default.
  @Column({ select: false })
  password?: string;

  @BeforeInsert()
  async hashPassword() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.password = await hash(this.password, 10);
  }

  @Column({ default: '' })
  bio: string;

  @Column({ default: '' })
  image: string;

  // Relations with Articles:
  @OneToMany(() => Article, (article) => article.body)
  articles: Article[];
}
