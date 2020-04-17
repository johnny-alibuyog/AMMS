import http from 'http';
import { app } from "./app";
import { config } from "./config";
import { AddressInfo } from "net";
import { logger } from "./utils/logger";
import { initDbContext } from "./features/db.context";

const server = http.createServer(app);

server.listen(config.port, () => {
  const address = server.address() as AddressInfo;
  logger.info(`Server http://localhost:${address.port} is running ...`)
  logger.info(`Listening on port ${config.port}`);
  initDbContext({
    successFn: () => logger.info('Connected to Mongo'),
    errorFn: (error) => logger.error(error)
  });
});
