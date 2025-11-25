import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  // LogggerService (Could be extended to send logs to datadog or other external logging services)
  // Could extend with environment variables to control log levels, output formats, etc.
  
  log(message: any, context?: string): void {
    console.log(this.format('LOG', message, context));
  }

  error(message: any, trace?: string, context?: string): void {
    console.error(this.format('ERROR', message, context), trace ?? '');
  }

  warn(message: any, context?: string): void {
    console.warn(this.format('WARN', message, context));
  }

  debug?(message: any, context?: string): void {
    console.debug(this.format('DEBUG', message, context));
  }

  verbose?(message: any, context?: string): void {
    console.info(this.format('VERBOSE', message, context));
  }

  // Debug Log Formatting
  private format(level: string, message: any, context?: string): string {
    const time = new Date().toISOString();
    const ctx = context ? `[${context}]` : '';
    return `${time} [${level}]${ctx} ${message}`;
  }
}
