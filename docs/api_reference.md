# API Reference

You can interact with Neuro Arcade's server directly through HTTP requests, 
from any language. The goal of this document is to provide reference for all 
API endpoint available.

[//]: # (todo: change the URL used in api refs)
Assuming the server is deployed on neuroarcade.org. 

## Authentication

Authentication on Neuro Arcade is done via authentication token. Note that some
API endpoints require authentication. To acquire your authentication token you 
need to make a login request while having an account on Neuro Arcade. You can 
make an account either on the website, or through the API endpoint. 

Additionally, you will also need a new CSRF token to identify your current session.
To acquire a CSRF token simply make a GET request at /api/csrf/. Authentication
tokens are used to identify your user and CSRF tokens are used to identify your
session. Both of these are require for requests that change content on the website,
such as uploading scores or models.

In order to include authentication in you request, include the following header in your 
request:
```
Authorization: Token USER_AUTH_TOKEN
X-CSRFToken: CSRF_SESSION_TOKEN
```

### Endpoints

#### CSRF
```
GET neuroarcade.org/api/csrf
```
Requests a new CSRF token that is used to validate your current session. 
Keep in mind that every session is going to require a different token.

Example Response:
```json
{"csrfToken": CSRF_SESSION_TOKEN}
```

#### Signup
```
POST neuroarcade.org/api/sign-up
```
Request Data:
```json
{
  "username": USERNAME,     
  "email": EMAIL,
  "password": PASSWORD
}
```
Requests a new user to be created using the above credentials. Please note 
that this API call will not reply with your authentication token, so you
will have to login after you make an account.


#### Login
```
POST neuroarcade.org/api/login
```
Request Data:
```json
{
  "username": USERNAME / "email": EMAIL,,
  "password": PASSWORD
}
```
Responds with user's information, including the authentication token:
```json
{
  'username': username,
  'email': email,
  'is_admin': True if the user has admin priviledges,
  'id': user id,
  'token': authentication token,
  'status': whenever or not the user was approved by an admin yet,
}
```
Requests a user's information from a given ID and password. For user 
identification either the username or email of the account is needed.
If both are provided, then only the username will be used.


## Getters

These API endpoint give you data that is available on the website, without 
changing any of it. 

#### Get Game


#### Get Games Sorted


#### Get Tags


#### Get About Data


#### Get Player


#### Get Player Rankings


#### Get Player Scores


#### Get User's Players



## Posters

These API endpoint are meant for uploading and changing data on our platform.
All of these endpoints require valid authentication as stated in the authentication
section of this reference (both user token and CSRF token are necessary).

#### Post Game Score


#### Post Unprocessed Results


#### Post New Model/Player (Should only be player)


#### Delete Player


#### Post About Data (admin only)


#### Post User Status (admin only)


#### Post Game Rank (admin only)

