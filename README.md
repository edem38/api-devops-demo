# API DevOps Demo

[![Build Status](http://84.46.240.125:8080/buildStatus/icon?job=api-devops-demo)](http://84.46.240.125:8080/job/api-devops-demo/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/Docker-ready-blue)](https://docker.com)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-K3s-blue)](https://k3s.io)

## Stack technique

| Composant | Technologie |
|---|---|
| API REST | Node.js + Express + JWT |
| Tests | Jest (11 tests, 84% coverage) |
| CI/CD | Jenkins Pipeline |
| Containerisation | Docker multi-stage |
| Orchestration | Kubernetes K3s |
| Registry | GitHub Container Registry (ghcr.io) |

## Pipeline CI/CD 

Git Push → Checkout → Install → Lint → Tests → Docker Build → Push ghcr.io → Deploy K8s → Smoke Test

## Endpoints

| Méthode | Route | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/health` | Health check Kubernetes | ❌ |
| GET | `/api/v1/health/ready` | Readiness probe | ❌ |
| POST | `/api/v1/auth/register` | Créer un compte | ❌ |
| POST | `/api/v1/auth/login` | Login → JWT token | ❌ |
| GET | `/api/v1/users` | Liste utilisateurs | ✅ JWT |
| GET | `/api/v1/users/:id` | Un utilisateur | ✅ JWT |

## Lancer en local

```bash
# Installer les dépendances
npm install

# Lancer les tests
npm test

# Démarrer l'API
npm start
```

## Architecture

┌─────────┐    push     ┌─────────┐    build    ┌─────────┐
│ GitHub  │ ──────────► │ Jenkins │ ──────────► │  Docker │
└─────────┘             └─────────┘             └─────────┘
│ push
▼
┌─────────────┐  deploy  ┌─────────────┐       ┌─────────┐
│ Kubernetes  │ ◄─────── │   Jenkins   │       │ ghcr.io │
│   (K3s)     │          └─────────────┘       └─────────┘
└─────────────┘

