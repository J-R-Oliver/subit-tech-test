/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import supertest from "supertest";
import { Application } from "express";
import {
  useRefreshDatabase,
  useSeeding,
  runSeeder,
  tearDownDatabase,
} from "typeorm-seeding";
import { cleanUpMetadata } from "inversify-express-utils";
import createApp from "../src/app";
import SeedDb from "../src/persistence/seeds/SeedDb";

let app: Application;

beforeAll(async () => {
  app = await createApp();
});

beforeEach(async () => {
  await useRefreshDatabase();
  await useSeeding();
  await runSeeder(SeedDb);
  cleanUpMetadata();
});

afterAll(async () => {
  await tearDownDatabase();
});

describe("/api/titles", () => {
  describe("GET", () => {
    test("status: 200 - responds with an array of Titles", () => {
      return supertest(app)
        .get("/api/titles")
        .expect(200)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Array);
        });
    });

    test("status: 200 - responds with all job Titles", () => {
      return supertest(app)
        .get("/api/titles")
        .expect(200)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          expect(body).toHaveLength(11);
        });
    });

    test("status: 200 - responds with an array of job Title objects", () => {
      return supertest(app)
        .get("/api/titles")
        .expect(200)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          body.forEach((title: Record<string, string>) => {
            expect(title).toHaveProperty("id");
            expect(title).toHaveProperty("jobTitle");
          });
        });
    });

    test("status: 200 - responds with titles sorted ascending by jobTitle", () => {
      return supertest(app)
        .get("/api/titles")
        .expect(200)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          expect(body).toBeSorted({ key: "jobTitle", coerce: true });
        });
    });
  });

  describe("/:id", () => {
    describe("GET", () => {
      test("status: 200 - responds with a title object", () => {
        return supertest(app)
          .get("/api/titles/1")
          .expect(200)
          .expect("Content-Type", /json/)
          .then(({ body }) => {
            expect(body).toHaveProperty("id");
            expect(body).toHaveProperty("jobTitle");
            expect(body).toHaveProperty("employees");
          });
      });

      test("status: 200 - responds with all employees with requested title", () => {
        return supertest(app)
          .get("/api/titles/1")
          .expect(200)
          .expect("Content-Type", /json/)
          .then(({ body: { employees } }) => {
            expect(employees).toBeInstanceOf(Array);

            employees.forEach((employee : any) => {
              expect(employee).toHaveProperty("id");
              expect(employee).toHaveProperty("createdAt");
              expect(employee).toHaveProperty("updatedAt");
              expect(employee).toHaveProperty("title");
              expect(employee).toHaveProperty("firstName");
              expect(employee).toHaveProperty("lastName");
              expect(employee).toHaveProperty("email");
              expect(employee).toHaveProperty("phone");
            });
          });
      });

      test("status: 400 - responds with Invalid Request when :id is not an number", () => {
        return supertest(app)
          .get("/api/titles/notanid")
          .expect(400)
          .expect("Content-Type", /json/)
          .then(({ body }) => {
            expect(body).toBe("Invalid Request ID");
          });
      });

      test("status: 404 - responds with Title Not Found when id does not exist", () => {
        return supertest(app)
          .get("/api/titles/5126748")
          .expect(404)
          .expect("Content-Type", /json/)
          .then(({ body }) => {
            expect(body).toBe("Title Not Found");
          });
      });
    });
  });
});
