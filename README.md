# Neighborly

Neighborly is a community engagement website that connects local residents by allowing them to share posts, organize events, and exchange services in a safe and moderated environment.

## Project Structure

- **Django Backend**  
  Located in the `neighborly/` directory with custom apps in the `apps/` folder.  
  Handles server-side logic, authentication, and data management.

- **React Frontend**  
  Located in the `react-app/` folder.  
  Provides a modern, interactive user interface that integrates with the Django backend.

- **Remote Development Environment**  
  The project is configured for GitHub Codespaces. A custom development container is defined in the `.devcontainer/` directory (including a `devcontainer.json` and a corresponding `Dockerfile`) to provide a consistent, cloud-based workspace that supports both Python (for Django) and Node.js (for React).

- **CI/CD**  
  GitHub Actions are configured in `.github/workflows/deploy.yml` to automatically run tests for both Django and React on each push to the `main` branch.  
  (The deployment step is currently disabled.)

## Setup Instructions

### Prerequisites
- Python 3.9+  
- Node.js and npm  
- (Optional) Docker—for those who prefer local containerization, though remote development is recommended via GitHub Codespaces

### Django Setup
1. **Create a virtual environment and install dependencies:**
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows use: venv\Scripts\activate
   pip install -r requirements.txt
   ```
2. **Apply migrations:**
   ```bash
   python manage.py migrate
   ```
3. **Run the Django development server:**
   ```bash
   python manage.py runserver
   ```
   Visit [http://127.0.0.1:8000](http://127.0.0.1:8000) to view the site.

### React Setup
1. **Navigate to the React directory:**
   ```bash
   cd react-app
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the React development server:**
   ```bash
   npm start
   ```
   The app will open at [http://localhost:3000](http://localhost:3000).

### Remote Development via GitHub Codespaces (Recommended)
1. **Codespace Configuration:**  
   - The project is configured with a development container defined in the `.devcontainer/` directory. This container installs Python, Node.js, and all required dependencies to run both the Django backend and the React frontend.
2. **Opening the Workspace:**  
   - To launch a GitHub Codespace, navigate to the repository on GitHub, click the **Code** button, then select **Open with Codespaces**.  
   - Alternatively, use the GitHub Codespaces extension for Visual Studio Code to open a codespace directly from your repository.

### Running Tests
- **Django Tests:**  
  Run Django tests with:
  ```bash
  python manage.py test
  ```
- **React Tests:**  
  Navigate to the `react-app` directory and run:
  ```bash
  npm test -- --watchAll=false
  ```

### CI/CD Pipeline
- **GitHub Actions:**  
  The CI/CD pipeline is defined in `.github/workflows/deploy.yml`. On every push to the `main` branch, the pipeline performs the following:
  - Checks out the code.
  - Sets up Python and runs Django tests.
  - Sets up Node.js, installs React dependencies, and runs React tests.
  - (The deployment step is currently disabled.)
  
  To view CI/CD results, check the **Actions** tab on GitHub after pushing changes.

## Contributing
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Submit a pull request.

## License
This project is licensed under the [MIT License](LICENSE).
