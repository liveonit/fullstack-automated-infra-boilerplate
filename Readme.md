# Full Stack Boilerplate

## Este repo concentra todos los proyectos del boilerplate fullstack con typescript

## Resumen

Este boilerplate es un acumulado de varios proyectos que he ido implementando en mi tiempo libre,
para tener un codigo flexible que que sirva como cimientos para la construccion de diferentes
sofrwares a medida.
Algunas partes de este gran boilerplate, se encuentran en repositorios individuales mas pequeños
en donde se explica mas en detalle el funcionamiento de cada parte granular es este boilerplate.

Estos proyectos son:

- [fullstack-ts-boilerplate](aunPorAgregar) - Cuenta solo con la parte de api y dashboard especificamente,
sin agregar el servicio keycloak ni la infraestructura
- [k8s-cluster](aunPorAgregar) - Cuenta con todo lo necesario para levantar el cluster de kubetes sobre el
cual se puede correr esta aplicacion, mas alla de un ambiente de dev o testing para levantar un staging o prod
es necesario levantar un cluster k8s, este repo automatiza el armado y despliegue de cada uno de los nodos del
cluster, y en este repo en la seccion [stage testing](###STAGE-TESTING) se explica como desplegar este boilerplate 
en minikube y en [stage staging](###STAGE-STAGING) como desplegarlo en un kluster k8s.

## Requisitos de instalacion

### Para poder correr este boilerplate en modo dev

- [Nodejs](https://nodejs.org/en/about/) (>12.x)
- [NPM](https://docs.npmjs.com/about-npm/)
- [Docker](https://docs.docker.com/) (>18.06.0) y [docker-compose](https://docs.docker.com/compose/) (>1.25.3)

### Para coorer en modo test

- [Nodejs](https://nodejs.org/en/about/) (>12.x)
- [NPM](https://docs.npmjs.com/about-npm/)
- [Docker](https://docs.docker.com/) (>18.06.0) y [minikube](pendiente) <!-- TODO: agregar link minikube y establecer version junto co requisitos minikube -->

### Para coorer en modo staging
<!-- TODO: resolver requisitos para modo staging -->
- [Ansible](https://docs.ansible.com/ansible/latest/index.html)
- [Virtualbox](https://www.virtualbox.org/wiki/VirtualBox), [vagrant](https://www.vagrantup.com/docs/index.html)

**Ademas en cualquiera de los modos que se corran, con** [GNU Make](https://www.gnu.org/software/make/) **se facilita la ejecucion de comandos**

## Implementacion

### STAGE DEV

Clonar este repo

```bash
git clone https://github.com/ibarretorey/fullstack-automated-infra-boilerplate.git
cd fullstack-automated-infra-boilerplate
```

Una vez dentro configura las vairables del archivo .env que se enuentra de ejemplo. Si se encuentra en un proyecto
deberia encriptarlo y no publicarlo en git.
**ACLARACION: este .env es para pruebas y lo dejo como ejemplo para ver las variables que se pueden configurar**

Una vez configuradas las variables ejecutar

```bash
docker-compose up templating #crea los archivos de configuracion de los servicios en base al .env y los guarda en config files
docker-compose up -d db # levanta la base de datos y crea las bases para api y keycloak

cd microservicios/db && npm install && \
DB_HOST=${DOMAIN}\
DB_PORT=${EXTERNAL_DB_PORT}\
API_DB_USER=${API_DB_USER}\
API_DB_PASSWORD=${API_DB_PASSWORD}\
API_DB_NAME=${API_DB_NAME}\
npm run typeorm migration:run && cd - # ejecuta las migraciones de la base de datos,
# las mismas se encuentran en microservicios/db/src/migrtions/* y se crearon con typeorm
```

Luego de tener los archivos de configuracion y la base con las migraciones de la api, ejecutar

```
docker-compose up -d
```

para levantar el resto de los servicios.

Si dejo la variable en DOMAIN `localhost` deberia poder acceder:
- Al dashboard: http://localhost/
- A keycloak: http://localhost/auth
- A graphql: http://localhost/graphql

#### A modo de trubleshooting

Puede diagnosticar los contendores con

```bash
docker ps # ver el status de todos los contenedore, observar si alguno se reinica
docker logs <nombre_del_contenedor> # puede ver la info y los errores que loguea cada contenedor
```

Ademas puede acceder directo a los servicios para probarlos independientemente del proxy

- dashboard: [http://localhost:<DASHBOARD_EXTERNAL_PORT>](http://localhost:<DASHBOARD_EXTERNAL_PORT>)
- api: [http://localhost:<API_PORT>/graphql](http://localhost:<API_PORT>/graphql)
- keycloak: [http://localhost:<8080>](http://localhost:<8080>)

### STAGE TESTING
<!-- TODO: implementacion in minikube -->
Pendiente ..

### STAGE STAGING
<!-- TODO: implementacion in k8s-cluster -->
Pendiente...
