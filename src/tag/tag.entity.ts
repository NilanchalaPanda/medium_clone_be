import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
// This will be used as table name - 'Tag'
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
