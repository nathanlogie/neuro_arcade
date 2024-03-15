"""
Django settings for neuro_arcade project.

Generated by 'django-admin startproject' using Django 3.2.22.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

import os
from corsheaders.defaults import default_headers
from pathlib import Path

# TODO: change this to the URL of the website
WEBSITE_URL = "localhost:3000"

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
STATIC_DIR = os.path.join(BASE_DIR, 'static')
MEDIA_DIR = os.path.join(BASE_DIR, 'media')

# React paths:
REACT_DIR = os.path.join(BASE_DIR, 'reactapp')
REACT_BUILD_DIR = os.path.join(REACT_DIR, 'build')
REACT_STATIC_DIR = os.path.join(REACT_BUILD_DIR, 'static')
REACT_MEDIA_ROOT = os.path.join(REACT_STATIC_DIR, 'media')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-4#($c-j6(9ujy#i&&gj)&umiojdi_-aa8u3x2$!qqh%xj(e@@k'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["sh08.pythonanywhere.com",
                 "127.0.0.1", "localhost"]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_PRIVATE_NETWORK = True  # idk what this does
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://localhost:3000",
    "http://locahost:8000",
    "https://localhost:8000",
    "https://" + WEBSITE_URL
]
CORS_ALLOWED_ORIGIN_REGEXES = [
    'http://localhost:3000/*.',
    WEBSITE_URL + '/*'
]
CORS_ALLOW_HEADERS = (
    *default_headers,
    'Authentication',
    'Authorisation'
)

# CSRF protection settings
CSRF_COOKIE_SECURE = True
# SESSION_COOKIE_SECURE = True  # this is not necessary
CSRF_HEADER_NAME = 'HTTP_X_CSRFTOKEN'  # on client: 'X-CSRFToken'
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://" + WEBSITE_URL
]

REST_USE_JWT = True
JWT_AUTH_COOKIE_USE_CSRF = True
JWT_AUTH = {
    # Authorization:Token xxx
    'JWT_AUTH_HEADER_PREFIX': 'Token',
}

# This might be necessary:
USE_X_FORWARDED_PORT = True

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'na',
    'reactapp',
    'corsheaders'
]

MIDDLEWARE = [
    'django.middleware.csrf.CsrfViewMiddleware',
    # needs to be before other middleware
    'django.middleware.security.SecurityMiddleware',
    # needs to be after the security middleware
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',  # needs to be after CORS
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'neuro_arcade.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [REACT_BUILD_DIR],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.media',
            ],
        },
    },
]

WSGI_APPLICATION = 'neuro_arcade.wsgi.application'

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

# Use sqlite for pipeline and development, postgresql for actual use
if os.environ.get("CI") or not os.environ.get("NEURO_ARCADE"):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': 'neuro_arcade',
            'USER': 'django_user',
            'PASSWORD': 'password', # TODO
            'HOST': 'localhost', # TODO
            'PORT': '',
        }
    }

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/
STATIC_URL = '/static/'
STATICFILES_DIRS = [STATIC_DIR, REACT_STATIC_DIR]

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

MEDIA_ROOT = MEDIA_DIR
MEDIA_URL = '/media/'

LOGIN_URL = 'na:login'

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
}

# Email address to send admin errors to
ADMIN_EMAIL = "arcadeneuro@gmail.com"

# Configuration for error emails in the evaluation pipeline

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_USE_TLS = True
EMAIL_PORT = 587

# The email account to send the error emails from
EMAIL_HOST_USER = "arcadeneuro@gmail.com"
EMAIL_HOST_PASSWORD = 'fueg awlu apid wzwk'
