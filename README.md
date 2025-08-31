# Cloud-Notes-App
Full DevOps Pipeline that walks through the entire lifecycle of Infrastructure engineering of developing, building, and deploying a product

## Fullstack DevOps Starter
Framework:
* Monorepo (frontend React+TS, backend Go, infra Terraform)
* Local dev via Docker Compose (Postgres incl.)
* CI (lint/test/build) + CD (push images, apply Terraform, deploy to AWS ECS Fargate)
* Environment management and secrets layout

---

## Root directory structure
```
cloud-notes/
  README.md
  .gitignore
  docker-compose.yml
  .github/
    workflows/
      ci.yml
      deploy.yml
  backend/
    go.mod
    go.sum
    Dockerfile
    Makefile
    cmd/api/main.go
    internal/http/server.go
    internal/http/handlers.go
    internal/db/db.go
    internal/models/note.go
    internal/auth/jwt.go
  frontend/
    package.json
    tsconfig.json
    vite.config.ts
    Dockerfile
    src/main.tsx
    src/App.tsx
    src/api.ts
    index.html
  infra/
    README.md
    terraform/
      providers.tf
      variables.tf
      outputs.tf
      backend.tf
      
      networking/
        vpc.tf
        security_groups.tf
      database/
        rds_postgres.tf
      ecr/
        repos.tf
      ecs/
        cluster.tf
        task_backend.tf
        task_frontend.tf
        service_backend.tf
        service_frontend.tf
        load_balancer.tf
      
      
```

---

# Cloud App (Monorepo)

A production-style starter with React + Go, Postgres, Docker, GitHub Actions CI/CD, and Terraform to AWS ECS Fargate with an ALB + RDS Postgres.

## Quickstart

1. ** .env set up
   - Create `backend/.env` from the snippet in the backend section.
   - Create `frontend/.env` if needed (optional: `VITE_API_URL=http://localhost:8080`).

2. **Local dev**
```bash
docker compose up --build
```

3. **Run tests**
```
make -C backend test
```

4. **First deploy (AWS)**

   * Install Terraform and AWS CLI.
   * Configure AWS credentials with permission for VPC, RDS, ECS, ECR, IAM, ALB.
   * In `infra/terraform`: `terraform init && terraform apply`.
   * Push to `main` to trigger CI/CD.

## Services

* **frontend** at [http://localhost:5100](http://localhost:5100)
* **backend** at [http://localhost:8088](http://localhost:8088)
* **db** Postgres at localhost:5432 (inside compose network as `db`)

---
## Note:
* Verify backend is running
  Open your browser or run curl:
  ```
  curl http://localhost:1010/health
  ```
  (or whatever health endpoint your Go server exposes).
  - You should see a JSON or plain text response. If getting “connection refused”, it means the backend isn’t binding correctly inside the container.
* Re-run instruction:
Stop existing containers:
```
docker compose down
```
Rebuild everything (to apply changes, dependencies, ports):
```
docker compose up --build
```

## Observability & security

* Add HTTPS: create ACM cert + HTTPS listener; redirect 80→443.
* Secrets: move `JWT_SECRET` & DB credentials to **AWS Secrets Manager**; map via taskDefinition `secrets`. Remove plain envs.
* Logging: ship structured logs to CloudWatch (already enabled), add log retention.
* Metrics: add a `/metrics` endpoint and scrape via AWS Managed Prometheus (optional) or use CloudWatch Container Insights.
* Autoscaling: attach ECS service autoscaling policies on CPU/Memory.
* Migrations: add a migration tool (e.g., `golang-migrate`) and run at container start.


