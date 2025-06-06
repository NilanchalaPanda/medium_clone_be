import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

//  It specifies the actual table name in the database that this entity maps to.
@Entity({ name: 'follow' })
export class FollowEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  followerId: number;

  @Column()
  followingId: number;
}
