# Fluffy the Weatherapp

Reports the current weather and forecasts in 3 hours slots. The frontend uses the browser's geolocation and fetches the location based weather data through the backend from openweathermap. `React-geolocated` package is used.

There are two options to configure Fluffy the weatherapp. The first option runs the app virtually on any environment where [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) are installed. Then the app itself runs in the environments localhost. The second option presents the configuration where the app is set up in Google Cloud with an ansible playbook.

## Run app in localhost

When environment has Docker and Docker Compose installed Fluffy the weatherapp can be started with the **docker-compose.yml** -file. This starts the app in a connected set of containers. In addition, an openweathermap api key is needed as an environment variable `APPID with this configuration.

This configuration uses volumes to share the development files. There is also an option for running the app with hot reload for both the backend and the frontend containers. For the frontend it is already enabled with `--hot --inline` options in package.json's `start` command. For the backend it can be enabled using `CMD [ "npm", "run", "dev" ]` instead of CMD [ "npm", "start" ]` in its **Dockerfile**.

If Eslint is needed uncomment the `CMD [ "npm", "run", "lint" ]` lines in both the **Dockerfile**s in the backend and the frontend directory.

## Set up in Google Cloud Platform

Fluffy the weatherapp installation in Google Cloud Platform can be made with the **weatherapp.yml** -file which contains ansible playbooks for creating the VM and installing the app itself. Firstly, you need [Ansible](https://www.ansible.com/) installed on your system. In addition, for the automated installation, all the environment variables presented below are needed.

### Environment variables needed:

* GCE_EMAIL: <your-sa@your-project-name.iam.gserviceaccount.com>
* GCE_PROJECT: <your-gce-project-name>
* GCE_CREDENTIALS\_FILE\_PATH: </path/to/your-key.json>
* APPID: <your-weatherapp-api-key>
* LETSENCRYPT_HOST_1: <your-domain-for-frontend>
* LETSENCRYPT_HOST_2: <your-domain-for-backend>
* LETSENCRYPT_EMAIL: <your-email-to-contact-you>

### Present the following steps:

1. Create a directory called `roles/`

2. Install Ansible Galaxy roles running the command `ansible-galaxy install -r requirements.yml --force -p roles`

3. Run the the **weatherapp.yml** ansible playbook by running the command `ansible-playbook weatherapp.yml -u <your-google-username>` (The last -u switch is needed if your environment user name differs from your google username)

The first play of the **weatherapp.yml** playbook launches `gce` instance with a machine type `n1-standard-1` which runs `debian-9`. It also waits for SSH to come up and adds host to groupname.

The second play installs the actual weatherapp. First, Docker is installed by using roles `ansible-role-docker` and `ansible-role-pip`. Sources for these roles may be found in **requirements.yml**. Second, the actual containers for running the app are built and started.

For https connections `jwilder/nginx-proxy` container is used in front of both the backend and the frontend container to serve https. Together with `jrcs/letsencrypt-nginx-proxy-companion` the needed certificates are automatically created when the backend and frontend containers are started after these two nginx containers. These additional containers enable the using of the same frontend and backend implementation from localhost configuration.

## Live Fluffy the weatherapp

Currently Fluffy the weatherapp is installed on Google Cloud Platform and can be visited with the links below:

* Frontend: [fluffy.fly.fi](http://fluffy.fly.fi)
* Backend: [cloudy.fluffy.fly.fi/api/weather/](http://cloudy.fluffy.fly.fi/api/weather/)
