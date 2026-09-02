import { ServiceUnavailableException } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AppService } from './app.service';

describe('AppService', () => {
  const queryMock = jest.fn();
  const dataSource = {
    query: queryMock,
  } as unknown as DataSource;

  let service: AppService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new AppService(dataSource);
  });

  it('returns the root response', () => {
    expect(service.getHello()).toBe('Hello World!');
  });

  it('reports a healthy database connection', async () => {
    queryMock.mockResolvedValue([{ '?column?': 1 }]);

    await expect(service.getHealth()).resolves.toEqual({
      status: 'ok',
      database: 'up',
    });
    expect(queryMock).toHaveBeenCalledWith('SELECT 1');
  });

  it('returns service unavailable when the database is down', async () => {
    queryMock.mockRejectedValue(new Error('DB unavailable'));

    await expect(service.getHealth()).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
  });
});
