# 작업 TODO / 기능 개발 계획

> 에이전트는 작업 시작 전 이 파일을 읽고, 완료 시 해당 항목을 `[x]`로 업데이트합니다.

---

## 🔴 콘텐츠 — 실제 정보 입력 필요

- [ ] 대표이사 실명 입력
- [ ] 본사 주소 입력
- [ ] 대표 전화번호 입력
- [ ] 이메일 주소 확정 및 입력

---

## 🟡 페이지 생성

- [x] `index.html` — 메인 페이지 (8섹션 단일 파일)
- [ ] `about.html` — 회사소개 통합 페이지
- [ ] `support.html` — 고객지원 통합 페이지 (Q&A / Contact Us)
- [ ] 서비스 상세 페이지 (서비스 구조 확정 후 생성)
- [ ] 개인정보처리방침 페이지
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
