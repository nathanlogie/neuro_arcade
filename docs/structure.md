![structure.img](structure.png)

### Client [React]

Our client uses React JS to render the frontend of the website. React provides modularity,
 it helps with separation of concerns and makes the structure of the code easier to understand. It does so through
the use of components.

[More on the React Client](client.md)

### API Server [Django]

Our API server is the main point of communication between our database and our client.
It takes a request - which can either be 'POST' or 'GET' - and alters/creates/retrieves 
instances from the database depending on the request. 

For 'POST' requests, the request holds data to be altered. It then retrieves an existing model,
or creates a new one depending on what is needed to be posted. It returns a success response if 
the new attribute or instance was successfully added to the database, otherwise it returns an error 
response.

For 'GET' requests, the request holds data on the instance to retrieve. It then 
searches for that data in the database or in a json file. Once the data is retrieved,
it returns a success response, containing the instance. In cases where the instance is not 
found, it returns an error response with status 404. 

There are also permission classes such as IsAdminUser and IsAuthenticated. These ensure that 
only requests containing the required features are accepted, otherwise it returns a forbidden response.
These prevent any security risks that may occur.

[More on the Django API Server]

### Score Processing [Celery + Docker]

This regards the process and processing of game scores and the components involved in them.
The Neuro Arcade server returns unprocessed data which needs to be in a json format. 

[More on Score Processing](score_pipeline.md)

### Frontend Server [Serve]



[More on our Frontend Server]

### Database [SQLite]

Our database runs with SQLite. It helps to structure our data and provides relationships between
related data.

[More on our database]

