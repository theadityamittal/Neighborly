#!/bin/bash
pip install -r requirements.txt &&
npm install --prefix react-app &&
start_servers.sh

cat <<EOF > .env
access_key=fake-access-key
secret_key=fake-secret-key
bucket_name=fake-bucket
region_name=us-east-1
DJANGO_ENV=development
DB_NAME=neighborly_db
DB_USER=neighborly_user
DB_PASSWORD=neighborly_pass
DB_HOST=localhost
DB_PORT=5432
DEBUG=True
EOF

echo ".env file created for Codespace test environment."