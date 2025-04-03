# Neighborly

Neighborly is a community engagement website that connects local residents by allowing them to share posts, organize events, exchange services, and participate in community petitions in a safe and moderated environment.

## Project Structure

- **Django Backend**  
  Located in the `neighborly/` directory with custom apps in the `apps/` folder.  
  Handles server-side logic, authentication, and data management.

- **React Frontend**  
  Located in the `react-app/` folder.  
  Provides a modern, interactive user interface that integrates with the Django backend.

### Key Frontend Features

- **User Authentication**: Sign up, login, and profile management
- **Tool Sharing**: List and request to borrow tools from neighbors
- **Community Petitions**: Create, sign, and track local petitions
- **Event Organization**: Post and RSVP to community events
- **Service Exchange**: Offer and request services from community members
- **Interactive UI Components**: Calendar date picking, modal dialogs, and responsive cards

### Key Components

- **Dashboard**: Central navigation hub with sidebar menu and content area
- **HorizontalCard/VerticalCard**: Display community items in an appealing format
- **CalendarPicker**: Date selection with availability tracking
- **Modal Dialogs**: Rich interactive forms for item details and booking

## Setup Instructions

### Prerequisites
- Python 3.9+  
- Node.js 20+ and npm  
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
1. **Start services automatically:**  
   The project includes a script that starts both Django and React servers automatically in Codespaces using the configuration in `.devcontainer/start_servers.sh`.

2. **Opening the Workspace:**  
   - To launch a GitHub Codespace, navigate to the repository on GitHub, click the **Code** button, then select **Open with Codespaces**.  
   - Alternatively, use the GitHub Codespaces extension for Visual Studio Code to open a codespace directly from your repository.

### Environment Variables

The React frontend uses environment variables for configuration:

- `REACT_APP_BACKEND_URL`: The URL for the Django backend (default: http://127.0.0.1:8000)

## Project Pages

- **Authentication**: User registration and login
- **Bulletin**: Main community feed
- **Tools**: Community tool sharing marketplace
- **Services**: Service exchange platform
- **Events**: Community events calendar
- **Petitions**: Community petitions with signing capability
- **User Profile**: Personal profile management

## State Management

The project uses Redux for state management with:
- Authentication state handling
- Persistent login sessions
- Centralized store configuration

## Running Tests

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

## Contributing
1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Submit a pull request.

## License
This project is licensed under the [MIT License](LICENSE).