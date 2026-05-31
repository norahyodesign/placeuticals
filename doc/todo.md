# 작업 TODO / 기능 개발 계획

> 에이전트는 작업 시작 전 이 파일을 읽고, 완료 시 해당 항목을 `[x]`로 업데이트합니다.

---

## 🔴 콘텐츠 — 실제 정보 입력 필요

- [x] 대표이사 실명 입력
- [x] 본사 주소 입력
- [ ] 대표 전화번호 입력
- [ ] 이메일 주소 확정 및 입력

---

## 🟡 페이지 생성

- [x] `index.html` — 홈페이지 (Hero / What We Do / Core Message / Consulting Highlight / Contact)
- [x] `about.html` — 회사소개 탭 페이지 (회사소개·미션 / 조직 구성 / 직책 구조 / 기업부설연구소)
- [x] `consulting.html` — 서비스: 개발 전략 컨설팅 (5개 서비스 + 프로세스)
- [x] `platform.html` — 서비스: 연구 플랫폼 (Core Platform / Application / Timeline)
- [x] `support.html` — 고객지원 탭 페이지 (Q&A / Contact Us)
- [x] 개인정보처리방침 페이지
- [ ] 이용약관 페이지

---

## 🟡 SEO

- [ ] favicon.svg 생성 및 연결
- [ ] robots.txt / sitemap.xml 생성
- [ ] meta description 전 파일
- [ ] og:image 대표 이미지 추가
- [ ] Google Search Console 등록

---

## 🔵 인프라

- [ ] GitHub 리포지토리 생성 (`norahyodesign/placeuticals`)
- [ ] CDN URL 확정 및 purge-cdn.sh 검증
- [ ] pre-commit hook 설치 (`cp pre-commit.sh .git/hooks/pre-commit`)

---

## ✅ 완료

- [x] 개발 환경 구성 (serve.sh, pre-commit.sh, .gitignore, .htmlvalidate.json)
- [x] 디자인 시스템 구축 (tokens.css)
- [x] AGENTS.md / copilot-instructions.md 설정
- [x] README.md 작성
- [x] purge-cdn.sh 작성
