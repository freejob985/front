/**
 * Logger utility for error logging and debugging
 * Saves logs to dev.txt file
 */

interface LogEntry {
  timestamp: string;
  level: 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
  message: string;
  data?: any;
  stack?: string;
}

class Logger {
  private logFile: string = 'dev.txt';
  private maxLogSize: number = 10 * 1024 * 1024; // 10MB
  private maxLogFiles: number = 5;

  /**
   * Log an error message
   */
  error(message: string, data?: any, error?: Error): void {
    this.log('ERROR', message, data, error);
  }

  /**
   * Log a warning message
   */
  warn(message: string, data?: any): void {
    this.log('WARN', message, data);
  }

  /**
   * Log an info message
   */
  info(message: string, data?: any): void {
    this.log('INFO', message, data);
  }

  /**
   * Log a debug message
   */
  debug(message: string, data?: any): void {
    this.log('DEBUG', message, data);
  }

  /**
   * Main logging method
   */
  private log(level: LogEntry['level'], message: string, data?: any, error?: Error): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data: data ? JSON.stringify(data, null, 2) : undefined,
      stack: error?.stack
    };

    const logLine = this.formatLogEntry(logEntry);
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(logLine);
    }

    // Save to file
    this.saveToFile(logLine);
  }

  /**
   * Format log entry for output
   */
  private formatLogEntry(entry: LogEntry): string {
    let formatted = `[${entry.timestamp}] ${entry.level}: ${entry.message}`;
    
    if (entry.data) {
      formatted += `\nData: ${entry.data}`;
    }
    
    if (entry.stack) {
      formatted += `\nStack: ${entry.stack}`;
    }
    
    return formatted + '\n' + '='.repeat(80) + '\n';
  }

  /**
   * Save log entry to file
   */
  private saveToFile(logLine: string): void {
    try {
      // In browser environment, we'll use localStorage as fallback
      // In Node.js environment, we would use fs module
      if (typeof window !== 'undefined') {
        this.saveToLocalStorage(logLine);
      } else {
        // Node.js environment - would need fs module
        console.log('Logger: Would save to file in Node.js environment');
      }
    } catch (error) {
      console.error('Failed to save log:', error);
    }
  }

  /**
   * Save to localStorage (browser fallback)
   */
  private saveToLocalStorage(logLine: string): void {
    try {
      const existingLogs = localStorage.getItem(this.logFile) || '';
      const newLogs = existingLogs + logLine;
      
      // Check if log file is too large
      if (newLogs.length > this.maxLogSize) {
        this.rotateLogs();
        localStorage.setItem(this.logFile, logLine);
      } else {
        localStorage.setItem(this.logFile, newLogs);
      }
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  /**
   * Rotate log files when they get too large
   */
  private rotateLogs(): void {
    try {
      // Move current log to backup
      for (let i = this.maxLogFiles - 1; i > 0; i--) {
        const currentKey = `${this.logFile}.${i}`;
        const nextKey = `${this.logFile}.${i + 1}`;
        const currentLog = localStorage.getItem(currentKey);
        
        if (currentLog) {
          localStorage.setItem(nextKey, currentLog);
        }
      }
      
      // Move main log to .1
      const mainLog = localStorage.getItem(this.logFile);
      if (mainLog) {
        localStorage.setItem(`${this.logFile}.1`, mainLog);
        localStorage.removeItem(this.logFile);
      }
    } catch (error) {
      console.error('Failed to rotate logs:', error);
    }
  }

  /**
   * Get all logs from storage
   */
  getLogs(): string {
    try {
      return localStorage.getItem(this.logFile) || '';
    } catch (error) {
      console.error('Failed to get logs:', error);
      return '';
    }
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    try {
      localStorage.removeItem(this.logFile);
      // Clear backup logs too
      for (let i = 1; i <= this.maxLogFiles; i++) {
        localStorage.removeItem(`${this.logFile}.${i}`);
      }
    } catch (error) {
      console.error('Failed to clear logs:', error);
    }
  }

  /**
   * Download logs as file
   */
  downloadLogs(): void {
    try {
      const logs = this.getLogs();
      if (!logs) {
        console.warn('No logs to download');
        return;
      }

      const blob = new Blob([logs], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.logFile;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download logs:', error);
    }
  }
}

// Create singleton instance
const logger = new Logger();

export default logger;

// Export individual methods for convenience
export const { error, warn, info, debug, getLogs, clearLogs, downloadLogs } = logger;
