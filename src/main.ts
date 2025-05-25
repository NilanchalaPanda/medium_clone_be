/* eslint-disable @typescript-eslint/no-require-imports */
// !Have to fix the IS_TS_NODE custom script issue located in the nodemon.json file. 
// if (!process.env.IS_TS_NODE) {
// require('module-alias/register');
// }

//! This should only be used in production mode.
require('module-alias/register');

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
