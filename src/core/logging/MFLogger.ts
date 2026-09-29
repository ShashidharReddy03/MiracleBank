type Level = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
type Transport = (level: Level, tag: string, msg: string, data?: unknown) => void;

const SENSITIVE = new Set(['token', 'password', 'pin', 'cvv', 'secret', 'otp', 'key']);

function sanitize(data?: unknown): unknown {
  if (!data || typeof data !== 'object') return data;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data as object)) {
    out[k] = SENSITIVE.has(k.toLowerCase()) ? '[REDACTED]' : v;
  }
  return out;
}

class MFLogger {
  private transports: Transport[] = [];

  addTransport(t: Transport) { this.transports.push(t); }

  private emit(level: Level, tag: string, msg: string, data?: unknown) {
    const safe = sanitize(data);
    if (__DEV__) {
      const out = `[${level}][${tag}] ${msg}`;
      if (level === 'ERROR')      console.error(out, safe);
      else if (level === 'WARN')  console.warn(out, safe);
      else                        console.log(out, safe);
    }
    this.transports.forEach((t) => t(level, tag, msg, safe));
  }

  debug(tag: string, msg: string, data?: unknown) { this.emit('DEBUG', tag, msg, data); }
  info (tag: string, msg: string, data?: unknown) { this.emit('INFO',  tag, msg, data); }
  warn (tag: string, msg: string, data?: unknown) { this.emit('WARN',  tag, msg, data); }
  error(tag: string, msg: string, data?: unknown) { this.emit('ERROR', tag, msg, data); }
}

export const logger = new MFLogger();
