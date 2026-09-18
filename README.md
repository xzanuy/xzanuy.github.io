# Xavier Zanuy

Portfolio personal: producto, IA y aplicaciones propias.

**Web:** https://xzanuy.github.io/

## Desarrollo

Node.js 20 o posterior. Sin dependencias externas de ejecución ni instalación necesaria.

```sh
npm run dev
```

La vista local está en http://127.0.0.1:4173.

## Editar contenido

- `copy.js`: textos y traducciones ES/EN.
- `projects.js`: proyectos, estados, tecnologías y casos.
- `views.js`: plantillas compartidas por el HTML estático y la interfaz.
- `app.js`: idiomas, diálogos accesibles, historial y contacto.
- `styles.css`: diseño responsive y movimiento reducido.

Después de cambiar contenido o plantillas:

```sh
npm run build
```

El comando actualiza el contenido prerenderizado de `index.html`, que también se puede leer sin JavaScript. No hay compilación de frontend ni servicio de backend.

## Publicación

GitHub Pages publica la raíz de `main`. El archivo `.nojekyll` permite servir los recursos sin procesamiento Jekyll. Al actualizar contenido, ejecutar `npm run build`, revisar, confirmar los cambios y hacer push a `main`.

La versión inglesa se abre con `?lang=en`. Los casos admiten enlaces directos, por ejemplo `#case-typeglow`.

## Recursos

Las tipografías Manrope e Instrument Serif se sirven desde este repositorio; sus licencias OFL están en `assets/fonts/`. Los iconos y capturas pertenecen a los proyectos mostrados. La imagen de portada de TypeGlow es una visualización de producto generada a partir de una captura real. La captura de Solo Training corresponde a su web pública. Las pantallas de los casos son capturas reales de las aplicaciones.

La web no incorpora analítica, cookies, formularios de envío ni peticiones a servicios de IA. Los enlaces de contacto abren email, LinkedIn o GitHub.
