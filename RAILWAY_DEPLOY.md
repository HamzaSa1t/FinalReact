# Deploying the backend on Railway

The Django backend in `backend/` is set up to run on Railway. The frontend continues to live on Vercel.

## 1. Create the Railway project

1. Sign in at https://railway.com with GitHub.
2. **New Project → Deploy from GitHub repo →** pick `HamzaSa1t/FinalReact`.
3. After Railway imports the repo, open the service → **Settings**:
   - **Root Directory**: `backend`
   - **Build / Deploy**: Railway auto-detects `backend/railway.json` and `backend/Procfile`. Nothing else to configure.

## 2. Add a Postgres database

In the project view → **+ New → Database → Add PostgreSQL**.
Railway automatically injects `DATABASE_URL` into the backend service — no copy/paste needed.

## 3. Set environment variables

On the backend service → **Variables**, add:

| Variable | Value |
| --- | --- |
| `SECRET_KEY` | a long random string (e.g., `python -c "import secrets;print(secrets.token_urlsafe(64))"`) |
| `DEBUG` | `False` |
| `DJANGO_ALLOWED_HOSTS` | `final-react-xi.vercel.app,.up.railway.app` |
| `CORS_ALLOWED_ORIGINS` | `https://final-react-xi.vercel.app` |
| `EMAIL_HOST_USER` | your Gmail address |
| `EMAIL_HOST_PASSWORD` | your Gmail app password |

`DATABASE_URL` is provided by the Postgres plugin. `RAILWAY_PUBLIC_DOMAIN` and `PORT` are injected by Railway.

## 4. Generate a public URL

Service → **Settings → Networking → Generate Domain**. Copy the domain (e.g., `finalreact-production.up.railway.app`).

## 5. Point the frontend at Railway

In Vercel → project `final-react-xi` → **Settings → Environment Variables**:

- `VITE_API_URL` = `https://<your-railway-domain>` (no trailing slash)

Then redeploy (Deployments → ⋯ → Redeploy) so Vite picks up the new env var.

## 6. Tear down Render

In the Render dashboard, delete the `finalreact-nhpx` web service and its Postgres add-on.

## Local development

`backend/.env` is still loaded via `python-dotenv`. Run from `backend/`:

```bash
python -m venv env
env\Scripts\activate          # PowerShell: .\env\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

`frontend/.env` defaults to `VITE_API_URL=http://localhost:8000` for local dev.
