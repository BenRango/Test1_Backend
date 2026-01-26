import path from "path";
import { AppDataSource } from "./src/config/data-source.js";
import { jest } from '@jest/globals';

jest.mock('@config/env.js', () => ({
  runningInDocker: false,
  testingMode: true,

  TEST_DATABASE_URL: 'postgres://test',
  DATABASE_URL: 'postgres://test',
  LOCAL_DATABASE_URL: 'postgres://test',

  JWT_SECRET_KEY: 'test-secret',
  PORT: '3000',
  HOST: 'localhost:3000',
}));

jest.mock("./src/utils/paths", () => ({
  modelsPath : path.join(__dirname, '..', 'models/*'),
  migrationsPath : path.join(__dirname, '..', 'migrations/*.{js}')
}));


beforeAll(async () => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

afterAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

afterEach(async () => {
  if (AppDataSource.isInitialized) {
    const driver = AppDataSource.driver.options.type;
    const entities = AppDataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = AppDataSource.getRepository(entity.name);
      if (driver === 'sqlite') {
        await repository.query(`DELETE FROM "${entity.tableName}";`);
      } else {
        await repository.query(`TRUNCATE "${entity.tableName}" CASCADE;`);
      }
    }
  }
});
