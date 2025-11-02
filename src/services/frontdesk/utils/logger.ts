/**
 * Logger Utility for FrontDesk
 *
 * Centralized logging service for consistent log formatting and control.
 * Provides different log levels and structured logging.
 */

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

interface LoggerConfig {
  /** Enable/disable logging globally */
  enabled: boolean;
  /** Minimum log level to output */
  minLevel: LogLevel;
  /** Include timestamps in logs */
  includeTimestamp: boolean;
  /** Prefix for all log messages */
  prefix: string;
}

class Logger {
  private config: LoggerConfig = {
    enabled: process.env.NODE_ENV !== "production",
    minLevel: LogLevel.DEBUG,
    includeTimestamp: true,
    prefix: "[FrontDesk]",
  };

  private levelPriority: Record<LogLevel, number> = {
    [LogLevel.DEBUG]: 0,
    [LogLevel.INFO]: 1,
    [LogLevel.WARN]: 2,
    [LogLevel.ERROR]: 3,
  };

  constructor(config?: Partial<LoggerConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  /**
   * Configure the logger
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Check if a log level should be output
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;
    return this.levelPriority[level] >= this.levelPriority[this.config.minLevel];
  }

  /**
   * Format log message with metadata
   */
  private formatMessage(level: LogLevel, message: string, context?: string): string {
    const parts: string[] = [];

    if (this.config.includeTimestamp) {
      parts.push(new Date().toISOString());
    }

    parts.push(this.config.prefix);
    parts.push(`[${level}]`);

    if (context) {
      parts.push(`[${context}]`);
    }

    parts.push(message);

    return parts.join(" ");
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: string, ...args: any[]): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    console.log(this.formatMessage(LogLevel.DEBUG, message, context), ...args);
  }

  /**
   * Log info message
   */
  info(message: string, context?: string, ...args: any[]): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    console.log(this.formatMessage(LogLevel.INFO, message, context), ...args);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: string, ...args: any[]): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    console.warn(this.formatMessage(LogLevel.WARN, message, context), ...args);
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error | unknown, context?: string): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;
    console.error(this.formatMessage(LogLevel.ERROR, message, context), error);
  }

  /**
   * Create a scoped logger with a specific context
   */
  scope(context: string): ScopedLogger {
    return new ScopedLogger(this, context);
  }
}

/**
 * Scoped logger that automatically includes context
 */
class ScopedLogger {
  constructor(
    private logger: Logger,
    private context: string
  ) {}

  debug(message: string, ...args: any[]): void {
    this.logger.debug(message, this.context, ...args);
  }

  info(message: string, ...args: any[]): void {
    this.logger.info(message, this.context, ...args);
  }

  warn(message: string, ...args: any[]): void {
    this.logger.warn(message, this.context, ...args);
  }

  error(message: string, error?: Error | unknown): void {
    this.logger.error(message, error, this.context);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export factory for creating scoped loggers
export const createLogger = (context: string): ScopedLogger => {
  return logger.scope(context);
};
