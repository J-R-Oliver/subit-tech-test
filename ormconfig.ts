import EmployeeEntity from "./src/persistence/entities/EmployeeEntity";
import TitleEntity from "./src/persistence/entities/TitleEntity";
import DepartmentEntity from "./src/persistence/entities/DepartmentEntity";

const { DATABASE_URL, DB_HOST = "localhost", NODE_ENV } = process.env;

const base = {
  type: "postgres",
  entities: [EmployeeEntity, TitleEntity, DepartmentEntity],
  synchronize: false,
  logging: false,
  seeds: ["src/persistence/seeds/*.ts"],
  factories: ["src/persistence/factories/*.ts"],
};

const production = {
  url: DATABASE_URL,
};

const test = {
  host: DB_HOST,
  port: 5432,
  username: "postgres",
  password: "secret",
  database: "subit_tech_test",
};

export = { ...base, ...(NODE_ENV === "production" ? production : test) };
