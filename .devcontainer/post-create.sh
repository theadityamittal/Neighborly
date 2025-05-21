#!/bin/bash
pip install -r requirements.txt &&
npm install --prefix react-app &&
start_servers.sh

cat <<EOF > .env
ACCESS_KEY=your_aws_access_key_here
SECRET_KEY=your_aws_secret_key_here
BUCKET_NAME=your_bucket_name_here
REGION_NAME=your_aws_region_here
DJANGO_ENV=development
DB_NAME=neighborly_db
DB_USER=neighborly_user
DB_PASSWORD=neighborly_pass
DB_HOST=localhost
DB_PORT=5432
DEBUG=True
EOF

echo ".env file created for Codespace test environment."