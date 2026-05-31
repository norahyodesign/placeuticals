# 플라슈티컬즈 웹사이트

플라슈티컬즈 공식 웹사이트 소스코드입니다.

---

## 파일 구조

```
├── index.html           # 홈페이지 (Hero / What We Do / Core Message / Consulting Highlight / Contact)
├── tokens.css           # 디자인 토큰 & 컴포넌트 공유 스타일시트
├── about.html           # 회사소개 탭 페이지 (회사소개·미션 / 조직 구성 / 직책 구조 / 기업부설연구소)
├── consulting.html      # 서비스 — 개발 전략 컨설팅 (5개 서비스 + 프로세스)
├── platform.html        # 서비스 — 연구 플랫폼 (Core Platform / Application / Timeline)
├── support.html         # 고객지원 탭 페이지 (Q&A / Contact Us)
├── privacy.html         # 개인정보처리방침
│
├── serve.sh             # 로컬 서버 실행 스크립트
├── purge-cdn.sh         # jsDelivr CDN 캐시 퍼지 스크립트
├── pre-commit.sh        # 커밋 전 자동 검사 스크립트
├── AGENTS.md            # AI 에이전트 공통 지침
└── doc/
    ├── site-plan.md     # 사이트 기획서 (김진아)
    └── todo.md          # 작업 메모
```

> 모든 섹션(S1~S4)은 `index.html` 안에 완전히 내장되어 있습니다.

---

## 로컬 개발 서버 실행

```bash
./serve.sh
```

브라우저가 자동으로 열립니다: http://localhost:8080/

---

## Pre-commit Hook 설치

커밋 전 HTML 유효성·보안·플레이스홀더를 자동 검사합니다.

```bash
# 최초 1회 설치
cp pre-commit.sh .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

---

## 디자인 시스템

모든 페이지는 `tokens.css`를 공유 스타일시트로 사용합니다.

```html
<link rel="stylesheet" href="tokens.css">
```

주요 디자인 토큰:

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--navy` | `#0E2040` | 주요 진남색 |
| `--accent` | `#2E7CF6` | 주 강조색 (파랑) |
| `--accent2` | `#5BB8F6` | 보조 강조색 |
| `--font` | `'DM Sans'` | 기본 폰트 |
| `--mono` | `'IBM Plex Mono'` | 모노스페이스 폰트 |
| `--max-w` | `1080px` | 최대 너비 |

전체 토큰 및 컴포넌트 클래스는 `AGENTS.md` 참조.

---

## CDN 배포

```bash
git add . && git commit -m "feat: 설명" && git push
./purge-cdn.sh
```

| 항목 | 값 |
|------|-----|
| 리포지토리 | `norahyodesign/placeuticals` |
| CDN URL | `https://cdn.jsdelivr.net/gh/norahyodesign/placeuticals@main/index.html` |
