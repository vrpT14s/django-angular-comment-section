#/bin/bash
cd backend && ./manage.py runserver &
cd frontend/dacs && npm install && ng serve &
