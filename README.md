# AskMeAnything -- team saas-21

## Indices

* [Notice](#Notice)
* [Prerequisites](#Prerequisites)
* [Installation](#Installation)  
* [Using Certbot](#Using-Certbot)
* [Persisting Data](#Persisting-Data)
* [Disclaimer](#Disclaimer)

--------

## Notice

- This main branch is just a display for deploying each architecture with docker-compose.
- Each branch containing each service can be separately deployed on cloud, but is not shown here how.


## Prerequisites

* git
* docker and docker-compose (linux)


## Installation

1. Clone the repo
   ```sh 
   git clone https://actyp/saas-21.git
   ```
2. Navigate into Microservices or SOA folders
   ```sh 
   cd saas-21/microservices
   ----------or------------
   cd saas-21/soa
   ```

3. Start Docker
    ```sh 
   docker-compose up  # linux -- press CTRL-C to stop
   ```


## Using Certbot

Front-end service in each docker-compose.yml comes with a nginx server and certbot installed.
In order to use certbot to generate https certificate for your domain follow these steps:

1. Open two bash instances, noted as bash1 and bash2
2. Run the containers in bash1
   ```sh
   docker-compose up
   ```
3. Find <_front-end-container-id_> in bash2
   ```sh
    docker ps | grep front-end
   ```
4. Continue in bash2 and open a bash instance in running front-end container
   ```sh
    docker exec -it <front-end-container-id> bash
   ```
5. In the bash instance inside the container earn https certificate through certbot
   ```sh
   certbot --nginx -d <domain-name>
   ```
6. Follow the instructions and after a successful register, directory 
   ```sh
   {microservices|soa}/front-end/nginx/letsencrypt
   ```
   would have been created.
   The file _docker-compose.yml_ uses the same folder as a volume in order not to create certificates everytime the containers stop and restart.


## Persisting Data

### General

- The files described below can be generated automatically containing no data at first, after the first _docker-compose up_.
- Otherwise, copying own dump.rdb file inside the according directories, can 'populate' the databases with data anytime, but it requires containers to stop and restart.
### Microservices

Each microservice having each own redis db stores its own data. The files:
   
- microservices/auth/data/dump.rdb (user related data)
- microservices/question-management/data/dump.rdb (question related data)
- microservices/question-provider/data/dump.rdb (question related data)

are used for persisting redis data.

### SOA

Only data-layer holds the data needed, so the according file is:

- soa/data-layer/data/dump.rdb


## Disclaimer

All of usernames and passwords, found in the README files of each architecture, were auto-generated, in order to populate the database and were used for demonstrative purposes only. The github repository does not contain any file with data.
