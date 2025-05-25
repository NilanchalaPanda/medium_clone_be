import { Module } from '@nestjs/common';
import { UserController } from '@app/user/user.controller';
import { UserService } from '@app/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '@app/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UserController],
  providers: [UserService],
  // Because UserService is used in the AuthMiddleware, we need to export it so that it can be injected into the middleware.
  exports: [UserService],
})
export class UserModule {}
