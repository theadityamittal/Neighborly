#!/bin/bash
# Start Django server in the background
python manage.py runserver 0.0.0.0:8000 &

# Change to the React directory and start the React server in the background
cd react-app && npm start &