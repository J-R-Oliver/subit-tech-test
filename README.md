# Subit Tech Test

![Heroku](https://github.com/J-R-Oliver/subit-tech-test/workflows/Heroku/badge.svg)

<table>
<tr>
<td>
A REST API for storing and retrieving employees, departments and job titles written in TypeScript. Designed to demonstrate SOLID design principles with the repository, data mapper and request-response patterns using dependency injection and IoC.
</td>
</tr>
</table>

### Prerequisites

To install this project you will need to have:

- [Node.js](https://nodejs.org)
- [Docker](https://www.docker.com)

Tested on `Node.js v12/v13/v14` and `PostgreSQL v12`.

### Installation

To start, please `fork` and `clone` the repository to your local machine. First you will need to install the dependencies.

```
npm install
```

To start the database, execute the `docker-compose.test` file. This will start _PostgreSQL_ in a _Docker_ container.

```
npm run db-start
```

To seed the database you first need to sync the schema and then execute the seed file.

```
npm run db-schema-sync && npm run db-seed
```

The following command will start the server in development mode listening on the default port of 9090. Whenever a change is made the server will restart.

```
npm start-dev
```

## Endpoints

There are six endpoints available:

> `api/employees`

**GET**: Returns all employees. Accepts an optional _sort_ and _order_ query.

**POST**: Accepts an employee object and returns the created employee.

> `api/employees/:id`

**GET**: Returns the employee with the specified id.

**PATCH**: Accepts a partial employee object and returns the updated employee.

**DELETE**: Returns a 204 status code on successful deletion of employee.

> `api/departments`

**GET**: Returns all departments.

> `api/departments/:id`

**GET**: Returns the department with the specified id.

> `api/titles`

**GET**: Returns all job titles.

> `api/titles/:id`

**GET**: Returns the job title with the specified id.

## Testing

All tests have been written using [Jest](https://jestjs.io). A pre-written script has been made to initiate a test run.

```
npm test
```

A pretest script has been written and configured to run `eslint` automatically prior to starting Jest. This will highlight any linting errors.

Prior to any `commit` or `push` a full test run will be started. This has been automated using [Husky](https://github.com/typicode/husky).

## Linting

This project is being linted with `eslint` configured with the following rule sets:

- [ESLint Plugin TypeScript](https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin)
- [Airbnb](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)
- [Prettier](https://github.com/prettier/eslint-config-prettier)
- [Jest](https://github.com/jest-community/eslint-plugin-jest)
- [Jest Formatting](https://github.com/dangreenisrael/eslint-plugin-jest-formatting)
- [Node Security](https://github.com/nodesecurity/eslint-plugin-security)

## Built With

- [Express](http://expressjs.com) - a fast, unopinionated, minimalist web framework for Node.js.
- [Inversify](http://inversify.io) - a inversion of control container
  for JavaScript & Node.js apps powered by TypeScript.
- [Inversify Express Utils](https://github.com/inversify/inversify-express-utils) - utilities for the development of Express applications with Inversify.
- [TypeORM](https://typeorm.io/#/) - an ORM that can run in NodeJS.
- [Node Postgres](https://node-postgres.com) - a collection of node.js modules for interfacing with PostgreSQL databases.

## Docker

A `Dockerfile` has been provided and a _Docker_ image can be created with the following command.

```
docker build -t subit-tech-test .
```

A second `docker-compose file` has been provided to start the node server in a container, as well as an instance of the database (unseeded) and networks them together. **Please Note**: If you have previously run `docker-compose.test` the test database, and all seed data, will persist and be used.

```
npm run start-dev-docker
```
