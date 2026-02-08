---
name: upbit-manual-trading
description: "Manual Upbit trading via chat. Check balance, view prices, buy/sell crypto manually."
metadata:
  openclaw:
    emoji: "💰"
    tags: ["trading", "upbit", "crypto", "manual"]
    requires:
      env: ["UPBIT_ACCESS_KEY", "UPBIT_SECRET_KEY"]
---

# Upbit Manual Trading Skill

텔레그램/Discord 채팅으로 업비트 수동 거래를 할 수 있습니다.

## ⚠️ 중요

- **upbit-rs 스캘핑 엔진과 완전히 분리됨**
- upbit-rs: 자동 스캘핑 전용
- OpenClaw: 수동 거래 전용
- 같은 API 키 사용 가능

## 사용 가능한 명령어

### 1. 잔고 조회
```
"내 잔고 보여줘"
"BTC 얼마 있어?"
"KRW 얼마 있어?"
```

**응답 예시**:
```
💰 업비트 잔고:
- KRW: 1,250,000원
- BTC: 0.00523 (약 554,000원)
- ETH: 0.15 (약 474,000원)

총 평가액: 2,278,000원
```

### 2. 시세 조회
```
"비트코인 시세 알려줘"
"도지코인 얼마야?"
"이더리움 가격"
```

**응답 예시**:
```
📊 KRW-BTC 현재 시세:
- 현재가: 106,050,000원
- 전일 대비: +3,450,000원 (+3.36%)
- 24시간 거래량: 2,415 BTC
- 24시간 거래대금: 2,512억원
```

### 3. 매수
```
"비트코인 10만원어치 사줘"
"도지 5만원 매수"
"이더리움 20만원 시장가 매수"
```

**응답 예시**:
```
✅ 매수 완료:
- 종목: KRW-BTC
- 수량: 0.00094 BTC
- 평균가: 106,050,000원
- 총 금액: 99,747원 (수수료 포함)

잔고:
- KRW: 1,150,253원
- BTC: 0.00617 BTC
```

### 4. 매도
```
"비트코인 전부 팔아"
"도지 절반 매도"
"이더 0.1개 매도"
```

**응답 예시**:
```
✅ 매도 완료:
- 종목: KRW-BTC
- 수량: 0.00617 BTC
- 평균가: 106,100,000원
- 총 금액: 654,637원 (수수료 제외)

잔고:
- KRW: 1,804,890원
- BTC: 0 BTC
```

## 설치 및 설정

### 1. 환경 변수 설정

```bash
# ~/.openclaw/.env 파일에 추가
export UPBIT_ACCESS_KEY=your_access_key_here
export UPBIT_SECRET_KEY=your_secret_key_here
```

### 2. OpenClaw 재시작

```bash
# 환경 변수 적용을 위해 OpenClaw 재시작
openclaw gateway stop
openclaw gateway start
```

### 3. 사용 가능 확인

OpenClaw가 시작되면 AI 에이전트가 자동으로 `upbit_trading` 도구를 사용할 수 있습니다.
텔레그램이나 Discord에서 "내 잔고 보여줘"라고 입력하면 AI가 자동으로 업비트 API를 호출합니다.

## 안전 장치

1. **확인 요청**: 10만원 이상 거래 시 확인 요청
2. **일일 한도**: 하루 최대 거래 금액 설정 가능
3. **거래 로그**: 모든 거래 자동 기록
4. **시장가 전용**: 현재 시장가 거래만 지원

## 주의사항

- API 키는 절대 커밋하지 말 것
- 거래 전 항상 시세 확인
- 수수료 0.05% 자동 계산
- KRW 마켓만 지원 (BTC/USDT 마켓 미지원)

## upbit-rs와 차이점

| 항목 | upbit-rs | OpenClaw |
|------|----------|----------|
| 목적 | 자동 스캘핑 | 수동 거래 |
| 방식 | WebSocket 실시간 | REST API 호출 |
| 거래 | 자동/AI 판단 | 채팅 명령어 |
| 속도 | 밀리초 단위 | 초 단위 |
| 용도 | 단타 매매 | 일반 매매 |
