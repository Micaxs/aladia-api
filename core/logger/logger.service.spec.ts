import { LoggerService } from './logger.service';

// Simple mock for Date to make log output predictable
const fixedDate = new Date('2020-01-01T00:00:00.000Z');

describe('LoggerService', () => {
  let service: LoggerService;
  const originalDate = Date;

  beforeAll(() => {
    // Override Date for deterministic tests
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).Date = class extends Date {
      constructor() {
        super();
        return fixedDate;
      }

      static now() {
        return fixedDate.getTime();
      }

      static parse = originalDate.parse;
      static UTC = originalDate.UTC;
    } as any;
  });

  afterAll(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).Date = originalDate as any;
  });

  beforeEach(() => {
    service = new LoggerService();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'debug').mockImplementation(() => {});
    jest.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs messages with the correct format', () => {
    service.log('hello', 'TestContext');

    expect(console.log).toHaveBeenCalledWith(
      '2020-01-01T00:00:00.000Z [LOG][TestContext] hello',
    );
  });

  it('logs errors with trace', () => {
    service.error('oops', 'stack-trace', 'ErrorContext');

    expect(console.error).toHaveBeenCalledWith(
      '2020-01-01T00:00:00.000Z [ERROR][ErrorContext] oops',
      'stack-trace',
    );
  });

  it('logs warnings', () => {
    service.warn('careful', 'WarnContext');

    expect(console.warn).toHaveBeenCalledWith(
      '2020-01-01T00:00:00.000Z [WARN][WarnContext] careful',
    );
  });

  it('logs debug messages', () => {
    service.debug?.('debug-message', 'DebugContext');

    expect(console.debug).toHaveBeenCalledWith(
      '2020-01-01T00:00:00.000Z [DEBUG][DebugContext] debug-message',
    );
  });

  it('logs verbose messages', () => {
    service.verbose?.('verbose-message', 'VerboseContext');

    expect(console.info).toHaveBeenCalledWith(
      '2020-01-01T00:00:00.000Z [VERBOSE][VerboseContext] verbose-message',
    );
  });
});
