# Full Stack Boilerplate

## Este repo concentra todos los proyectos del boilerplate fullstack con typescript

## Resumen

Este proyecto es un acumulado de varios proyectos que he ido implementando, para tener un codigo
flexible que que sirva como cimientos de la construccion de diferentes sofrwares a medida.
Cada  sub-proyecto por si solo cuenta con su repositorio independiente y puede ser utilizado
como una herramienta para integrar en un stack, el codigo esta desarrollado de tal forma que cada
sub-proyecto pueda pueda ser utilizado sin depender directamente de los demas.
Pero al integrar todos los proyectos se obtiene un toolkit, robusto y flexible que servira como
base para construir soluciones completas.

## Inicializar el proyecto

Para el boilterplate completo con todos los subproyectos es necesario contar con nodejs y npm.
Teniendo instalado `node.js` y `npm` necesitamos instalar `meta` que servira para clonar y mantener
syncronizados todos los repos de los subproyectos. Para instalarlo ejecutamos

```bash
sudo npm install -g meta
```

Luego para obtener todo el full-stack boilerplate incluidos los subproyectos ejecutamos

```bash
meta git clone https://github.com/ibarretorey/fullstack-boilerplate.git
```

Con el comando anterior se generara un proyecto con las siguiente estructura:

```bash

├── api-ts
│   └── <Todo lo que compone el sub-proyecto de la api incluida su documentacion>
├── dashboard-ts
│   └── <Todo lo que compone el sub-proyecto del dashboard>
├── security
│   └── <Todo lo que compone el sub-proyecto para agregar autenticacion y https>
└── k8s-cluster
    └── <Todo lo que compone el sub-proyecto k8s para implementar la infraestructura>
```

## Fraemworks y herramientas utilizadas para los desarrollos

1. API y Dashboard
   - Dev
     - [Nodejs](https://nodejs.org/en/about/)
     - [NPM](https://docs.npmjs.com/about-npm/)
   - Test o Prod
     - [Docker](https://docs.docker.com/)
     - [docker-compose](https://docs.docker.com/compose/) ó ([Minikube](https://kubernetes.io/docs/setup/learning-environment/minikube/)/[k8s-cluster](https://kubernetes.io/))
2. Autenticacion y seguridad
   - Docker
   - docker-compose ó (Minikube/k8s-cluster)
3. k8s cluster
   - All
     - [Ansible](https://docs.ansible.com/ansible/latest/index.html)
   - Test
     - [Virtualbox](https://www.virtualbox.org/wiki/VirtualBox), [vagrant](https://www.vagrantup.com/docs/index.html)

Ademas con - [GNU Make](https://www.gnu.org/software/make/) pueden facilitar la ejecucion de comandos

## Repos que conforman el proyecto

- [api-ts](https://github.com/ibarretorey/api-ts)
- [dashboard-ts](https://github.com/ibarretorey/dashboard-ts)
- [security](https://github.com/pending)
- [k8s-clluster](https://github.com/ibarretorey/k8s-cluster.git)

## Implementar api y dashboard en dev
<!-- TODO: hacer la implementacion del bolerplate fullstack general -->

### Implementar todo con docker-compose

### Implementar todo con k8s-minikube

### Implementar todo con k8s-cluster
