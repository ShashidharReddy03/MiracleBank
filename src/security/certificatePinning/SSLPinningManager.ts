import { SSLPin } from '../../config/appConfig';

class SSLPinningManager {
  private pins: SSLPin[] = [];

  configure(pins: SSLPin[]) {
    this.pins = pins;
  }

  getPinsForDomain(domain: string): string[] {
    const entry = this.pins.find(
      (p) => p.domain === domain || (p.includeSubdomains && domain.endsWith(`.${p.domain}`)),
    );
    return entry?.pins ?? [];
  }

  getAll() {
    return this.pins;
  }
}

export const sslPinningManager = new SSLPinningManager();
