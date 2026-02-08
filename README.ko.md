# 🪙 OpenClaw Upbit Trading Skill

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-2026.2.6-blue)](https://github.com/openclaw/openclaw)
[![Upbit API](https://img.shields.io/badge/Upbit-API-green)](https://docs.upbit.com)

> 💬 **자연어로 암호화폐 거래하세요!**
> Telegram, Discord, WhatsApp에서 AI와 대화하며 업비트 거래를 수행할 수 있는 OpenClaw 스킬입니다.

[English](./README.md) | **한국어**

---

## 🎯 주요 기능

- 💰 **잔고 조회**: "내 잔고 보여줘" → AI가 실시간 잔고 확인
- 📊 **시세 조회**: "비트코인 시세 알려줘" → 현재가, 변동률, 거래량 제공
- 🛒 **매수**: "도지코인 5만원 매수" → 시장가 자동 매수
- 💸 **매도**: "이더리움 전부 팔아" → 보유량 전체 매도

## 🚀 빠른 시작

### 1. 사전 요구사항

- [OpenClaw](https://github.com/openclaw/openclaw) 설치 및 실행 중
- [Upbit](https://upbit.com) 계정 및 API 키
- Telegram/Discord/WhatsApp 중 하나 이상 연동

### 2. 설치

#### 방법 1: Git Clone (권장)

```bash
cd ~/Desktop
git clone https://github.com/jh941213/openclaw.git
cd openclaw
git checkout feature/upbit-trading
pnpm install
pnpm build
```

#### 방법 2: 수동 복사

OpenClaw 프로젝트에 다음 파일들을 복사:

```
src/
  skills/
    upbit-client.ts
    upbit-manual-tool.ts
  agents/tools/
    upbit-actions.ts
    upbit-tool.ts
    openclaw-tools.ts (수정)
skills/
  upbit-manual-trading/
    SKILL.md
    README.md
```

### 3. Upbit API 키 설정

#### 3.1 API 키 발급

1. [Upbit](https://upbit.com) 로그인
2. **마이페이지** → **Open API 관리** → **API 키 발급**
3. 권한 설정:
   - ✅ **자산 조회** (필수)
   - ✅ **주문 조회** (선택)
   - ✅ **주문하기** (매매하려면 필수)
4. **Access Key**와 **Secret Key** 복사

#### 3.2 OpenClaw에 설정

```bash
# LaunchAgent plist 파일 수정
vim ~/Library/LaunchAgents/ai.openclaw.gateway.plist
```

`<key>EnvironmentVariables</key>` 섹션에 추가:

```xml
<key>UPBIT_ACCESS_KEY</key>
<string>your_access_key_here</string>
<key>UPBIT_SECRET_KEY</key>
<string>your_secret_key_here</string>
```

또는 자동 스크립트 사용:

```bash
/usr/libexec/PlistBuddy -c "Add :EnvironmentVariables:UPBIT_ACCESS_KEY string 'YOUR_KEY'" \
  ~/Library/LaunchAgents/ai.openclaw.gateway.plist

/usr/libexec/PlistBuddy -c "Add :EnvironmentVariables:UPBIT_SECRET_KEY string 'YOUR_SECRET'" \
  ~/Library/LaunchAgents/ai.openclaw.gateway.plist
```

### 4. Gateway 재시작

```bash
cd ~/Desktop/openclaw
pnpm openclaw gateway restart
```

## 💬 사용 예시

### Telegram에서

```
👤 "내 잔고 보여줘"
🤖 💰 업비트 잔고:
   - KRW: 1,250,000원
   - BTC: 0.00523 (약 554,000원)
   - ETH: 0.15 (약 474,000원)

   총 평가액: 2,278,000원

👤 "비트코인 시세"
🤖 📊 KRW-BTC 현재 시세:
   현재가: 106,050,000원
   🔺 전일 대비: +3,450,000원 (+3.36%)
   24시간 거래량: 2,415 BTC

👤 "도지코인 5만원 매수"
🤖 ✅ 매수 주문 완료:
   종목: KRW-DOGE
   주문 금액: 50,000원
   예상 수량: 약 344.82763
   주문 UUID: abc-123-def-456

   💡 체결 완료까지 수초 소요됩니다.

👤 "비트코인 전부 팔아"
🤖 ✅ 매도 주문 완료:
   종목: KRW-BTC
   수량: 0.00523 BTC
   예상 금액: 약 554,000원
```

### 지원하는 명령어

#### 잔고 조회
```
"내 잔고 보여줘"
"BTC 얼마 있어?"
"my wallet balance"
"이더리움 보유량"
```

#### 시세 조회
```
"비트코인 시세"
"도지코인 얼마야?"
"이더리움 가격 알려줘"
"BTC price"
```

#### 매수
```
"비트코인 10만원 매수"
"도지 5만원어치 사줘"
"이더리움 20만원 시장가 매수"
"buy 100000 KRW worth of BTC"
```

#### 매도
```
"비트코인 전부 팔아"
"도지 0.5 매도"
"이더리움 절반 매도"
"sell all ETH"
```

## 🏗️ 아키텍처

```
┌─────────────────────────────────────────────┐
│  Telegram / Discord / WhatsApp              │
│  "비트코인 10만원 매수"                      │
└────────────────┬────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────┐
│  OpenClaw AI Agent (Claude/GPT)             │
│  - 자연어 이해                               │
│  - 의도 파악                                 │
│  - upbit_trading 도구 호출                  │
└────────────────┬────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────┐
│  Upbit Client (upbit-client.ts)             │
│  - JWT HS256 인증                           │
│  - REST API 호출                            │
│  - 잔고/시세/주문 관리                       │
└────────────────┬────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────┐
│  Upbit API (api.upbit.com)                  │
│  - 실시간 시세                               │
│  - 계좌 정보                                 │
│  - 주문 체결                                 │
└─────────────────────────────────────────────┘
```

## 🛡️ 보안 및 주의사항

### 보안
- ✅ API 키는 환경 변수로 관리 (코드에 하드코딩 금지)
- ✅ LaunchAgent plist 파일 권한 확인 (600)
- ✅ JWT HS256 서명으로 안전한 인증
- ⚠️ API 키 노출 시 즉시 재발급

### 거래 안전
- 💡 시장가 거래만 지원 (지정가 미지원)
- 💡 업비트 수수료 0.05% 자동 적용
- 💡 최소 주문 금액: 5,000원 이상
- 💡 KRW 마켓만 지원 (BTC/USDT 마켓 미지원)

### 제한사항
- ⏱️ API Rate Limit: 초당 10회, 분당 100회
- 💰 일일 출금 한도: 업비트 설정 참고
- 🔒 API 키 권한에 따라 기능 제한

## 🧪 테스트

```bash
cd ~/Desktop/openclaw

# 환경 변수 설정
export UPBIT_ACCESS_KEY="your_key"
export UPBIT_SECRET_KEY="your_secret"

# 통합 테스트 실행
npx tsx skills/upbit-manual-trading/test-integration.ts
```

**예상 출력**:
```
🧪 Upbit 수동 거래 도구 통합 테스트

1️⃣ 잔고 조회 테스트
💰 업비트 잔고:
- KRW: 1,250,000원
✅ 잔고 조회 성공

2️⃣ 비트코인 시세 조회 테스트
📊 KRW-BTC 현재 시세:
현재가: 106,050,000원
✅ 시세 조회 성공

✨ 통합 테스트 완료!
```

## 🔧 문제 해결

### "Invalid digest" 에러

**원인**: JWT 서명 알고리즘 오류

**해결**:
```bash
# upbit-client.ts가 HS256 사용하는지 확인
grep "createHmac" src/skills/upbit-client.ts
```

### "UPBIT_ACCESS_KEY must be set" 에러

**원인**: 환경 변수 미설정

**해결**:
```bash
# plist 파일 확인
/usr/libexec/PlistBuddy -c "Print :EnvironmentVariables" \
  ~/Library/LaunchAgents/ai.openclaw.gateway.plist

# Gateway 재시작
pnpm openclaw gateway restart
```

### AI가 upbit 도구를 사용하지 않음

**원인**: 도구가 등록되지 않았거나 로드 실패

**해결**:
```bash
# 빌드 재실행
pnpm build

# Gateway 재시작
pnpm openclaw gateway restart

# 로그 확인
tail -f /tmp/openclaw/openclaw-*.log | grep upbit
```

### 매수/매도 실패

**원인**: 잔고 부족, 최소 주문 금액 미달, 마켓 코드 오류

**해결**:
1. 잔고 확인: "내 KRW 잔고"
2. 시세 확인: "비트코인 시세"
3. 최소 금액: 5,000원 이상
4. 마켓 코드: "비트코인", "BTC", "KRW-BTC" 모두 가능

## 📚 관련 문서

- [OpenClaw 공식 문서](https://docs.openclaw.ai)
- [Upbit API 문서](https://docs.upbit.com)
- [OpenClaw GitHub](https://github.com/openclaw/openclaw)
- [이슈 리포트](https://github.com/jh941213/openclaw/issues)

## 🤝 기여하기

버그 리포트, 기능 제안, PR 환영합니다!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License - 자세한 내용은 [LICENSE](LICENSE) 참고

## 👨‍💻 개발자

**김재현 (Jaehyun Kim)**
- GitHub: [@jh941213](https://github.com/jh941213)
- 회사: KTDS

## 🙏 감사의 글

- [OpenClaw Team](https://github.com/openclaw/openclaw) - 훌륭한 AI 플랫폼 제공
- [Upbit](https://upbit.com) - API 제공
- [Anthropic](https://anthropic.com) - Claude AI

---

⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요!

**⚠️ 면책 조항**: 이 도구는 교육 및 개인 사용 목적입니다. 암호화폐 거래는 높은 위험을 수반하며, 투자 손실에 대한 책임은 사용자에게 있습니다.
