import log from 'loglevel';

class LoggerService {
  private log: log.RootLogger = log.default;

  constructor() {
    this.log.enableAll();
  }

  public info(...msg: any[]) {
    this.log.info(...msg);
  }

  public error(...msg: any[]) {
    this.log.error(...msg);
  }
}

const loggerService = new LoggerService();

export default loggerService;
