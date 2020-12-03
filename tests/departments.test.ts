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

describe("/api/departments", () => {
  describe("GET", () => {
    test("status: 200 - responds with an array of departments", () => {
      return supertest(app)
        .get("/api/departments")
        .expect(200)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Array);
        });
    });

    test("status: 200 - responds with all departments", () => {
      return supertest(app)
        .get("/api/departments")
        .expect(200)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          expect(body).toHaveLength(11);
        });
    });

    test("status: 200 - responds with an array of department objects", () => {
      return supertest(app)
        .get("/api/departments")
        .expect(200)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          body.forEach((department: Record<string, string>) => {
            expect(department).toHaveProperty("id");
            expect(department).toHaveProperty("departmentTitle");
          });
        });
    });

    test("status: 200 - responds with departments sorted ascending by departmentTitle", () => {
      return supertest(app)
        .get("/api/departments")
        .expect(200)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          expect(body).toBeSorted({
            key: "departmentTitle",
            coerce: true,
          });
        });
    });
  });

  describe("/:id", () => {
    describe("GET", () => {
      test("status: 200 - responds with a department object", () => {
        return supertest(app)
          .get("/api/departments/1")
          .expect(200)
          .expect("Content-Type", /json/)
          .then(({ body }) => {
            expect(body).toHaveProperty("id");
            expect(body).toHaveProperty("departmentTitle");
            expect(body).toHaveProperty("employees");
          });
      });

      test("status: 200 - responds with all employees with requested department", () => {
        return supertest(app)
          .get("/api/departments/1")
          .expect(200)
          .expect("Content-Type", /json/)
          .then(({ body: { employees } }) => {
            expect(employees).toBeInstanceOf(Array);

            employees.forEach((employee: any) => {
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
          .get("/api/departments/notanid")
          .expect(400)
          .expect("Content-Type", /json/)
          .then(({ body }) => {
            expect(body).toBe("Invalid Request ID");
          });
      });

      test("status: 404 - responds with Department Not Found when id does not exist", () => {
        return supertest(app)
          .get("/api/departments/5126748")
          .expect(404)
          .expect("Content-Type", /json/)
          .then(({ body }) => {
            expect(body).toBe("Department Not Found");
          });
      });
    });
  });
});
