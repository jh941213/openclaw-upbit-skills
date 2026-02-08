import { Type } from "@sinclair/typebox";
import { loadConfig } from "../../config/config.js";
import { stringEnum } from "../schema/typebox.js";
import { type AnyAgentTool, jsonResult, readStringParam, readNumberParam } from "./common.js";
import { handleUpbitAction } from "./upbit-actions.js";

const UPBIT_ACTIONS = ["balance", "price", "buy", "sell", "command"] as const;

const UpbitToolSchema = Type.Object({
  action: stringEnum(UPBIT_ACTIONS, {
    description: "Upbit action to perform: balance (잔고), price (시세), buy (매수), sell (매도), command (자연어 명령어)",
  }),
  query: Type.Optional(Type.String({ description: "잔고 조회 시 특정 코인 검색어 (선택)" })),
  coinName: Type.Optional(Type.String({ description: "코인 이름 (예: 비트코인, BTC, 도지코인)" })),
  amountKrw: Type.Optional(Type.Number({ description: "매수 금액 (원)" })),
  volume: Type.Optional(
    Type.Union([Type.Number(), Type.Literal("all"), Type.Literal("전부")], {
      description: "매도 수량 또는 'all'/'전부'",
    })
  ),
  message: Type.Optional(
    Type.String({
      description: "자연어 명령어 (예: '비트코인 10만원 매수', '도지코인 전부 매도')",
    })
  ),
});

/**
 * Upbit 수동 거래 도구
 *
 * AI 에이전트가 사용자의 자연어 명령을 이해하고 업비트 거래를 수행합니다.
 *
 * 사용 예시:
 * - "내 잔고 보여줘" → { action: "balance" }
 * - "비트코인 시세 알려줘" → { action: "price", coinName: "비트코인" }
 * - "도지코인 10만원 매수" → { action: "buy", coinName: "도지코인", amountKrw: 100000 }
 * - "이더리움 전부 팔아" → { action: "sell", coinName: "이더리움", volume: "all" }
 * - "비트 5만원어치 사줘" → { action: "command", message: "비트 5만원어치 사줘" }
 */
export function createUpbitTool(): AnyAgentTool {
  return {
    label: "Upbit Trading",
    name: "upbit_trading",
    description:
      "Upbit 암호화폐 수동 거래 도구. 잔고 조회, 시세 확인, 매수/매도를 채팅으로 수행합니다. " +
      "환경변수 UPBIT_ACCESS_KEY와 UPBIT_SECRET_KEY가 필요합니다. " +
      "upbit-rs 스캘핑 엔진과는 완전히 분리된 수동 거래 전용 도구입니다.",
    parameters: UpbitToolSchema,
    execute: async (_toolCallId, args) => {
      const params = args as Record<string, unknown>;
      const cfg = await loadConfig();

      try {
        const result = await handleUpbitAction(params, cfg);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return jsonResult({
          ok: false,
          error: errorMessage,
        });
      }
    },
  };
}
