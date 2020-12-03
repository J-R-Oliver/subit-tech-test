/* eslint-disable global-require */
import { AsyncContainerModule } from "inversify";
import { Repository } from "typeorm";
import createDbConnection from "./persistence/connection/dbConnection";
import serviceIdentifiers from "./constants/serviceIdentifiers";
import EmployeeEntity from "./persistence/entities/EmployeeEntity";
import TitleEntity from "./persistence/entities/TitleEntity";
import DepartmentEntity from "./persistence/entities/DepartmentEntity";
import IRead from "./domain/repositories/IRead";
import IWrite from "./domain/repositories/IWrite";
import EmployeeRepository from "./persistence/repositories/EmployeeRepository";
import TitleRepository from "./persistence/repositories/TitleRepository";
import DepartmentRepository from "./persistence/repositories/DepartmentRepository";
import IReadService from "./domain/services/IReadService";
import EmployeeResponse from "./domain/services/communication/EmployeeResponse";
import IWriteService from "./domain/services/IWriteService";
import Employee from "./domain/models/Employee";
import EmployeesService from "./services/EmployeesService";
import TitleResponse from "./domain/services/communication/TitleResponse";
import TitlesService from "./services/TitlesService";
import DepartmentResponse from "./domain/services/communication/DepartmentResponse";
import DepartmentsService from "./services/DepartmentsService";

export default new AsyncContainerModule(async bind => {
  await require("./controllers/EmployeesController");
  await require("./controllers/TitlesController");
  await require("./controllers/DepartmentsController");

  const connection = await createDbConnection();

  bind<Repository<EmployeeEntity>>(serviceIdentifiers.EmployeeTypeORM)
    .toDynamicValue(() => {
      return connection.getRepository(EmployeeEntity);
    })
    .inRequestScope();

  bind<Repository<TitleEntity>>(serviceIdentifiers.TitleTypeORM)
    .toDynamicValue(() => {
      return connection.getRepository(TitleEntity);
    })
    .inRequestScope();

  bind<Repository<DepartmentEntity>>(serviceIdentifiers.DepartmentTypeORM)
    .toDynamicValue(() => {
      return connection.getRepository(DepartmentEntity);
    })
    .inRequestScope();

  bind<IRead<EmployeeEntity> & IWrite<EmployeeEntity>>(
    serviceIdentifiers.EmployeeRepository,
  ).to(EmployeeRepository);

  bind<IRead<TitleEntity> & IWrite<TitleEntity>>(
    serviceIdentifiers.TitleRepository,
  ).to(TitleRepository);

  bind<IRead<DepartmentEntity> & IWrite<DepartmentEntity>>(
    serviceIdentifiers.DepartmentRepository,
  ).to(DepartmentRepository);

  bind<
    IReadService<EmployeeResponse> & IWriteService<Employee, EmployeeResponse>
  >(serviceIdentifiers.EmployeesService).to(EmployeesService);

  bind<IReadService<TitleResponse>>(serviceIdentifiers.TitlesService).to(
    TitlesService,
  );

  bind<IReadService<DepartmentResponse>>(
    serviceIdentifiers.DepartmentsService,
  ).to(DepartmentsService);
});
