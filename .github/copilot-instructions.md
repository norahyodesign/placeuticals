# 플라슈티컬즈 AI 에이전트 지침

이 파일은 GitHub Copilot 등 AI 도구가 이 프로젝트를 일관되게 유지·관리하기 위한 공통 지침입니다.

> 동일한 내용이 루트의 `AGENTS.md`에도 존재합니다 (Claude 등 다른 AI 도구용).

---

## 현재 아키텍처

| 파일 | 용도 |
|------|------|
| `index.html` | 메인 사이트 — scroll-snap 섹션 완전 내장, 단독 배포 가능 |
| `tokens.css` | **디자인 시스템** — 모든 서브페이지가 공유하는 토큰·컴포넌트 스타일시트 |
| 서비스 페이지 | *(구조 확정 후 추가)* |
| 통합 페이지 | `about.html` / `support.html` — 탭 스크롤로 서브메뉴 통합 |

---

## index.html 섹션 구조

`index.html`은 scroll-snap 레이아웃으로 아래 섹션을 포함합니다.

| ID | 내용 |
|----|------|
| `#s1` | Hero — 영상/이미지 배경, 타이틀, CTA |
| `#s2` | About — 회사 소개 |
| `#s3` | Services — 서비스 카드 |
| `#s4` | Contact — 문의 CTA, 연락처, 푸터 |

---

## 🎨 디자인 시스템 — tokens.css 사용 규칙

**모든 서브페이지는 반드시 `tokens.css`를 외부 스타일시트로 로드해야 합니다.**

```html
<link rel="stylesheet" href="tokens.css">
```

`tokens.css`에 이미 정의된 스타일을 페이지 내 `<style>` 태그에 중복 작성하지 않습니다.  
페이지 고유 스타일만 인라인 `<style>`에 추가합니다.

### CSS 변수 (디자인 토큰)

```css
/* ── Color ── (dapharm.com 참고) */
--navy:         #0a1a2e   /* 다크 네이비 (히어로·CTA 배경) */
--navy2:        #122040   /* 보조 다크 네이비 */
--accent:       #0079fa   /* 주 강조색 — dapharm 브랜드 블루 */
--accent2:      #6dabff   /* 보조 강조색 (밝은 블루) */
--accent-light: #f0f7ff   /* 강조색 배경 (연한 블루틴트) */
--white:        #fff
--gray-bg:      #fafafa   /* 기본 배경 */
--gray-bg2:     #f8fbff   /* 섹션 alt 배경 (dapharm 연한 블루틴트) */
--text:         #212121   /* 본문 텍스트 */
--text2:        #757575   /* 보조 텍스트 */
--text3:        #878d98   /* 비활성 텍스트 */
--border:       #dbdbdb   /* 테두리 */
--border-light: #ededed   /* 연한 테두리 */
--danger:       #ff5b34   /* 오류/경고 (오렌지-레드) */
--success:      #2e7d32   /* 성공 */

/* ── Radius ── */
--radius:    16px
--radius-sm: 10px
--radius-xs: 6px

/* ── Layout ── */
--nav-h:  60px    /* Nav 높이 */
--tab-h:  60px    /* 탭 Nav 높이 */
--max-w:  1200px  /* 최대 너비 (dapharm: 1200px) */

/* ── Typography ── */
--font: 'Pretendard Variable', 'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic', system-ui, sans-serif
--mono: 'IBM Plex Mono', monospace

/* ── Spacing ── */
--space-xs: 8px
--space-sm: 16px
--space-md: 32px
--space-lg: 64px
--space-xl: 80px

/* ── Shadow ── */
--shadow-xs: 0 1px 6px rgba(0,0,0,.05)
--shadow-sm: 0 2px 12px rgba(0,0,0,.06)
--shadow-md: 0 8px 32px rgba(0,121,250,.10)
--shadow-lg: 0 16px 48px rgba(0,121,250,.16)
--shadow-focus: 0 0 0 4px rgba(0,121,250,.20)

/* ── Transition ── */
--ease: cubic-bezier(.25,.46,.45,.94)
```

### 버튼 클래스

| 클래스 | 용도 |
|--------|------|
| `.btn-primary` | 주요 CTA (파란 pill, 큰 그림자) |
| `.btn-primary-sm` | 작은 주요 버튼 |
| `.btn-ghost` | 어두운 배경 위 (투명 테두리) |
| `.btn-outline` | 밝은 배경 위 (accent 테두리) |
| `.nav-cta` | Nav 우측 상담 신청 버튼 |

### 섹션 공통 클래스

```html
<section class="section">          <!-- 일반 섹션 -->
<section class="section alt">      <!-- 회색 배경 섹션 -->
  <div class="inner">              <!-- 최대폭 제한 wrapper -->
    <div class="section-label">Label</div>
    <h2 class="section-h2">제목 <span>강조</span></h2>
    <p class="section-sub">부제목</p>
  </div>
</section>
```

### 카드 그리드

```html
<!-- 3열 카드 -->
<div class="card-grid-3">
  <div class="card">
    <div class="card-icon"><svg>...</svg></div>
    <div class="card-badge">BADGE</div>
    <h3 class="card-h3">카드 제목</h3>
    <p class="card-desc">설명</p>
    <ul class="card-list">
      <li><svg>체크 아이콘</svg>항목</li>
    </ul>
  </div>
</div>

<!-- 2열 카드 -->
<div class="card-grid-2">
  <div class="str-card">
    <div class="str-icon"><svg>...</svg></div>
    <div>
      <div class="str-h4">제목</div>
      <div class="str-desc">설명</div>
    </div>
  </div>
</div>

<!-- 통계 숫자 카드 (3열) -->
<div class="ov-grid">
  <div class="ov-card">
    <div class="ov-num">GMP<span>·</span></div>
    <div class="ov-label">설명</div>
  </div>
</div>
```

### 프로세스 스텝

```html
<div class="process-list">
  <div class="process-item">
    <div class="process-num">01</div>
    <div class="process-body">
      <div class="process-title">단계 제목</div>
      <div class="process-desc">설명</div>
    </div>
  </div>
</div>
```

### 타임라인 (연혁)

```html
<div class="timeline">
  <div class="tl-item">
    <div class="tl-dot"></div>
    <div class="tl-year">2024</div>
    <div class="tl-desc">주요 사건</div>
    <div class="tl-sub">상세 설명</div>
  </div>
</div>
```

### FAQ 아코디언

```html
<div class="faq-list">
  <div class="faq-item">
    <button class="faq-q">
      질문 텍스트
      <svg class="faq-icon">...</svg>
    </button>
    <div class="faq-a">답변 텍스트</div>
  </div>
</div>
```

### 문의 폼

```html
<div class="form-wrap">
  <div class="form-grid">
    <div class="form-group">
      <label class="form-label">이름 <span class="required-mark">*</span></label>
      <input class="form-input" type="text">
    </div>
    <div class="form-group full">
      <label class="form-label">문의 내용</label>
      <textarea class="form-textarea"></textarea>
    </div>
  </div>
</div>
```

### CTA 섹션 (다크 배경)

```html
<section class="cta-section">
  <div class="cta-inner">
    <div class="cta-label">Contact Us</div>
    <h2>제목<br><span>강조</span></h2>
    <p>설명</p>
    <div class="cta-btns">
      <a href="support.html#contact" class="btn-primary">문의하기 →</a>
      <a href="mailto:contact@placeuticals.co.kr" class="btn-ghost">이메일 →</a>
    </div>
  </div>
</section>
```

---

## 📄 페이지 유형과 템플릿

### 유형 A — 서비스 상세 페이지 (독립 파일)

`cdmo.html`, `cell-management.html`, `cell-facility.html`처럼 단일 서비스를 상세 설명하는 페이지.

**구조 순서:**
1. Nav (로고 + `← 서비스 목록` 백버튼 + `상담 신청` CTA)
2. `.page-hero` — 다크 배경 히어로
3. `.section` — Overview (`.ov-grid` 통계)
4. `.section.alt` — 서비스 상세 (`.card-grid-3` 또는 `.card-grid-2`)
5. `.section` — Process (`.process-list`)
6. `.section.alt` — 강점/차별점 (`.card-grid-2` + `.str-card`)
7. `.cta-section` — CTA
8. `.page-footer`

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>페이지 제목 | 플라슈티컬즈</title>
  <link rel="stylesheet" as="style" crossorigin href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">
  <link rel="stylesheet" href="tokens.css">
<style>
/* 페이지 고유 스타일만 여기에 */
</style>
</head>
<body>
<nav id="plt-nav">
  <div class="nav-inner">
    <a href="index.html" class="nav-logo"><!-- 로고 SVG -->Placeuticals</a>
    <a href="index.html#s3" class="nav-back">← 서비스 목록</a>
    <a href="support.html#contact" class="nav-cta">상담 신청</a>
  </div>
</nav>
<div class="page-wrap">
  <section class="page-hero">...</section>
  <!-- 섹션들 -->
  <section class="cta-section">...</section>
  <footer class="page-footer">
    <div class="footer-copy">© 2026 Placeuticals. All rights reserved.</div>
    <div class="footer-links"><a href="#">개인정보처리방침</a><a href="#">이용약관</a></div>
  </footer>
</div>
</body>
</html>
```

### 유형 B — 통합 탭 페이지

`about.html`, `support.html`처럼 서브메뉴를 하나의 파일에 탭 스크롤로 통합하는 페이지.

**추가 요소:**
- `.tab-nav` — Nav 바로 아래 sticky 탭 바
- 각 섹션에 `id="탭이름"` + `class="tab-section section tab-offset"` 적용
- `IntersectionObserver`로 스크롤 시 탭 자동 활성화 (하단 JS 스니펫 참고)

```html
<!-- TAB NAV -->
<nav class="tab-nav" id="page-tabs">
  <div class="tab-nav-inner">
    <a href="#section1" class="tab-item active" data-target="section1">탭 1</a>
    <a href="#section2" class="tab-item"        data-target="section2">탭 2</a>
  </div>
</nav>

<!-- 섹션 -->
<section id="section1" class="tab-section section tab-offset">...</section>
<section id="section2" class="tab-section section alt tab-offset">...</section>

<!-- JS -->
<script>
(function() {
  const sections = document.querySelectorAll('.tab-section');
  const tabs     = document.querySelectorAll('#page-tabs .tab-item');
  const activate = (id) => tabs.forEach(t => t.classList.toggle('active', t.dataset.target === id));
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => { if (e.isIntersecting) activate(e.target.id); }),
    { rootMargin: `-${60 + 60 + 8}px 0px -45% 0px`, threshold: 0 }
  );
  sections.forEach(s => observer.observe(s));
  tabs.forEach(tab => tab.addEventListener('click', () => activate(tab.dataset.target)));
})();
</script>
```

---

## Nav 로고 공통 SVG

모든 페이지에서 아래 동일한 로고 마크업을 사용합니다.

```html
<a href="index.html" class="nav-logo">
  <div class="nav-logo-icon">
    <svg viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="white"/></svg>
  </div>
  Placeuticals
</a>
```

체크 아이콘 (카드 리스트 항목용):
```html
<svg viewBox="0 0 16 16" fill="none"><path d="M13.25 4.75L6 12 2.75 8.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
```

---

## Nav 메뉴 링크 현황

> *(페이지 구조 확정 후 채워주세요)*

| 메뉴 | 서브메뉴 | 링크 |
|------|---------|------|
| 회사소개 | 인사말 | `about.html#greeting` |
| | 회사소개 | `about.html#company` |
| | 오시는길 | `about.html#location` |
| 서비스 | *(TBD)* | *(TBD)* |
| 고객지원 | Q&A | `support.html#qna` |
| | Contact Us | `support.html#contact` |

---

## 파일 구조 변경 시 업데이트 체크리스트

파일을 **추가·삭제·이름 변경**할 때 아래 문서들을 함께 업데이트합니다.

| 문서 | 업데이트 내용 |
|------|--------------|
| `README.md` | `## 파일 구조` 트리에 항목 추가/제거 |
| `AGENTS.md` | `## 파일 목록 (현행)` 표에 항목 추가/제거 |
| `.github/copilot-instructions.md` | `## 파일 목록 (현행)` 표에 항목 추가/제거 |
| `purge-cdn.sh` | `FILES=(` 배열에 HTML/CSS 파일 추가/제거 |

> **자율 탐색 원칙**: 작업 전 워크스페이스를 탐색하여 관련 파일을 직접 찾아 함께 업데이트하세요.

---

## TODO 체크리스트 관리

파일: `doc/todo.md`

> **에이전트 지시**: 사용자가 작업을 요청하면 **다음 지침을 따릅니다.**

### 작업 시작 전
1. `doc/todo.md` 를 읽어 **미완료 항목** 파악
2. 작업 항목과 연관된 TODO가 있으면 해당 줄을 사용자에게 알림

### 작업 완료 후
1. `doc/todo.md` 에서 해당 항목을 `- [ ]` → `- [x]` 로 변경
2. 커밋 메시지에 `todo: 항목명` 형식으로 언급

### TODO 신규 추가 시
- 사용자가 새 작업을 요청하면 `doc/todo.md` 의 적절한 카테고리 아래에 항목 추가
- 커미트 메시지: `docs: todo 업데이트`

---

## 수정 흐름

```
파일 편집
  → ./serve.sh 로 로컬 확인 (http://localhost:8080/)
  → pre-commit 검사 실행 (아래 참조)
  → git add . && git commit && git push
  → ./purge-cdn.sh 실행
  → http://localhost:8080/test-cdn.html 에서 CDN 확인
```

---

## 필수 점검 절차 (Git 코드 반영 시 자동 실행)

> **에이전트 지시**: 사용자가 `push해줘`, `배포해`, `commit해`, `올려줘` 등을 요청하면 **다음 순서를 반드시 지켜야 합니다.**

### Step 1 — pre-commit 검사 실행

```bash
bash pre-commit.sh
```

| 검사 항목 | 실패 시 |
|----------|-------|
| HTML 유효성 (`html-validate`) | 코드 수정 후 재시도 |
| `target="_blank"` rel 누락 | 코드 수정 후 재시도 |
| `console.log` 잔재 | 코드 수정 후 재시도 |
| 플레이스홀더 (홍길동, 000-0000 등) | 경고만 (진행 가능) |
| `href="#"` 미연결 링크 | 경고만 (진행 가능) |

❌ 검사가 **코드 수정 후 재시도** 항목에서 실패하면:
1. 에이전트가 직접 해당 코드를 수정합니다.
2. pre-commit 검사를 다시 실행합니다.
3. 통과 후 코미을 진행합니다.

### Step 2 — 코미 & 푸시

```bash
git add .
git commit -m "<타입>: <설명>"
git push
```

**코미 메시지 타입**:

| 타입 | 사용 시점 |
|------|----------|
| `feat:` | 새 기능/콘텐츠 추가 |
| `fix:` | 버그/링크/데이터 수정 |
| `style:` | 디자인 변경 (로직 없음) |
| `perf:` | 성능 개선 |
| `chore:` | 빌드/설정/도구 변경 |
| `refactor:` | 코드 정리 (기능 변경 없음) |

### Step 3 — CDN 퍼지

```bash
./purge-cdn.sh
```

HTML 또는 CSS 파일을 변경한 이후에만 필요합니다.

---

## CDN 정보

| 항목 | 값 |
|------|-----|
| 리포지토리 | `norahyodesign/placeuticals` |
| 브랜치 | `main` |
| CDN URL | `https://cdn.jsdelivr.net/gh/norahyodesign/placeuticals@main/index.html` |
| Purge URL | `https://purge.jsdelivr.net/gh/norahyodesign/placeuticals@main/index.html` |

---

## 파일 목록 (현행)

| 파일 | 설명 |
|------|------|
| `index.html` | 홈페이지 (Hero / What We Do / Core Message / Consulting Highlight / Contact) |
| `tokens.css` | 디자인 토큰 & 컴포넌트 공유 스타일시트 |
| `about.html` | 회사소개 탭 페이지 (회사소개·미션 / 조직 구성 / 직책 구조 / 기업부설연구소) |
| `consulting.html` | 서비스 — 개발 전략 컨설팅 (5개 서비스 + 프로세스) |
| `platform.html` | 서비스 — 연구 플랫폼 (Core Platform / Application / Timeline) |
| `support.html` | 고객지원 탭 페이지 (Q&A / Contact Us) |
| `privacy.html` | 개인정보처리방침 |
| `serve.sh` | 로컬 서버 실행 |
| `pre-commit.sh` | 커밋 전 자동 검사 |
| `purge-cdn.sh` | CDN 캐시 퍼지 |
| `AGENTS.md` | AI 에이전트 공통 지침 (Claude용) |
| `README.md` | 프로젝트 문서 |
| `doc/` | 디자인 가이드, 기획 문서, TODO 등 |
