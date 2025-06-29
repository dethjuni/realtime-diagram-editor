# 실시간 협업 다이어그램 편집기

본 프로젝트는 React + Node.js + Socket.io 기반의 실시간 협업 다이어그램 편집기입니다.  
여러 사용자가 동시에 다이어그램을 작성하고 편집할 수 있으며, 서버에 상태가 저장됩니다.

## 🖥 개발 환경
- OS: Windows 11 Home
- 에디터: Visual Studio Code
- 브라우저: Chrome
- Node.js: v14 이상


## ⚙ 실행 방법

### 1️⃣ 서버 실행 (bash)
cd server
npm install
node index.js
서버는 http://localhost:4000 에서 실행됩니다.

### 2️⃣ 클라이언트 실행 (bash)
cd client
npm install
npm start
React 앱은 기본적으로 http://localhost:3000 에서 실행됩니다.


## 🚀 주요 기능
- 브라우저에서 다이어그램 생성 및 편집
- 사각형과 선 추가
- 사각형과 선의 마우스 드래그 이동
- 여러 사용자가 동시에 편집 가능 (실시간 동기화)
- 다이어그램 상태 서버에 JSON 파일로 저장
- 새로고침 및 재접속 시 상태 유지

## 📂 프로젝트 구조
realtime-diagram-editor/
├── client/         # React 애플리케이션
├── server/         # Node.js + Socket.io 서버
├── README.md       # 본 문서
├── DESIGN.md       # 설계 문서

## 💡 개선 및 추가 기능 (선택)
- 서버 다이어그램 상태 JSON 파일 저장 기능
- 선택 도형 삭제 기능
