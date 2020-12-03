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

describe("/api/employee", () => {
  describe("GET", () => {
    test("status: 200 - responds with an array of employees", () => {
      return supertest(app)
        .get("/api/employees")
        .expect(200)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          expect(body).toBeInstanceOf(Array);
        });
    });

    test("status: 200 - responds with all employees", () => {
      return supertest(app)
        .get("/api/employees")
        .expect(200)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          expect(body).toHaveLength(100);
        });
    });

    test("status: 200 - responds with an array of employees objects", () => {
      return supertest(app)
        .get("/api/employees")
        .expect(200)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          body.forEach((employee: Record<string, string>) => {
            expect(employee).toHaveProperty("id");
            expect(employee).toHaveProperty("createdAt");
            expect(employee).toHaveProperty("updatedAt");
            expect(employee).toHaveProperty("title");
            expect(employee).toHaveProperty("firstName");
            expect(employee).toHaveProperty("lastName");
            expect(employee).toHaveProperty("email");
            expect(employee).toHaveProperty("phone");
            expect(employee).toHaveProperty("jobTitle");
            expect(employee).toHaveProperty("department");
            expect(employee).toHaveProperty("startDate");
          });
        });
    });

    test("status: 200 - responds by default with employees sorted ascending by firstName", () => {
      return supertest(app)
        .get("/api/employees")
        .expect(200)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          expect(body).toBeSorted({ key: "firstName", coerce: true });
        });
    });

    test("status: 200 - responds with employees sorted descending by firstName when supplied with order query", () => {
      return supertest(app)
        .get("/api/employees")
        .query({ order: "desc" })
        .expect(200)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          expect(body).toBeSorted({
            key: "firstName",
            coerce: true,
            descending: true,
          });
        });
    });

    test("status: 200 - responds with employees sorted ascending by createdAt when supplied with sort query", () => {
      return supertest(app)
        .get("/api/employees")
        .query({ sort: "createdAt" })
        .expect(200)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          expect(body).toBeSorted({ key: "createdAt", coerce: true });
        });
    });

    test("status: 200 - responds with employees sorted descending by department when supplied with sort and order query", () => {
      return supertest(app)
        .get("/api/employees")
        .query({ sort: "department", order: "desc" })
        .expect(200)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          expect(body).toBeSorted({
            key: "department",
            coerce: true,
            descending: true,
          });
        });
    });
  });

  describe("POST", () => {
    test("status: 201 - responds with posted employee", () => {
      return supertest(app)
        .post("/api/employees")
        .send({
          title: "Mr",
          firstName: "Homer",
          lastName: "Simpson",
          email: "h.simpson@sniggscorp.com",
          phone: "07731 340949",
          startDate: "2020-09-18T18:00:45.279Z",
          jobTitle: "Nuclear Safety Inspector",
          department: "Power Plant",
        })
        .expect(201)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          expect(body).toHaveProperty("id");
          expect(body).toHaveProperty("createdAt");
          expect(body).toHaveProperty("updatedAt");
          expect(body).toHaveProperty("title", "Mr");
          expect(body).toHaveProperty("firstName", "Homer");
          expect(body).toHaveProperty("lastName", "Simpson");
          expect(body).toHaveProperty("email", "h.simpson@sniggscorp.com");
          expect(body).toHaveProperty("phone", "07731 340949");
          expect(body).toHaveProperty("startDate", "2020-09-18T18:00:45.279Z");
          expect(body).toHaveProperty("jobTitle", "Nuclear Safety Inspector");
          expect(body).toHaveProperty("department", "Power Plant");
        });
    });

    test("status: 201 - responds with automatically generated uuid", () => {
      return supertest(app)
        .post("/api/employees")
        .send({
          title: "Mr",
          firstName: "Homer",
          lastName: "Simpson",
          email: "h.simpson@sniggscorp.com",
          phone: "07731 340949",
          startDate: "2020-09-18T18:00:45.279Z",
          jobTitle: "Nuclear Safety Inspector",
          department: "Power Plant",
        })
        .expect(201)
        .expect("Content-Type", /json/)
        .then(({ body: { id } }) => {
          expect(id).toMatch(
            /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
          );
        });
    });

    test("status: 201 - responds with automatically generated createdAt and updatedAt", () => {
      return supertest(app)
        .post("/api/employees")
        .send({
          title: "Mr",
          firstName: "Homer",
          lastName: "Simpson",
          email: "h.simpson@sniggscorp.com",
          phone: "07731 340949",
          startDate: "2020-09-18T18:00:45.279Z",
          jobTitle: "Nuclear Safety Inspector",
          department: "Power Plant",
        })
        .expect(201)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          expect(body).toHaveProperty("createdAt");
          expect(body).toHaveProperty("updatedAt");
        });
    });

    test("status: 400 - responds with Invalid Request Body when passed invalid body", () => {
      return supertest(app)
        .post("/api/employees")
        .send({
          notAKey: "NotAValue",
        })
        .expect(400)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          expect(body).toBe("Invalid Request Body");
        });
    });
  });
});

describe("/:id", () => {
  describe("GET", () => {
    test("status: 200 - responds with an employees object", () => {
      return supertest(app)
        .get("/api/employees/5f126748-fc7f-45e4-9315-f42bc9e2f4f0")
        .expect(200)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          expect(body).toHaveProperty(
            "id",
            "5f126748-fc7f-45e4-9315-f42bc9e2f4f0",
          );
          expect(body).toHaveProperty("createdAt");
          expect(body).toHaveProperty("updatedAt");
          expect(body).toHaveProperty("title", "Mr");
          expect(body).toHaveProperty("firstName", "Alan");
          expect(body).toHaveProperty("lastName", "Partridge");
          expect(body).toHaveProperty("email", "a.partridge@sniggscorp.com");
          expect(body).toHaveProperty("phone", "07712 713496");
          expect(body).toHaveProperty("startDate", "1965-10-14T00:00:00.000Z");
          expect(body).toHaveProperty("jobTitle", "TV Presenter");
        });
    });

    test("status: 400 - responds with Invalid Request ID when :id is not an id", () => {
      return supertest(app)
        .get("/api/employees/notanid")
        .expect(400)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          expect(body).toBe("Invalid Request ID");
        });
    });

    test("status: 404 - responds with Employee Not Found when id does not exist", () => {
      return supertest(app)
        .get("/api/employees/5f126748-fc7f-45e4-9315-f42bc9e2fabc")
        .expect(404)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          expect(body).toBe("Employee Not Found");
        });
    });
  });

  describe("PATCH", () => {
    test("status: 200 - responds with an employee object", () => {
      return supertest(app)
        .patch("/api/employees/5f126748-fc7f-45e4-9315-f42bc9e2f4f0")
        .send({
          firstName: "Homer",
          jobTitle: "Nuclear Safety Inspector",
          department: "Power Plant",
        })
        .expect(201)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          expect(body).toHaveProperty(
            "id",
            "5f126748-fc7f-45e4-9315-f42bc9e2f4f0",
          );
          expect(body).toHaveProperty("createdAt");
          expect(body).toHaveProperty("updatedAt");
          expect(body).toHaveProperty("title", "Mr");
          expect(body).toHaveProperty("firstName", "Homer");
          expect(body).toHaveProperty("lastName", "Partridge");
          expect(body).toHaveProperty("email", "a.partridge@sniggscorp.com");
          expect(body).toHaveProperty("phone", "07712 713496");
          expect(body).toHaveProperty("startDate", "1965-10-14T00:00:00.000Z");
          expect(body).toHaveProperty("jobTitle", "Nuclear Safety Inspector");
          expect(body).toHaveProperty("department", "Power Plant");

          expect(body.updatedAt).not.toBe(body.createdAt);
        });
    });

    test("status: 200 - responds with updated employee object", () => {
      return supertest(app)
        .patch("/api/employees/5f126748-fc7f-45e4-9315-f42bc9e2f4f0")
        .send({
          firstName: "Homer",
          jobTitle: "Nuclear Safety Inspector",
          department: "Power Plant",
        })
        .expect(201)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          expect(body).toHaveProperty("firstName", "Homer");
          expect(body).toHaveProperty("jobTitle", "Nuclear Safety Inspector");
          expect(body).toHaveProperty("department", "Power Plant");
          expect(body.firstName).not.toBe("Alan");
          expect(body.jobTitle).not.toBe("TV Presenter");
          expect(body.department).not.toBe("Power Plan");
        });
    });

    test("status: 200 - responds with updatedAt to current time", () => {
      return supertest(app)
        .patch("/api/employees/5f126748-fc7f-45e4-9315-f42bc9e2f4f0")
        .send({
          firstName: "Homer",
          jobTitle: "Nuclear Safety Inspector",
          department: "Power Plant",
        })
        .expect(201)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          expect(body.updatedAt).not.toBe(body.createdAt);
        });
    });

    test("status: 404 - responds with Employee Not Found when id does not exist", () => {
      return supertest(app)
        .patch("/api/employees/5f126748-fc7f-45e4-9315-f42bc9e2f123")
        .send({
          jobTitle: "Nuclear Safety Inspector",
          department: "Power Plant",
        })
        .expect(404)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          expect(body).toBe("Employee Not Found");
        });
    });
  });

  describe("DELETE", () => {
    // eslint-disable-next-line jest/expect-expect
    test("status: 204 - reponds with no context", () => {
      return supertest(app)
        .del("/api/employees/5f126748-fc7f-45e4-9315-f42bc9e2f4f0")
        .expect(204);
    });

    test("status: 400 - responds with Invalid Request ID when :id is not an number", () => {
      return supertest(app)
        .del("/api/employees/notanid")
        .expect(400)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          expect(body).toBe("Invalid Request ID");
        });
    });

    test("status: 404 - responds with Employee Not Found when id does not exist", () => {
      return supertest(app)
        .del("/api/employees/0772546f-27aa-470a-b485-1de4fb615a4d")
        .expect(404)
        .expect("Content-Type", /json/)
        .then(({ body }) => {
          expect(body).toBe("Employee Not Found");
        });
    });

    test("status: 404 - responds with Employee Not Found following a successful delete request", () => {
      return supertest(app)
        .del("/api/employees/5f126748-fc7f-45e4-9315-f42bc9e2f4f0")
        .expect(204)
        .then(() => {
          return supertest(app)
            .get("/api/employees/5f126748-fc7f-45e4-9315-f42bc9e2f4f0")
            .expect(404)
            .then(({ body }) => {
              expect(body).toBe("Employee Not Found");
            });
        });
    });
  });
});
