import "reflect-metadata";
import { Application } from "express";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import bodyParser from "body-parser";
import AsyncContainerModule from "./inversifyConfig";

export default async (): Promise<Application> => {
  const container = new Container();
  await container.loadAsync(AsyncContainerModule);
  const server = new InversifyExpressServer(container);
  server.setConfig(app => {
    app.use(bodyParser.json());
  });
  return server.build();
};
