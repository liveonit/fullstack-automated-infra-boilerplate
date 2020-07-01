# Funcionalidad de esta carpeta

En esta carpeta se encontraran todos los archivos de configuracion necesarios para los servicios creados.
Estos archivos de configuracion a partir de templates que completan sus valores con las variables de entornos.

Ejemplo de servicios que precisan archivos de configuracion en este proyecto:

- El proxy de Nginx necesita configurar los ruteos y balanceos, lo cual hace mediante una archivo de configuracion
- Lo mismo con keycloak para cargar toda una configuracion del proyecto

Si se corre el modo dev con docker-compose, en esta carpeta se colocaran los archivos que parten de la carpeta templates y se renderizan con las variables de entorno que deje por defecto, las cuales se deben adaptar a cada proyecto.