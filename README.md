# sample-app-heal-demo

A sample Node.js Express app with **deliberate bugs** designed to demonstrate the [Auto-Heal CI Agent](https://github.com/sidlabs-platform/Auto-Heal-CI-Agent) GitHub Action. When CI fails, the auto-heal agent diagnoses the failure, generates an AI-powered fix, and opens a pull request — all automatically.

---

## What's in the App

A simple Task Manager REST API built with Express:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/tasks` | GET | List all tasks |
| `/tasks` | POST | Create a task (`{ "title": "..." }`) |
| `/tasks/:id` | GET | Get a task by ID |
| `/tasks/:id` | PUT | Update a task |
| `/tasks/:id` | DELETE | Delete a task |

### Stack

- **Runtime:** Node.js 20
- **Framework:** Express 5
- **Tests:** Jest 30 + supertest
- **Linter:** ESLint 9 (flat config)

---

## Deliberate Bugs

The app contains intentional issues that cause CI to fail, so the auto-heal agent can demonstrate its fix capabilities:

### 1. Lint violations — `var` usage

In [src/app.js](src/app.js), lines 27–28 use `var` instead of `const`/`let`:

```js
var { title } = req.body;
// ...
var task = { id: nextId++, title: title.trim(), completed: false };
```

The ESLint config ([eslint.config.js](eslint.config.js)) enforces `no-var: "error"`, so `npm run lint` fails.

### 2. Wrong HTTP status code

In [src/app.js](src/app.js), line 31 returns status `200` for task creation:

```js
res.status(200).json(task);
```

The test ([tests/app.test.js](tests/app.test.js)) correctly expects `201 Created`, so `npm test` fails.

### What the auto-heal agent does

1. **Lint handler** detects the `no-var` lint violations and generates a fix (replace `var` with `const`)
2. **Test handler** detects the status code mismatch and generates a fix (change `200` to `201`)
3. The agent commits the fixes and opens a PR

---

## CI Workflows

Two workflow configurations are included, each using a different AI backend:

### 1. `ci.yml` — Copilot Agent backend

**Trigger:** push/PR to `main`, or manual dispatch

Uses the `copilot-agent` backend, which creates a GitHub Issue describing the failure and assigns the Copilot coding agent to generate a fix PR.

```yaml
- uses: sidlabs-platform/Auto-Heal-CI-Agent@feature/github-action-ghes
  with:
    backend: copilot-agent
    language: node
    log-file: ci-output.log
    commit-mode: pr
    max-attempts: 2
  env:
    GH_TOKEN: ${{ secrets.GH_PAT }}
```

### 2. `ci-copilot-cli.yml` — Copilot CLI backend

**Trigger:** manual dispatch only (`workflow_dispatch`)

Uses the `copilot-cli` backend, which calls the GitHub Models API directly to generate fixes and applies them locally.

```yaml
- uses: sidlabs-platform/Auto-Heal-CI-Agent@feature/github-action-ghes
  with:
    backend: copilot-cli
    language: node
    log-file: ci-output.log
    commit-mode: pr
    max-attempts: 2
    copilot-cli-model: gpt-4o
  env:
    GH_TOKEN: ${{ secrets.GH_PAT }}
```

### CI Pipeline Flow

Both workflows follow the same structure:

```
build-and-test job              auto-heal job (runs on failure)
┌─────────────────────┐         ┌──────────────────────────────┐
│ 1. Checkout          │         │ 1. Checkout                   │
│ 2. npm ci            │         │ 2. Download CI artifacts      │
│ 3. npm run lint      │──fail──▶│ 3. Run Auto-Heal CI Agent     │
│ 4. npm test          │         │    → Diagnose failure         │
│ 5. Upload artifacts  │         │    → Generate AI fix          │
│    (on failure)      │         │    → Open PR with fix         │
└─────────────────────┘         └──────────────────────────────┘
```

---

## How to Use This Demo

### 1. Fork the repository

Fork [sample-app-heal-demo](https://github.com/sidlabs-platform/sample-app-heal-demo) to your own GitHub account.

### 2. Create a Personal Access Token (PAT)

Create a **fine-grained PAT** or classic PAT with these scopes:

- `repo` (full control)
- `issues:write` (for copilot-agent backend)
- `pull-requests:write`

For the `copilot-agent` backend, the PAT owner must have access to GitHub Copilot.

### 3. Add the PAT as a repository secret

Go to **Settings → Secrets and variables → Actions** and add:

| Secret name | Value |
|-------------|-------|
| `GH_PAT` | Your Personal Access Token |

### 4. Trigger a CI run

**Option A — Push to main:**
The `ci.yml` workflow runs automatically on push. Since the deliberate bugs are present, CI will fail and trigger the auto-heal job.

**Option B — Manual dispatch:**
Go to **Actions → CI Pipeline (Copilot CLI) → Run workflow** to test the copilot-cli backend.

### 5. Watch the healing

1. The `build-and-test` job fails (lint errors + test failure)
2. The `auto-heal` job starts automatically
3. The agent diagnoses the failures and generates fixes
4. A pull request appears with the corrected code

---

## Local Development

```bash
# Install dependencies
npm install

# Run the app
npm start             # Starts on port 3000

# Run tests (will fail due to deliberate bugs)
npm test

# Run linter (will fail due to deliberate bugs)
npm run lint

# Generate diagnostic JSON (used by heal agent)
npm run lint:json     # Outputs lint-output.json
npm run test:json     # Outputs test-results.json
```

---

## npm Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start the Express server on port 3000 |
| `npm test` | Run Jest tests with verbose output |
| `npm run lint` | Run ESLint on `src/` and `tests/` |
| `npm run lint:json` | Run ESLint with JSON output (for heal agent) |
| `npm run test:json` | Run Jest with JSON output (for heal agent) |

---

## Related

- [Auto-Heal CI Agent](https://github.com/sidlabs-platform/Auto-Heal-CI-Agent) — the GitHub Action / engine
- [SETUP-GUIDE.md](https://github.com/sidlabs-platform/Auto-Heal-CI-Agent/blob/main/SETUP-GUIDE.md) — full setup instructions
- [ARCHITECTURE.md](https://github.com/sidlabs-platform/Auto-Heal-CI-Agent/blob/main/ARCHITECTURE.md) — how the engine works
