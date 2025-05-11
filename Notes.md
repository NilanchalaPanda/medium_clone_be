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