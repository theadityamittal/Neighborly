echo "Running black formatter..."
black .
echo "Black formatting completed."

echo "Running flake8 linting..."
flake8 .
echo "Flake8 linting completed."

echo "Changing directory to react-app..."
cd react-app
echo "Now in $(pwd)"

echo "Running ESLint with auto-fix..."
npx eslint . --fix
echo "ESLint completed."