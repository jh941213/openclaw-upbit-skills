import crypto from 'crypto';
import { URLSearchParams } from 'url';

interface UpbitConfig {
  accessKey: string;
  secretKey: string;
  baseUrl?: string;
}

interface Account {
  currency: string;
  balance: string;
  locked: string;
  avg_buy_price: string;
  avg_buy_price_modified: boolean;
  unit_currency: string;
}

interface Ticker {
  market: string;
  trade_date: string;
  trade_time: string;
  trade_price: number;
  change: 'RISE' | 'EVEN' | 'FALL';
  change_price: number;
  change_rate: number;
  signed_change_price: number;
  signed_change_rate: number;
  trade_volume: number;
  acc_trade_price: number;
  acc_trade_price_24h: number;
  acc_trade_volume: number;
  acc_trade_volume_24h: number;
  highest_52_week_price: number;
  highest_52_week_date: string;
  lowest_52_week_price: number;
  lowest_52_week_date: string;
  timestamp: number;
}

interface OrderRequest {
  market: string;
  side: 'bid' | 'ask'; // bid=매수, ask=매도
  ord_type: 'price' | 'market'; // price=지정가, market=시장가
  price?: string; // 주문 금액 (매수 시)
  volume?: string; // 주문 수량 (매도 시)
}

interface OrderResponse {
  uuid: string;
  side: string;
  ord_type: string;
  price: string;
  state: string;
  market: string;
  created_at: string;
  volume: string;
  remaining_volume: string;
  reserved_fee: string;
  remaining_fee: string;
  paid_fee: string;
  locked: string;
  executed_volume: string;
  trades_count: number;
}

export class UpbitClient {
  private config: UpbitConfig;

  constructor(config: UpbitConfig) {
    this.config = {
      baseUrl: 'https://api.upbit.com',
      ...config,
    };
  }

  /**
   * JWT 토큰 생성 (인증 필요한 API)
   * Upbit API는 HS256 (HMAC-SHA256) 알고리즘 사용
   */
  private createAuthToken(queryParams?: Record<string, any>): string {
    const payload: any = {
      access_key: this.config.accessKey,
      nonce: crypto.randomUUID(),
    };

    if (queryParams) {
      const query = new URLSearchParams(queryParams).toString();
      const hash = crypto.createHash('sha512');
      const queryHash = hash.update(query, 'utf-8').digest('hex');

      payload.query_hash = queryHash;
      payload.query_hash_alg = 'SHA512';
    }

    // JWT Header
    const header = {
      alg: 'HS256',
      typ: 'JWT',
    };

    // Base64 URL encode
    const base64UrlEncode = (str: string) => {
      return Buffer.from(str)
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
    };

    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const signatureInput = `${encodedHeader}.${encodedPayload}`;

    // HMAC-SHA256 서명
    const signature = crypto
      .createHmac('sha256', this.config.secretKey)
      .update(signatureInput)
      .digest('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    const token = `${signatureInput}.${signature}`;

    return `Bearer ${token}`;
  }

  /**
   * HTTP 요청 헬퍼
   */
  private async request<T>(
    method: 'GET' | 'POST' | 'DELETE',
    path: string,
    params?: Record<string, any>,
    auth = false
  ): Promise<T> {
    const url = new URL(path, this.config.baseUrl);

    if (method === 'GET' && params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (auth) {
      headers.Authorization = this.createAuthToken(params);
    }

    const options: RequestInit = {
      method,
      headers,
    };

    if (method === 'POST' && params) {
      options.body = JSON.stringify(params);
    }

    const response = await fetch(url.toString(), options);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Upbit API Error: ${JSON.stringify(error)}`);
    }

    return response.json() as Promise<T>;
  }

  /**
   * 전체 계좌 조회
   */
  async getAccounts(): Promise<Account[]> {
    return this.request<Account[]>('GET', '/v1/accounts', undefined, true);
  }

  /**
   * 특정 코인 잔고 조회
   */
  async getBalance(currency: string): Promise<Account | null> {
    const accounts = await this.getAccounts();
    return accounts.find((acc) => acc.currency === currency.toUpperCase()) || null;
  }

  /**
   * 시세 조회 (Ticker)
   */
  async getTicker(markets: string[]): Promise<Ticker[]> {
    return this.request<Ticker[]>('GET', '/v1/ticker', {
      markets: markets.join(','),
    });
  }

  /**
   * 단일 마켓 시세 조회
   */
  async getMarketPrice(market: string): Promise<Ticker> {
    const tickers = await this.getTicker([market]);
    if (tickers.length === 0) {
      throw new Error(`Market not found: ${market}`);
    }
    return tickers[0];
  }

  /**
   * 매수 주문 (시장가)
   */
  async buyMarket(market: string, priceKrw: number): Promise<OrderResponse> {
    return this.request<OrderResponse>(
      'POST',
      '/v1/orders',
      {
        market,
        side: 'bid',
        ord_type: 'price',
        price: String(priceKrw),
      },
      true
    );
  }

  /**
   * 매도 주문 (시장가)
   */
  async sellMarket(market: string, volume: number): Promise<OrderResponse> {
    return this.request<OrderResponse>(
      'POST',
      '/v1/orders',
      {
        market,
        side: 'ask',
        ord_type: 'market',
        volume: String(volume),
      },
      true
    );
  }

  /**
   * 주문 조회
   */
  async getOrder(uuid: string): Promise<OrderResponse> {
    return this.request<OrderResponse>(
      'GET',
      '/v1/order',
      { uuid },
      true
    );
  }

  /**
   * 주문 취소
   */
  async cancelOrder(uuid: string): Promise<OrderResponse> {
    return this.request<OrderResponse>(
      'DELETE',
      '/v1/order',
      { uuid },
      true
    );
  }

  /**
   * 전체 마켓 목록
   */
  async getMarkets(): Promise<Array<{ market: string; korean_name: string; english_name: string }>> {
    return this.request('GET', '/v1/market/all', { isDetails: true });
  }
}

/**
 * 환경변수에서 Upbit 클라이언트 생성
 */
export function createUpbitClient(): UpbitClient {
  const accessKey = process.env.UPBIT_ACCESS_KEY;
  const secretKey = process.env.UPBIT_SECRET_KEY;

  if (!accessKey || !secretKey) {
    throw new Error('UPBIT_ACCESS_KEY and UPBIT_SECRET_KEY must be set');
  }

  return new UpbitClient({ accessKey, secretKey });
}

/**
 * 시장 코드 정규화
 * "비트코인" → "KRW-BTC"
 * "BTC" → "KRW-BTC"
 */
export function normalizeMarketCode(input: string): string {
  const coinMap: Record<string, string> = {
    비트코인: 'BTC',
    비트: 'BTC',
    이더리움: 'ETH',
    이더: 'ETH',
    리플: 'XRP',
    도지코인: 'DOGE',
    도지: 'DOGE',
    솔라나: 'SOL',
  };

  const normalized = coinMap[input] || input.toUpperCase();

  // 이미 KRW- 접두사가 있으면 그대로
  if (normalized.startsWith('KRW-')) {
    return normalized;
  }

  // KRW 마켓으로 변환
  return `KRW-${normalized}`;
}

/**
 * 금액 포맷팅
 */
export function formatKrw(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(amount);
}

/**
 * 변동률 포맷팅
 */
export function formatChangeRate(rate: number): string {
  const sign = rate >= 0 ? '+' : '';
  return `${sign}${(rate * 100).toFixed(2)}%`;
}
