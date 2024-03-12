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

## Authentication Endpoints

### CSRF
```
GET neuroarcade.org/api/csrf
```
Requests a new CSRF token that is used to validate your current session. 
Keep in mind that every session is going to require a different token.

Example Response:
```json
{"csrfToken": CSRF_SESSION_TOKEN}
```

### Signup
```
POST neuroarcade.org/api/sign-up
```
Requests a new user to be created using the above credentials. Please note 
that this API call will not reply with your authentication token, so you
will have to login after you make an account.

Request Data:
```json
{
  "username": USERNAME,     
  "email": EMAIL,
  "password": PASSWORD
}
```


### Login
```
POST neuroarcade.org/api/login
```
Requests a user's information from a given ID and password. For user 
identification either the username or email of the account is needed.
If both are provided, then only the username will be used.

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
  "username": username,
  "email": email,
  "is_admin": True if the user has admin priviledges,
  "id": user id,
  "token": authentication token,
  "status": whenever or not the user was approved by an admin yet,
}
```


## Getters

These API endpoint give you data that is available on the website, without 
changing any of it. 

### Get Game Data
```
1. GET neuroarcade.org/api/games/<game_name_slug>/data/
2. GET neuroarcade.org/api/game/<game_id>
```
These endpoints expose data of a specific game. Endpoint 1 takes the game 
name slug to identify which game is wanted, while endpoint 2 requires the 
id of the game. The name slug is created from transforming the game name
into a string that's allowed in a URL.

Example Response: WIP

[//]: # (todo: example response for get game data)


### Get Games
```
GET neuroarcade.org/api/games/
```
This endpoint returns a list of all games on the website.

[//]: # (todo: wait, really? ALL of them?? Is this right?)


### Get Tags
```
GET neuroarcade.org/api/gameTag/
```
This endpoint returns a list of all created game tags on the website.


### Get About Data
```
GET neuroarcade.org/api/about/
```
This endpoint returns the About Page data used to populate the about page.


### Get Player Data
```
1. GET neuroarcade.org/api/players/<player_name_slug>/data/
2. GET neuroarcade.org/api/players/<player_id>
```
These endpoints expose data of a specific player. Endpoint 1 takes the player's 
name slug to identify which player is wanted, while endpoint 2 requires the 
id of the player. The name slug is created from transforming the player's name
into a string that's allowed in a URL.

Players can refer to both human player and AI models. Every User on the website 
is going to have one human player associated with their account, and any number
of associated AI Models. The human player has the same name as its associated 
account's username.

Example Response: WIP

[//]: # (todo: example response for get player data)


### Get Player Rankings
```
GET neuroarcade.org/player-rankings/
```
Gets the overall rankings of AI models

Format is a list of score, player pairs in descending order of score

This is based on their relative performances across tasks.
Every task a model has a score in gives them a score from 0-100 based on the percentile
they fall in on the leaderboard, considering highest scores only.
Coming first in the leaderboard gives 100 points, decreasing by (100 / n) each position after.
These are then summed up to give their overall score.

This function definitely needs optimising in the future, probably running the calculations
automatically at an interval and caching the results. The logic could also use some splitting.
The API should remain stable, so the current implementation is enough for frontend development
to begin.


### Get Player Scores
```
GET neuroarcade.org/api/players/<player_name_slug>/score
```
Returns all scores made by a specific player.


### Get User's Players
```
GET neuroarcade.org/api/users/<user_id>/players/
```
Returns players associated with a user.


## Posters

These API endpoint are meant for uploading and changing data on our platform.
All of these endpoints require valid authentication as stated in the authentication
section of this reference (both user token and CSRF token are necessary).

### Post Game Score
```
POST neuroarcade.org/api/games/<slug:game_name_slug>/add-score/
```
Post Score for a game. The format for the body of the Post request is as follows:

For every score type header, the request needs to have a field called the same as the score header. 
Additionally, the request needs to specify the player responsible for the score by including either
the id ('PlayerID') or name ('PlayerName') of the player. Keep in mind that the player needs to be
associated with the current authenticated user, or the request will be refused.

Example: for a score type with a single header called 'Points' then the request needs to have
a field called 'Points' and a field either called 'PlayerID' or 'PlayerName'.

### Post Unprocessed Results
```
POST neuroarcade.org/api/upload/unprocessed-result/
```
Upload of raw score that will need to be evaluated. User needs to be authenticated.

Request format: ```{
    game: <game slug>,
    player: <player slug>,
    content: <raw score as string>,
}```

Player field needs to be owned by the user making the request

### Post New Model/Player (Should only be player)


### Delete Player


### Post About Data (admin only)


### Post User Status (admin only)


### Post Game Rank (admin only)

