# 오늘의 테니스 복식 팀 배정

날짜와 참석자 조합을 기준으로 복식 파트너를 자동 배정하는 정적 웹앱입니다. 같은 날짜와 같은 참석자 조합이면 항상 같은 결과가 나오도록 deterministic seed 방식을 사용했습니다.

## 주요 기능

- 날짜 선택
- 9명 참석자 체크박스 선택
- 실력 티어와 rating을 반영한 공정성 기반 복식 팀 배정
- 같은 입력이면 항상 같은 결과가 나오는 seeded deterministic random
- 홀수 인원일 때 1명 대기 처리
- 결과 복사
- URL query param 및 localStorage 기반 상태 유지

## seed 규칙

- seed는 `날짜 + 정렬된 참석자 이름 목록`으로만 생성됩니다.
- 참석자 선택 순서와 상관없이 같은 집합이면 동일한 seed가 만들어집니다.
- 날짜가 바뀌거나 참석자가 한 명이라도 바뀌면 seed도 달라집니다.
- 최종 결과는 공정성 점수가 좋은 후보군 중에서 seeded RNG로 하나를 선택합니다.

## 기술 스택

- React
- TypeScript
- Vite
- Tailwind CSS
- Vitest
- GitHub Pages + GitHub Actions

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 기본 Vite 주소를 열면 됩니다.

## 테스트

```bash
npm run test
```

## 빌드

```bash
npm run build
```

## 배포 방법

이 프로젝트는 GitHub Pages 기준으로 설정되어 있습니다.

1. GitHub 저장소 이름을 `tennis-team-randomizer`로 생성합니다.
2. 원격 저장소를 연결하고 `main` 브랜치로 푸시합니다.
3. GitHub 저장소의 `Settings > Pages`에서 `Build and deployment`가 `GitHub Actions`로 되어 있는지 확인합니다.
4. `main` 브랜치에 푸시되면 `.github/workflows/deploy.yml`이 자동으로 실행되어 배포됩니다.

기본 배포 URL 형식:

```text
https://<github-username>.github.io/tennis-team-randomizer/
```

## 디렉토리 구조

```text
src/
  components/
  data/
  lib/
  App.tsx
  main.tsx
public/
  favicon.svg
.github/
  workflows/
```

## 공정성 배정 로직 요약

- 가능한 모든 pairing 후보를 생성합니다.
- 팀별 rating 합의 표준편차와 최대 편차를 최소화합니다.
- 같은 tier끼리만 묶이거나 extreme한 high-high / low-low 조합에는 페널티를 줍니다.
- 홀수 인원일 때는 대기 인원이 지나치게 한쪽 rating에 치우치지 않도록 약한 페널티를 반영합니다.
- 최적 점수와 매우 가까운 후보군만 eligible set으로 두고, 그 안에서 seeded RNG로 결정합니다.
