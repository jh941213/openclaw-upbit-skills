import type { AgentToolResult } from "@mariozechner/pi-agent-core";
import type { OpenClawConfig } from "../../config/config.js";
import {
  handleBalanceQuery,
  handlePriceQuery,
  handleBuy,
  handleSell,
  handleUpbitCommand,
} from "../../skills/upbit-manual-tool.js";
import { jsonResult, readStringParam, readNumberParam } from "./common.js";

/**
 * Upbit 수동 거래 액션 핸들러
 *
 * 지원하는 액션:
 * - balance: 잔고 조회
 * - price: 시세 조회
 * - buy: 매수
 * - sell: 매도
 * - command: 자연어 명령어 파싱
 */
export async function handleUpbitAction(
  params: Record<string, unknown>,
  cfg: OpenClawConfig,
): Promise<AgentToolResult<unknown>> {
  const action = readStringParam(params, "action", { required: true });

  // 환경변수 확인
  if (!process.env.UPBIT_ACCESS_KEY || !process.env.UPBIT_SECRET_KEY) {
    throw new Error(
      "UPBIT_ACCESS_KEY and UPBIT_SECRET_KEY must be set in environment variables"
    );
  }

  if (action === "balance") {
    const query = readStringParam(params, "query") || "";
    const result = await handleBalanceQuery(query);
    return jsonResult({ ok: true, message: result });
  }

  if (action === "price") {
    const coinName = readStringParam(params, "coinName", { required: true });
    const result = await handlePriceQuery(coinName);
    return jsonResult({ ok: true, message: result });
  }

  if (action === "buy") {
    const coinName = readStringParam(params, "coinName", { required: true });
    const amountKrw = readNumberParam(params, "amountKrw", { required: true });

    if (!amountKrw || amountKrw <= 0) {
      throw new Error("매수 금액은 0보다 커야 합니다");
    }

    const result = await handleBuy(coinName, amountKrw);
    return jsonResult({ ok: true, message: result });
  }

  if (action === "sell") {
    const coinName = readStringParam(params, "coinName", { required: true });
    const volumeStr = readStringParam(params, "volume");

    let volume: number | 'all';
    if (volumeStr === 'all' || volumeStr === '전부') {
      volume = 'all';
    } else {
      const parsed = readNumberParam(params, "volume", { required: true });
      if (!parsed || parsed <= 0) {
        throw new Error("매도 수량은 0보다 커야 합니다");
      }
      volume = parsed;
    }

    const result = await handleSell(coinName, volume);
    return jsonResult({ ok: true, message: result });
  }

  if (action === "command") {
    const message = readStringParam(params, "message", { required: true });
    const result = await handleUpbitCommand(message);
    return jsonResult({ ok: true, message: result });
  }

  throw new Error(`Unsupported Upbit action: ${action}`);
}
