# 🏆 Sports Manager

Full-stack tournament management app with live standings calculator. Dockerized for instant deployment.

[![Docker Compose](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker)](https://docs.docker.com/compose/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Postgres](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql)](https://postgresql.org/)

## 🚀 Quick Start (60 seconds)

**Prerequisites**: Docker Desktop

```bash
git clone https://github.com/Marwan123-web/sports-manager.git
cd sports-manager
cp .env.example .env
docker compose up -d --build
# to run test data
docker exec -i sports-manager-salman-db-1 psql -U marwansalman -d sportsclub < seed-test-data.sql
```
