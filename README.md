# API DevOps Demo

![CI/CD](https://img.shields.io/badge/CI%2FCD-passing-27AE60?logo=jenkins&logoColor=white)

![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=nodedotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-K3s-326CE5?logo=kubernetes&logoColor=white)
![Jest](https://img.shields.io/badge/Tests-11%20passing-C21325?logo=jest&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)

> API REST professionnelle déployée automatiquement via un pipeline CI/CD Jenkins sur Kubernetes.

## 🏗️ Architecture

```mermaid
flowchart LR
    Dev(👨‍💻 Développeur) -->|git push| GH(GitHub)
    GH -->|webhook| JK(Jenkins)
    JK -->|npm ci| IN(Install)
    IN -->|eslint| LN(Lint)
    LN -->|jest| TS(Tests)
    TS -->|docker build| DB(Docker Build)
    DB -->|docker push| GR(ghcr.io)
    GR -->|kubectl apply| K8S(Kubernetes K3s)
    K8S -->|2 replicas| AP(🚀 API Live)

    style Dev fill:#4A90D9,color:#fff
    style GH fill:#24292e,color:#fff
    style JK fill:#D33833,color:#fff
    style TS fill:#C21325,color:#fff
    style DB fill:#2496ED,color:#fff
    style GR fill:#24292e,color:#fff
    style K8S fill:#326CE5,color:#fff
    style AP fill:#27AE60,color:#fff
```

## 🛠️ Stack technique

| Composant | Technologie | Rôle |
|---|---|---|
| API REST | Node.js 20 + Express | Serveur HTTP |
| Authentification | JWT + bcrypt | Sécurité |
| Tests | Jest + Supertest | 11 tests, 84% coverage |
| CI/CD | Jenkins Pipeline | Automatisation |
| Containerisation | Docker multi-stage | Packaging |
| Orchestration | Kubernetes K3s | Déploiement |
| Registry | GitHub Container Registry | Stockage images |
| Logs | Winston (JSON structuré) | Observabilité |

## 🔌 Endpoints

| Méthode | Route | Description | Auth |
|---|---|---|---|
| GET | `/api/v1/health` | Health check Kubernetes | ❌ |
| GET | `/api/v1/health/ready` | Readiness probe | ❌ |
| POST | `/api/v1/auth/register` | Créer un compte | ❌ |
| POST | `/api/v1/auth/login` | Login → JWT token | ❌ |
| GET | `/api/v1/users` | Liste utilisateurs | ✅ JWT |
| GET | `/api/v1/users/:id` | Un utilisateur | ✅ JWT |

## 🚀 Lancer en local

```bash
# Installer les dépendances
npm install

# Lancer les tests
npm test

# Démarrer l'API
npm start
```


## 🔄 Pipeline Jenkins

```mermaid
flowchart TD
    A[📥 Checkout\nRécupération GitHub] --> B[📦 Install\nnpm ci]
    B --> C[🔍 Lint\nESLint]
    C --> D[🧪 Tests\nJest - 11 tests - 84% coverage]
    D --> E{Tests OK ?}
    E -->|❌ Échec| F[🚨 Pipeline stoppé\nNotification erreur]
    E -->|✅ Succès| G[🐳 Docker Build\nImage multi-stage]
    G --> H[📤 Docker Push\nghcr.io/edem38/api-devops-demo]
    H --> I[☸️ Deploy K8s\nRolling update 2 replicas]
    I --> J[🔎 Smoke Test\nVérification /health]
    J --> K{Smoke OK ?}
    K -->|❌ Échec| L[⏪ Rollback automatique]
    K -->|✅ Succès| M[🚀 Production live !]

    style A fill:#4A90D9,color:#fff
    style D fill:#C21325,color:#fff
    style E fill:#F39C12,color:#fff
    style F fill:#E74C3C,color:#fff
    style G fill:#2496ED,color:#fff
    style H fill:#24292e,color:#fff
    style I fill:#326CE5,color:#fff
    style K fill:#F39C12,color:#fff
    style L fill:#E74C3C,color:#fff
    style M fill:#27AE60,color:#fff
```
