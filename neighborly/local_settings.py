# neighborly/local_settings.py
from .settings import *            # pick up everything from base

DEBUG = True

# override only the default database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# install your seeding/fixture‐loading tools only in dev
INSTALLED_APPS += [
    'django_seed',      # for faker‐powered seeding
]