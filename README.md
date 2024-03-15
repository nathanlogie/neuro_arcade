# NeuroArcade

## Description
NeuroArcade is a web project developed by SH08 as part of the Professional Software Development course at the University of Glasgow. The website will allow for a centralised system to record the results of AI models in Games and for a direct comparison with other models. Models will be ranked comparatively (How similar to humans) and competitively (Performance compared to other models).

The ultimate goal is to help make cognitive science more openly collaborative.

## Visuals
See wireframes below for an idea of what some of the completed pages will look like.

### Home Page

![Home page JPG](docs/rmFiles/home.jpg)

### All Games Page

![All Games Page JPG](docs/rmFiles/allTasks.jpg)

### Individual Games Page

![Game Page JPG](docs/rmFiles/game.jpg)

## Installation
The project can currently only be run locally. To run it git clone the project locally and run the following commands.

1. python manage.py makemigrations
2. python manage.py migrate
3. python populate.py
4. python manage.py runserver
5. cd reactapp
6. npm run start

The project will then start locally at 'http://localhost:3000/'

## Testing

### Linting

Linting of the project can be done through running 'npm run lint' in the reactapp.

### Backend

The backend tests are implemented through django. They can be accessed by running `python manage.py test` in `neuro_arcade/`

### Frontend

The frontend tests are implemented through react-scripts. They can be accessed by running `npm test` in `neuro_arcade/reactapp/`

### Formatting

Automatic formatting is built in through use of running 'npm run format' in the reactapp.

## Support
For any help or support, please create an issue on GitLab or message one of the contributors on Microsoft Teams. 

## Contributing
Not currently accepting contributions from external contributors.

## Authors and acknowledgment
Key Contributors to this project:
- Dr Benjamin Peters (Client)
- Nour Sameh Mohamed Hosni Elfangary
- Andrei Ghita
- Daniel Hally
- Nathan Logie
- Eilidh Macdonald
- Anzela Tariq
- Christopher Gunn (Coach)

## License
NeuroArcade is licensed under the MIT open source license.

## Project status
This project is under active development which will continue until April 2024 at the earliest.
