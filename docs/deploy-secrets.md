# GitHub Actions 배포 시크릿 목록

`main` 브랜치 자동 배포(`.github/workflows/deploy.yml`)에 필요한 GitHub Repository Secrets 목록:

| Secret 이름 | 필수 여부 | 설명 |
| :--- | :---: | :--- |
| `RPI_HOST` | 배포 시 필수 | Raspberry Pi SSH 호스트 (IP 또는 도메인) |
| `RPI_USER` | 배포 시 필수 | SSH 접속 계정 (예: `dobbymin`) |
| `RPI_SSH_KEY` | 배포 시 필수 | SSH 개인키 (Ed25519 권장) |
| `RPI_PORT` | 선택 | SSH 포트 (기본 `22`) |
| `DISCORD_WEBHOOK_URL` | 선택 | 헬스체크 실패 및 자동 롤백 알림용 Discord Webhook |
| `NEXT_PUBLIC_API_BASE_URL` | 선택 | 공개 웹 클라이언트 API 기준 URL (기본 `https://alkok.dobbymin.cloud`) |
| `NEXT_PUBLIC_SITE_URL` | 선택 | 공개 웹 정규 URL 및 어드민 `NEXT_PUBLIC_WEB_URL` 기본값 (기본 `https://alkok.dobbymin.cloud`) |
| `NEXT_PUBLIC_ADMIN_API_BASE_URL` | 선택 | 어드민 클라이언트 API 기준 URL (기본 `https://admin.dobbymin.cloud`) |
| `NEXT_PUBLIC_ADMIN_SITE_URL` | 선택 | 어드민 정규 URL (기본 `https://admin.dobbymin.cloud`) |

## 멀티 컨테이너 이미지 태그 (`deploy.yml`)
- `alkok-fe-web`: `ghcr.io/<owner>/alkok-fe-web:<sha|latest>` (`127.0.0.1:18101:3000`, `https://alkok.dobbymin.cloud`)
- `alkok-fe-admin`: `ghcr.io/<owner>/alkok-fe-admin:<sha|latest>` (`127.0.0.1:18103:3000`, `https://admin.dobbymin.cloud`, 루트 경로 서빙)
