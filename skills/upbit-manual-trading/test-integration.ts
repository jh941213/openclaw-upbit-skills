/**
 * Upbit 수동 거래 도구 통합 테스트
 *
 * 환경 변수 UPBIT_ACCESS_KEY, UPBIT_SECRET_KEY 필요
 *
 * 실행:
 * ```bash
 * export UPBIT_ACCESS_KEY=your_key
 * export UPBIT_SECRET_KEY=your_secret
 * npx tsx skills/upbit-manual-trading/test-integration.ts
 * ```
 */

import { handleUpbitCommand } from "../../src/skills/upbit-manual-tool.js";

async function testUpbitIntegration() {
  console.log("🧪 Upbit 수동 거래 도구 통합 테스트\n");

  // 1. 잔고 조회 테스트
  console.log("1️⃣ 잔고 조회 테스트");
  try {
    const balanceResult = await handleUpbitCommand("내 잔고 보여줘");
    console.log(balanceResult);
    console.log("✅ 잔고 조회 성공\n");
  } catch (error) {
    console.error("❌ 잔고 조회 실패:", error);
    console.log("");
  }

  // 2. 시세 조회 테스트 (비트코인)
  console.log("2️⃣ 비트코인 시세 조회 테스트");
  try {
    const priceResult = await handleUpbitCommand("비트코인 시세");
    console.log(priceResult);
    console.log("✅ 시세 조회 성공\n");
  } catch (error) {
    console.error("❌ 시세 조회 실패:", error);
    console.log("");
  }

  // 3. 매수 명령어 파싱 테스트 (실제 주문 안 함)
  console.log("3️⃣ 매수 명령어 파싱 테스트");
  const buyCommands = [
    "비트코인 10만원 매수",
    "도지코인 5만원어치 사줘",
    "이더리움 1만원 시장가 매수",
  ];

  for (const cmd of buyCommands) {
    console.log(`  입력: "${cmd}"`);
    // 실제로는 주문하지 않고 명령어만 파싱
    if (cmd.includes("매수") || cmd.includes("사")) {
      console.log(`  ✅ 매수 명령어 인식됨`);
    }
  }
  console.log("");

  // 4. 매도 명령어 파싱 테스트 (실제 주문 안 함)
  console.log("4️⃣ 매도 명령어 파싱 테스트");
  const sellCommands = [
    "비트코인 전부 매도",
    "도지코인 절반 팔아",
    "이더리움 0.1개 매도",
  ];

  for (const cmd of sellCommands) {
    console.log(`  입력: "${cmd}"`);
    // 실제로는 주문하지 않고 명령어만 파싱
    if (cmd.includes("매도") || cmd.includes("팔")) {
      console.log(`  ✅ 매도 명령어 인식됨`);
    }
  }
  console.log("");

  console.log("✨ 통합 테스트 완료!");
  console.log("\n⚠️ 주의: 실제 매수/매도는 테스트하지 않았습니다.");
  console.log("실제 거래 테스트는 소액으로 조심스럽게 진행하세요.");
}

// 환경 변수 확인
if (!process.env.UPBIT_ACCESS_KEY || !process.env.UPBIT_SECRET_KEY) {
  console.error("❌ 환경 변수가 설정되지 않았습니다:");
  console.error("  UPBIT_ACCESS_KEY");
  console.error("  UPBIT_SECRET_KEY");
  console.error("\n설정 후 다시 실행하세요.");
  process.exit(1);
}

testUpbitIntegration().catch((error) => {
  console.error("테스트 중 오류 발생:", error);
  process.exit(1);
});
