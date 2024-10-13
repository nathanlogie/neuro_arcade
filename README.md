# NeuroArcade
![image](https://github.com/user-attachments/assets/646e3f95-ebf6-464d-83b9-ec82c5299296)

## Description
NeuroArcade is a web project developed by SH08 as part of the Professional Software Development course at the University of Glasgow. The website will allow for a centralised system to record the results of AI models in Games and for a direct comparison with other models. Models will be ranked comparatively (How similar to humans) and competitively (Performance compared to other models).

The ultimate goal is to help make cognitive science more openly collaborative.

## Installation and Deployment

### For Production

Deploying the server on a new machine is as easy as running the following scripts:
```shell
sudo sh setup.sh
```
```shell
sh run_server.sh
```
It is recommended you read the setup script and its comments before you run it, as additional actions might be required depending on your system. Note that ``setup.sh`` requires sudo privileges and might prompt you for your root password. Please keep in mind that the actual server should never be run with ``sudo``!

Some caveats: ``setup.sh`` assumes it is running on a linux system that uses ``apt-get`` as its package repository (such as Ubuntu). On other systems it is recommended you install the required packages manually.  

To close the server, run:
```shell
sh stop.sh
```

### For Development

As long as your shell environment doesn't have a ``$NEURO_ARCADE`` environment variable, the server will run in development mode, which is ideal for running it on your local machine and not open to the internet.

The server has two processes that need to run:
1. The Django API Server
2. The Frontend Server

Both of these can have their dependencies updated by running ``update_dependencies.sh`` in the neuro_arcade folder.

In order to get a database populated with test data, use the ``rebuild-db.sh`` script. Only use this on development instances of the server! 

And now, we can actually run the two servers:

- Start Django: ``python manage.py runserver`` in ``neuro_arcade``
- Start Frontend: ``npm start`` in ``neuro_arcade/reactapp``

Note that both servers need to be running at the same time. On user-friendly systems this is as easy as running the two commands on different terminal tabs/windows. On a command line only system, it is recommended you run each one of them in a different ``screen`` instance. 

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

