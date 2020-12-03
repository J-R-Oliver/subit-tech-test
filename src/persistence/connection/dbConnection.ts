import { ConnectionOptions, Connection, createConnection } from "typeorm";
import ormconfig from "../../../ormconfig";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { seeds, factories, ...connectionOptions } = ormconfig;

export default (): Promise<Connection> => {
  return createConnection(connectionOptions as ConnectionOptions);
};
