# Nodepop v1.0

API de venta de artículos de segunda mano

## Configuración inicial

**Variables de entorno** 

Se debe crear un archivo *.env* en la raiz de la aplicación donde se configurarán las variables de entorno necesarias para la configuración de JWT,  (existe un archivo de ejemplo *.env.example* en la que se indican los datos de iniciales que deben ser configuramos)

```
#contenido .env.example

#Configuracion del script de inicialización
PATH_ANUNCIOS_INICIALES= Ruta del archivo de datos uniciales de anuncios
PATH_USUARIOS_INICIALES= Ruta del archivo de los datos iniciales de usuarios

#Puerto de servidor Nodejs. Si no se configura será el 3000
PORT= Puerto (443 Normalmente si se va a hacer uso de HTTPS)

#Conexion a MongoDB
MONGODB_HOST= Host / Ip del servidor del Mondodb
MONGODB_PORT= PuertoMondodb
MONGODB_DATABASE_NAME= NombreBaseDeDatos

#Configuración JWT
JWT_SECRET= Clave usada para generar el token de JWT
JWT_EXPIRES_IN=2d Tiempo de expiracion del TOken JWT, 2d indica 2 días
```


### JWT
La API utiliza JWT como sistema de autenticación, en el archivo de variables de entorno se configurarán el **secret** y el **tiempo de expiración** del token

### BBDD
La API necesita de una BBDD mongodb para ejecutarse.
En el archivo de entorno se configurarán los datos de conexión:
**host, port, y databasename**


## Scripts
Forma de ejecución: >> npm run < script_name >

**start** 
Ejecuta la API en el servidor

**cluster**
Ejecuta la API haciendo uso de cluster para aprovechar al máximo los recursos del servidor

**dev** Ejecuta la API en modo depuración

**installDB** ejecuta la inicialización de la BBDD con los datos iniciales incluidos en ./init/initialdata/:

_usuarios.json_ Fichero formato JSON en la que se incluyen los usuarios iniciales

Formato del archivo:

	{"usuarios":
		[
			{"name":"nombre","email":"email","password":"password"},
			...
		]
	}

_anuncios.json_ Fichero formato JSON en la que se incluyen los anuncios iniciales

	{"anuncios":
		[
			{"nombre":"nombre",
			"venta":"true/false",
			"precio":"precio"
			"foto" : "ruta foto",
			"tags": ["tag1", "tag2",..]
			},
			...
		]
	}

IMPORTANTE: Este script borra el contenido anterior de las collecciones si existiera.


## Esquemas de los modelos de datos
### Usuarios
	nombre: String 		--> nombre del usuario
	email: String 		--> email del usuario
	password : String 	--> contraseña del usuario
	
	* EL login se establece con la tupla email - password

### Anuncios
	nombre: String 	--> nombre del anuncio
	venta: boolean 	--> true: Es un artículo que se vende
						false: Es un artículo que se busca
	precio: number 	--> precio de venta o que se ofrece en la compra
	foto: String 		--> Ruta a la imagen del artículo
	tags: [String] 	--> Etiquetas que definen al artículo
	
## API

### Usuarios

#### POST /authenticate
Esta llamada permite la autenticación de un usuario obteniendo como respuesta el token que necesitará para llamadas posteriores.

Se le pasa email y contraseña, y se obtiene el token en formato JSON
	
	{
	"success": "true",
	"token": "tokendevuelto" 
	}

#### POST /authenticate/new
Llamada de registro de nuevo usuario, si se hace con éxito devolverá en formato JSON los datos del usuario creado.

Se le pasa obligatoriamente nombre, email y password

### Anuncios

#### GET /anuncios

Llamada que devuelve una lista de anuncios en formato JSON.

 Filtros:
 
 * Si se deja vacio -> muestras todos los anuncios
 * nombre=NOMBRE -> muestras los anuncios que coincidan con nombre o empiecen con ese texto
 * venta=true / false -> muestras los anuncios que se venden / los que se buscan
 * tag=TAGNAME -> muestra los anuncios que contienen TAGNAME entre sus tags
  
Opciones:
 
 * includeTotal=true -> se añadirá al resultado el numero total de elementos que coincidan con la busqueda independientemente del valor de skip y limit (util para paginación)
 * limit=X -> los resultados obtenimos serán como máximo X elementos
 * skip=X -> numero de elementos que se saltan (skip y limit se combinan para paginación)
 * sort=FIELD -> campo por el que se ordenaran los resultados
 * fields= campos (sepadaos por espacio) -> solo se obtendrán esos campos en los resultados
 
 
 
___El token de autenticación obtenido de la llamada a **POST /authenticate**	se tiene que pasar a esta llamada para que ejecutar (El token se puede pasar en el *body* , en el *query* o en el *header* con la clave 'x-access-token'.___
 
#### GET /anuncios/id

Se obtiene el anuncio correspondiente al identificado id en formato JSON

___El token de autenticación obtenido de la llamada a **POST /authenticate**	se tiene que pasar a esta llamada para que ejecutar (El token se puede pasar en el *body* , en el *query* o en el *header* con la clave 'x-access-token'.___

#### GET	/anuncios/tags

Se obtienen un JSON con las tags disponibles en la base de datos

___El token de autenticación obtenido de la llamada a **POST /authenticate**	se tiene que pasar a esta llamada para que ejecutar (El token se puede pasar en el *body* , en el *query* o en el *header* con la clave 'x-access-token'.___

#### POST /anuncios/new

Llamada de registro de un nuevo anuncio, si se hace con écito devolverá en formato JSON los datos del anuncio creado.

___El token de autenticación obtenido de la llamada a **POST /authenticate**	se tiene que pasar a esta llamada para que ejecutar (El token se puede pasar en el *body* , en el *query* o en el *header* con la clave 'x-access-token'.___


## HTTPS
Esta API corre en servidor seguro https
Se deben incluir los certificados en el directorio *certificados*
Siendo host.cert y host.key los nombres de los archivos de la clave pública y privada, respectivamente


## Cluster
La API está desarrollada para aprovechar al máximo los recursos de la máquina donde se ejecuta.
Para ello se puede ejecutar en cluster, para ello simplemente debe ejecutarse la opción indicada en Scripts

## Internacionalización
La API está pensada para hacerla multilenguaje. Para ello se debe añadir en la cabecera de las peticiones la cabecera

	Accept-Language

A la que se le debe pasar el valor del idioma que se desea usar.
Actualmente estos puedes ser:

'es' -> para español

'en' -> para inglés (valor por defecto)

* Si se desea añadir otro idioma, simplemente se debe incluir en la carpeta *locales* el archivo xx.js, siendo xx el idioma deseado

# Despliegue en AWS

### Características del despliegue:

- Instancia EC2 de amazon web services (AWS)
- S.O. Ubuntu Server 16.04
- Node como servidor de aplicaciónes
- Servidor web / Proxy inverso : Nginx
- Gestor de procesos: PM2 (para mantener viva la aplicación )
- Mongo DB como servidor de BBDD
- Certificados de Letsencryt para servir bajo el protocolo https

### Posibles accesos

- **Usando IP directa o usando el subdominio www** 

[http://34.242.133.91/](http://34.242.133.91/)

[https://www.erpnet.es/](https://www.erpnet.es/)

Accediendo al subdominio www o directamente a la IP del servidor, podremos visualizar la plantilla web estática desplegada y servida directamente por Nginx. (Si se accede a la IP directamente al no estar incluido en el certificado saldrá como página no segura)

- **Usando el subdominio nodepop**

[https://nodepop.erpnet.es/](https://nodepop.erpnet.es/)

Para poder comprobar que los archivos estáticos son servidos y cacheados por Nginx se ha creado está web que muestra los anuncios dados de alta en la aplicación.
Para poder verificarlo se ha añadido una cabecera personalizada a los archivos estáticos, "X-Owner: jventor" , que se puede ver con el depurador del navegador (chrome, por ejemplo)

- **usando el dominio api**

[https://api.erpnet.es/apiv1/](https://api.erpnet.es/apiv1/)

Esta dirección apunta directamente a la raiz de la API de la aplicación Nodepop
