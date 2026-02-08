import { z } from 'zod';
import {
  createUpbitClient,
  normalizeMarketCode,
  formatKrw,
  formatChangeRate,
} from './upbit-client.js';

/**
 * 잔고 조회 도구
 */
export async function handleBalanceQuery(query: string): Promise<string> {
  const client = createUpbitClient();
  const accounts = await client.getAccounts();

  // 특정 코인 잔고 조회
  if (query.includes('BTC') || query.includes('비트')) {
    const btc = accounts.find((acc) => acc.currency === 'BTC');
    if (!btc || parseFloat(btc.balance) === 0) {
      return 'BTC 보유량: 0';
    }
    const ticker = await client.getMarketPrice('KRW-BTC');
    const valueKrw = parseFloat(btc.balance) * ticker.trade_price;
    return `💰 BTC 잔고:\n- 수량: ${btc.balance} BTC\n- 평가액: ${formatKrw(valueKrw)}\n- 평균 매수가: ${formatKrw(parseFloat(btc.avg_buy_price))}`;
  }

  // 전체 잔고 조회
  let totalKrw = 0;
  let message = '💰 업비트 잔고:\n\n';

  for (const acc of accounts) {
    const balance = parseFloat(acc.balance);
    if (balance === 0) continue;

    if (acc.currency === 'KRW') {
      message += `- KRW: ${formatKrw(balance)}\n`;
      totalKrw += balance;
    } else {
      try {
        const ticker = await client.getMarketPrice(`KRW-${acc.currency}`);
        const valueKrw = balance * ticker.trade_price;
        totalKrw += valueKrw;
        message += `- ${acc.currency}: ${balance.toFixed(8)} (약 ${formatKrw(valueKrw)})\n`;
      } catch {
        // 시세 조회 실패 시 스킵
      }
    }
  }

  message += `\n총 평가액: ${formatKrw(totalKrw)}`;
  return message;
}

/**
 * 시세 조회 도구
 */
export async function handlePriceQuery(coinName: string): Promise<string> {
  const client = createUpbitClient();
  const market = normalizeMarketCode(coinName);

  try {
    const ticker = await client.getMarketPrice(market);

    const changeEmoji = ticker.change === 'RISE' ? '🔺' : ticker.change === 'FALL' ? '🔻' : '➖';

    return `📊 ${market} 현재 시세:\n\n` +
      `현재가: ${formatKrw(ticker.trade_price)}\n` +
      `${changeEmoji} 전일 대비: ${formatKrw(ticker.signed_change_price)} (${formatChangeRate(ticker.signed_change_rate)})\n` +
      `24시간 거래량: ${ticker.acc_trade_volume_24h.toFixed(2)}\n` +
      `24시간 거래대금: ${formatKrw(ticker.acc_trade_price_24h)}`;
  } catch (error) {
    return `❌ 시세 조회 실패: ${market} 마켓을 찾을 수 없습니다.`;
  }
}

/**
 * 매수 도구
 */
export async function handleBuy(coinName: string, amountKrw: number): Promise<string> {
  const client = createUpbitClient();
  const market = normalizeMarketCode(coinName);

  try {
    // 시세 확인
    const ticker = await client.getMarketPrice(market);

    // 수수료 포함 계산 (0.05%)
    const fee = amountKrw * 0.0005;
    const totalCost = amountKrw + fee;

    // 잔고 확인
    const krwBalance = await client.getBalance('KRW');
    if (!krwBalance || parseFloat(krwBalance.balance) < totalCost) {
      return `❌ 잔고 부족: ${formatKrw(totalCost)} 필요 (현재: ${formatKrw(parseFloat(krwBalance?.balance || '0'))})`;
    }

    // 매수 실행
    const order = await client.buyMarket(market, amountKrw);

    const estimatedVolume = amountKrw / ticker.trade_price;

    return `✅ 매수 주문 완료:\n\n` +
      `종목: ${market}\n` +
      `주문 금액: ${formatKrw(amountKrw)}\n` +
      `예상 수량: 약 ${estimatedVolume.toFixed(8)}\n` +
      `주문 UUID: ${order.uuid}\n\n` +
      `💡 체결 완료까지 수초 소요됩니다.`;
  } catch (error) {
    return `❌ 매수 실패: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * 매도 도구
 */
export async function handleSell(coinName: string, volume: number | 'all'): Promise<string> {
  const client = createUpbitClient();
  const market = normalizeMarketCode(coinName);
  const currency = market.replace('KRW-', '');

  try {
    // 잔고 확인
    const balance = await client.getBalance(currency);
    if (!balance || parseFloat(balance.balance) === 0) {
      return `❌ 보유량 없음: ${currency} 잔고가 0입니다.`;
    }

    const availableVolume = parseFloat(balance.balance);
    const sellVolume = volume === 'all' ? availableVolume : Math.min(volume, availableVolume);

    if (sellVolume === 0) {
      return `❌ 매도 수량이 0입니다.`;
    }

    // 시세 확인
    const ticker = await client.getMarketPrice(market);
    const estimatedValue = sellVolume * ticker.trade_price;

    // 매도 실행
    const order = await client.sellMarket(market, sellVolume);

    return `✅ 매도 주문 완료:\n\n` +
      `종목: ${market}\n` +
      `수량: ${sellVolume.toFixed(8)}\n` +
      `예상 금액: 약 ${formatKrw(estimatedValue)}\n` +
      `주문 UUID: ${order.uuid}\n\n` +
      `💡 체결 완료까지 수초 소요됩니다.`;
  } catch (error) {
    return `❌ 매도 실패: ${error instanceof Error ? error.message : String(error)}`;
  }
}

/**
 * 메시지 파싱 및 라우팅
 */
export async function handleUpbitCommand(message: string): Promise<string> {
  const msg = message.toLowerCase();

  // 잔고 조회
  if (msg.includes('잔고') || msg.includes('balance') || msg.includes('얼마')) {
    return handleBalanceQuery(message);
  }

  // 시세 조회
  if (msg.includes('시세') || msg.includes('가격') || msg.includes('price')) {
    const coinMatch = message.match(/([가-힣a-zA-Z]+)\s*(시세|가격|price)/);
    if (coinMatch) {
      return handlePriceQuery(coinMatch[1]);
    }
    return '❌ 코인 이름을 찾을 수 없습니다. 예: "비트코인 시세"';
  }

  // 매수
  if (msg.includes('매수') || msg.includes('사') || msg.includes('buy')) {
    const buyMatch = message.match(/([가-힣a-zA-Z]+)\s*([\d,]+)\s*(원|만원)?\s*(어치)?\s*(매수|사)/);
    if (buyMatch) {
      const coin = buyMatch[1];
      let amount = parseInt(buyMatch[2].replace(/,/g, ''));
      if (buyMatch[3] === '만원') {
        amount *= 10000;
      }
      return handleBuy(coin, amount);
    }
    return '❌ 형식 오류. 예: "비트코인 10만원 매수"';
  }

  // 매도
  if (msg.includes('매도') || msg.includes('팔') || msg.includes('sell')) {
    const sellMatch = message.match(/([가-힣a-zA-Z]+)\s*(전부|[\d.]+)?\s*(매도|팔)/);
    if (sellMatch) {
      const coin = sellMatch[1];
      const volume = sellMatch[2] === '전부' ? 'all' : parseFloat(sellMatch[2] || '0');
      return handleSell(coin, volume);
    }
    return '❌ 형식 오류. 예: "비트코인 전부 매도" 또는 "이더 0.1 매도"';
  }

  return '❌ 알 수 없는 명령어입니다.\n\n사용 가능:\n- 잔고 보여줘\n- 비트코인 시세\n- 도지코인 10만원 매수\n- 이더리움 전부 매도';
}
