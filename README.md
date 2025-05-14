# Neighborly

**Neighborly** is a hyper‑local community hub that brings neighbors together through verified residency. The platform empowers residents to share posts, lend & borrow tools, exchange services, organize & RSVP to events, and create or sign community petitions—all within a secure, address‑verified environment.

---

## Key Features

- **User Authentication & Residency Verification**  
  Secure sign‑up and login with proof‑of‑address upload, staff review, and JWT‑backed sessions.

- **Geo‑Filtered Bulletin Board**  
  Browse and post neighborhood updates filtered by ZIP, radius, and tags.

- **Tool Sharing Marketplace**  
  List, request, lend, and return tools with real‑time status and usage history.

- **Service Exchange Platform**  
  Offer and request local services, with built‑in request & fulfillment flows.

- **Community Events Calendar**  
  Create, RSVP, modify, and cancel events. Interactive map picker for location selection.

- **Petitions & Civic Engagement**  
  Launch petitions, track signature counts, and sign/un‑sign from personal dashboards.

- **Personal Dashboards**  
  - **My Creations**: All posts, events, services, petitions you’ve created.  
  - **My Activity**: All posts, RSVPs, sign‑ups, and petition signatures you’ve joined.

- **Media Handling**  
  Secure image uploads via S3 presigned URLs & CloudFront CDN for fast, reliable delivery.

- **Search & Filtering**  
  Keyword, tag, and location radii filters powered by an integrated Mapbox/Leaflet picker.

- **Responsive & Accessible UI**  
  Built with React & MUI for desktop, tablet, and mobile; WCAG‑informed components.

---

## Architecture & Tech Stack

- **Frontend**  
  - React 18  
  - Material‑UI (MUI v5)  
  - Redux Toolkit & Axios  
  - Mapbox GL JS / Leaflet for maps  
  - Jest + React Testing Library + (planned) Cypress

- **Backend**  
  - Python 3.11 & Django 4  
  - Django REST Framework (DRF) & DRF‑Spectacular (OpenAPI)  
  - SimpleJWT for token auth  
  - PostgreSQL on AWS RDS (SQLite for local dev)

- **Media & CDN**  
  - AWS S3 for file storage  
  - CloudFront for global distribution

- **Infrastructure & CI/CD**  
  - AWS EC2 + Nginx + Gunicorn  
  - GitHub Actions (build, tests, migrations, deploy)  
  - Docker‑Compose & GitHub Codespaces for dev environments

- **Observability (Roadmap)**  
  - AWS CloudWatch (metrics & alarms)  
  - k6 load‑testing scripts  
  - Sentry for front‑end error tracking

---

## Installation & Local Setup

### Prerequisites

- **Git**  
- **Python 3.9+**  
- **Node.js 14+ & npm**  

### Clone & Configure

```bash
git clone https://github.com/theadityamittal/Neighborly.git
cd Neighborly
````

#### Backend

1. Create & activate a Python virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   ```
2. Install dependencies and apply migrations:

   ```bash
   pip install -r requirements.txt
   python manage.py migrate
   ```
3. Create a `.env` file (see `.env.example`) and set:

   ```
   ACCESS_KEY=your_aws_access_key_here
   SECRET_KEY=your_aws_secret_key_here
   BUCKET_NAME=your_bucket_name_here
   REGION_NAME=your_aws_region_here
   MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
   ```
4. Load the DB with dummies
   ```bash
   python manage.py dev_setup
   ```
5. Run the backend:

   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

#### Frontend

1. Navigate to the React app:

   ```bash
   cd react-app
   ```
2. Install & configure:

   ```bash
   npm install
   cp .env.example .env.local
   # Update REACT_APP_BACKEND_URL as needed
   ```
3. Start the frontend:

   ```bash
   npm start
   ```
4. Open your browser at [http://localhost:3000](http://localhost:3000).

---

## Testing

* **Backend Unit & API Tests**

  ```bash
  python manage.py test
  ```
* **Frontend Unit Tests**

  ```bash
  cd react-app
  npm test -- --watchAll=false
  ```

---

## Deployment

The `deploy` workflow in GitHub Actions builds and pushes Docker images, migrates the database, and updates the EC2 fleet via SSH/GitHub Deployments. Configuration is defined in:

* `.github/workflows/deploy.yml`

---

## API Documentation

Interactive API docs are available at:

```
GET /api_doc/
```

Powered by DRF‑Spectacular (OpenAPI / Swagger UI).

---

## 🤝 Contributing

1. **Fork** the repo and create a feature branch.
2. Develop against the latest `main`.
3. Ensure all tests pass locally.
4. Submit a **Pull Request** with clear descriptions and linked issues.
5. Maintainers will review and merge after CI checks succeed.

---

## 📜 License

This project is released under the **MIT License**. See [LICENSE](LICENSE) for details.

## Fixture credentials

With each of the user fixtures loaded from the previous step dev_setup the default password for the user account is password123. Feel to use these accounts to look at the website! Or checkout the live site here: http://3.145.158.84/