import { AddressInfo } from "net";
import { app } from "./app";
import { config } from "./config";
import http from 'http';
import { initDbContext } from "./features/db.context";
import { logger } from "./utils/logger";

const server = http.createServer(app);

server.listen(config.port, () => {
  const address = server.address() as AddressInfo;
  logger.info(`Server http://localhost:${address.port} is running ...`);
  logger.info(`Listening on port ${config.port}`);
  logger.info(JSON.stringify(config, null, 2));
  initDbContext({
    successFn: () => logger.info('Connected to Mongo'),
    errorFn: (error) => logger.error(error)
  });
});
