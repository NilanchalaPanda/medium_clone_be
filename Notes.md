## 1. Login into Postgres

- `psql -d mydb -U myuser` : Login to the database with a password prompt.
  - Here `mydb` is the database name, `myuser` is the username.
- `psql -h myhost -d mydb -U myuser` : Login to the database on a remote host.

  - Here `myhost` is the hostname or IP address of the remote server.

- `\l` : List all databases.
- `\c`: Connect to a database.
- `\dt` : List all tables in the current database.
- `\q` : Quit the psql shell.

- **Commands I followed:**
  - Login `psql -U postgres`
  - Create new database `CREATE DATABASE mydb;`
  - Create new user `CREATE USER myuser WITH ENCRYPTED PASSWORD 'mypassword';`
  - Grant privileges to the user `GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;`
- Connect to the database `\c mydb`

## 2. Database configuration with Nest.js

- We will be using `(TypeORM)[https://typeorm.io/]` for database configuration.

  - ORM (Object Relational Mapping) is a programming technique which allows us to interact with the database using objects instead of writing SQL queries (So, indirectly we are using SQL queries).

- Installed `pnpm add -D typeorm pg` to install TypeORM and PostgreSQL driver.
- Added the TypeOrm configuration in `ormconfig.ts` file.

## 3. Create Tag Entity.

- (Entity)[https://typeorm.io/entities#what-is-entity] is a class that maps to a database table. It defines the structure of the table and the relationships between tables.
- Created a new file `tag.entity.ts` in the `src/entities` folder.
- Added `id` as primary key and `tagName` as a string in the tag entity.
- `\dt tag` : List all tables in the current database with descriptions.

## 4. Create Tag Repository.

- Populate some data:

  - Add some data to db - `INSERT INTO tag (name) VALUES ['tag1'];`

- (Repository)[https://typeorm.io/repositories] is a class that provides methods to interact with the database. It allows us to perform CRUD operations on the database.
- (Repository Pattern)[https://docs.nestjs.com/recipes/sql-typeorm#repository-pattern] : It is used to get the data from out database and map it to our entity.
- `forFeature()` is used to register the repository in the module.
- Inject the TagRepository in the constructor of the TagService (important).

- Once data is retrieved from the db, modify it in the **controller** and send it to the client as per the API Specs/Requirements. NOT IN THE SERVICE, because it can reused in other places as well.

## 5. Setting up the migrations.

- added `db:drop` script to `package.json` to drop the database.
  - run `pnpm db:drop` to drop the database.
- added `db:create` script to `package.json` to run the migrations.
  - run `pnpm db:create` to create the migrations.
- added `db:migrate` script to `package.json` to run the migrations.

  - run `pnpm db:migrate` to run the migrations and feed the db.

- `up` runs when we run the migration & `down` runs when we rollback the migration.

## 6. Authentication: Register User

- specification: https://realworld-docs.netlify.app/specifications/backend/endpoints/#registration
- generate user module: `nest g mo user`
- generate user controller: `nest g co user`
- generate user service: `nest g s user`

## 7. Create DTO

- Note: It is recommended to use `class` instead of `interface` for DTOs in Nest.js. Because, classes are not available at runtime, so we cannot use them for validation and Pipes in Nest.js.
- [Docs](https://docs.nestjs.com/controllers#request-payloads) : DTO (Data Transfer Object) is an object that carries data between processes. It is used to **validate the data before sending** it to the database.
- Read more about request objects in Nest.js [Docs](https://docs.nestjs.com/controllers#request-objects).
- Cmd for dto: `nest g class user/dto/create-user.dto.ts`

## 8. Create User Entity

- Create as per the API Specificatins.
- Create a new migration file for the user entity => `pnpm db:create src/migrations/CreateUser`
- Push it to the db => `pnpm db:migrate`

- **Note:**
  - `user` is a reserved keyword in PostgreSQL, so we need to use double quotes to escape it. So, the table name was renamed as `users` instead of `user`.
  - Rolled back the previous the migration and create new ones to create the user table, then checked the db. Data was created successfully.

## 9. Fix the response format as per the API specifications

- add JWT token to the response. Library used: `[jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)` and `[bcrypt](https://www.npmjs.com/package/bcrypt)` for hashing the password.
- create userResponseInterface for response type in user service and user.type to reject the hashPassword from the user object.

## 10. Validation with Pipes

- [Docs](https://docs.nestjs.com/pipes) : Pipes are used to either **VALIDATE or TRANSFORM** the data before sending it to the database.
- add `class-validator` and `class-transformer` packages to validate the data.
- use `@UsePipes(new ValidationPipe())` decorator to use the pipe in the controller with IsNotEmpty and IsEmail decorators to validate the data in registerDto.
- add validations in service level to check if the `user.email` or `user.username` already exists in the db with Nestjs inbuilt `HttpException` and `HttpStatus` class.

## 11. Create Login Endpoint

- specification: https://realworld-docs.netlify.app/specifications/backend/endpoints/#login

## 12. Auth Middleware and Get USER API.

- Docs: [Nest.js Middleware](https://docs.nestjs.com/middleware)
- Middleware is used to check if the user is authenticated or not.
- Create a new middleware command - `nest g mi user/middlewares/auth`
- Configuration of middleware in `app.module.ts` file is also imoprtant which acts as implements the Dependency Injection.
- Created custom types for the user and auth middleware to use in the controller and service names as `ExpressRequest` extending the `Request` interface from `express`.
- Used `verify` method from `jsonwebtoken` to verify the token and get the user id from the token. If token is valid, then get the user from the db and send it to the client.

## 13. User decorator.

- Decorators are used to extract the user from the request object and send it to the controller.
- Create a custom decorator using the command `nest g d user/decorators/user`.
- Use `customParameterDecorator` to create a custom decorator that extracts the user from the request object.

## 14. AuthGaurd.

- A guard is used to protect the routes and check if the user is authenticated or not.
- A middleware can be used as a gaurd it is recommended to use a guard for authorization.
- Create a new guard using the command `nest g g user/guards/auth`.
- Process :

  - Use the `nest g gu user/guards/auth` command to create a new guard.
  - The user auth gaurd comes first before the middleware, so that it can check if the user is authenticated or not. After that, the middleware will be executed to get the user from the db.
  - The **FLOW** is > User is requesting for a protected route > First we are checking if the user is present or not in the custom request object > If user is present, then we are checking if the user is authenticated > Then it moves towards the **AUTHGAURD**, here it checks if it got the user or not > If user is authenticated, then we are getting the user from the db and sending it to the client.
  - If user is not authenticated, then it will throw an error with the status code 401 (UNAUTHORIZED).

- **HOW TO USE IT?**
  - The AuthGaurd is enabled in the `user.module` file where we have to add it in the `providers` array and use it in the controller with the `@UseGuards(AuthGuard)` decorator.

## 15. Update user profile.

- specification: https://realworld-docs.netlify.app/specifications/backend/endpoints/#update-user
- The steps include:
  - Create a new DTO for update user profile with the name `update-user.dto.ts` in the `user/dto` folder.
    - **About DTO >** This is the payload representation, i.e. this will be passed in the request body.
  - Create a new endpoint in the user controller with **PUT** request to update the user profile.
    - **PUT >** It updates the **whole** user object.
  - Use the auth guard to protect the route.
  - Use the validation pipe to validate the data in the request body (At this point the DTO will be used).
  - Use the `@Body()` decorator to get the data from the request body.
  - Use the `@Put()` decorator to update the user profile.

## 16. Create new Article.

- specification: https://realworld-docs.netlify.app/specifications/backend/endpoints/#create-article
- The Process of working with new endpoint alltogether:
  - First task is to create a module, controller and service (_article_)
  - Created ArticleEntity by properly examining the structure given in the specs.
  - Now we will run our **migrations.**

- The last part after intial setup
  - Create a migration > `pnpm db:create src/migrations/{migrationName}`
  - Check the migration file. Push the migration > `pnpm db:migrate`
  - Check in the db > `psql -U postgres` > `\c mediumclone` > `\d article` -- Describe the table article.