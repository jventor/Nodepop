# Nodepop
## Configuración inicial

**Variables de entorno** 

Se debe crear un archivo *.env* en la raiz de la aplicación (existe un archivo de ejemplo *.env.example* en la que se indican los datos de iniciales que deben ser configuramos)


### BBDD
La API necesita de una BBDD mongodb para ejecutarse.
En el archivo de entorno se configurarán los datos de conexión:
**host, port, y databasename**


## Scripts
Forma de ejecución: >> npm run < script_name >

**start** 
Ejecuta la API en el servidor

**dev** Ejecuta la API en modo depuración

**init** ejecuta la inicialización de la BBDD con los datos iniciales incluidos en ./init/initialdata/:

_usuarios.json_ Fichero formato JSON en la que se incluyen los usuarios iniciales

_anuncios.json_ Fichero formato JSON en la que se incluyen los anuncios iniciales

IMPORTANTE: Este script borra el contenido anterior de las collecciones si existiera.