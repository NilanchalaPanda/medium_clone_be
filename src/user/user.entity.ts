import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { hash } from 'bcrypt';

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
}
