# QA Testing Report - ATS Web Project

Este documento contiene el reporte final de las pruebas de calidad (QA) ejecutadas sobre el sistema contable, basadas en las historias de usuario y features del documento `Features_AccountingSystem.md`.

Las pruebas se ejecutaron directamente sobre el entorno desplegado: `https://ats-app-t6f3.onrender.com/`.

---

## Historia de Usuario: US-01 / Feature: FT-01 (User Identity & Secure Access)

**Descripción:** As a user, I want to register and log in to protect my information.

### Casos de Prueba (CP-GP)

| ID | Caso de Prueba | Pasos | Resultado Esperado | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **CP-GP-01** | Login Válido | 1. Ingresar correo y contraseña de un usuario válido.<br>2. Clic en Iniciar Sesión. | Redirección exitosa al Dashboard de la aplicación. | ✅ Funcional |
| **CP-GP-02** | Login Inválido (Credenciales Erróneas) | 1. Ingresar credenciales que no existen en la BD.<br>2. Clic en Iniciar Sesión. | Mostrar mensaje: "Credenciales incorrectas. Verifica tu usuario y contraseña." | ✅ Funcional |
| **CP-GP-03** | Datos Inválidos en Campo Numérico (RUC) | 1. Ir a Registro.<br>2. Intentar ingresar letras en el campo "Número de RUC". | El sistema muestra: "El RUC debe tener 13 dígitos numéricos" o bloquea el input. | ✅ Funcional |
| **CP-GP-04** | Envío de Formulario Vacío | 1. Dejar todos los campos en blanco.<br>2. Hacer clic en "Iniciar Sesión" / "Crear Cuenta". | Mensajes de validación indicando que los campos son obligatorios. | ✅ Funcional |
| **CP-GP-05** | Registro Válido | 1. Llenar el formulario de registro con datos válidos y únicos.<br>2. Clic en Crear Cuenta. | Creación exitosa de cuenta y redirección automática al sistema. | ✅ Funcional |
| **CP-GP-06** | Intento de SQL Injection / XSS | 1. Ingresar payloads como `' OR 1=1 --` o `<script>alert(1)</script>` en el campo Nombres. | El sistema sanitiza el input, lo trata como texto plano y no rompe la DB. | ✅ Funcional |
| **CP-GP-07** | Números Negativos en RUC | 1. Ir a Registro.<br>2. Ingresar un número negativo (ej. `-1234567890001`) en el RUC. | El sistema debe rechazar el signo menos, permitiendo estrictamente solo dígitos del 0 al 9. | ❌ No Funcional |
| **CP-GP-08** | Acceso Forzado a Rutas Protegidas | 1. Sin iniciar sesión, navegar directamente a `/dashboard` o `/invoices` desde la URL. | El servidor deniega el acceso, redirige a login o retorna error (protegiendo los datos). | ✅ Funcional |

---

## Feature: FT-02 (Workspace & Project Isolation)

| ID | Caso de Prueba | Pasos | Resultado Esperado | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **CP-GP-09** | Crear workspace válido | 1. Ingresar RUC y Año fiscal válidos.<br>2. Crear. | Directorio aislado creado correctamente. | ⏳ Pendiente |
| **CP-GP-10** | Crear workspace duplicado | 1. Ingresar RUC y Año ya existentes. | Muestra error: "El workspace ya existe". | ⏳ Pendiente |
| **CP-GP-11** | Aislamiento de datos | 1. Subir factura en RUC A.<br>2. Entrar a RUC B. | Factura de RUC A no es visible en RUC B. | ⏳ Pendiente |
| **CP-GP-12** | Acceso a otro workspace | 1. Forzar ruta de un workspace de otro usuario. | Acceso denegado (403 Forbidden). | ⏳ Pendiente |
| **CP-GP-13** | Caracteres inválidos en ruta | 1. Intentar crear con caracteres especiales en RUC. | El sistema sanitiza el input y rechaza. | ⏳ Pendiente |
| **CP-GP-14** | Eliminación de workspace | 1. Clic en eliminar workspace y confirmar. | Se borran los archivos y metadatos asociados. | ⏳ Pendiente |
| **CP-GP-15** | Límite de workspaces | 1. Crear más de N workspaces permitidos. | Muestra mensaje de límite alcanzado. | ⏳ Pendiente |
| **CP-GP-16** | Filtrado en listado | 1. Usar barra de búsqueda por RUC. | Solo se muestran los workspaces coincidentes. | ⏳ Pendiente |

---

## Feature: FT-03 (SRI Service Handshake)

| ID | Caso de Prueba | Pasos | Resultado Esperado | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **CP-GP-17** | Conexión exitosa | 1. Ingresar credenciales SRI.<br>2. Conectar. | Status cambia a "Conectado al SRI". | ⏳ Pendiente |
| **CP-GP-18** | Credencial inválida SRI | 1. Ingresar clave SRI incorrecta. | El portal SRI rechaza y app muestra error. | ⏳ Pendiente |
| **CP-GP-19** | Timeout de conexión | 1. Simular lentitud extrema en conexión al SRI. | Muestra "Tiempo de espera agotado, reintentar". | ⏳ Pendiente |
| **CP-GP-20** | Caída de red local | 1. Cortar internet durante handshake. | Se captura la excepción y avisa al usuario. | ⏳ Pendiente |
| **CP-GP-21** | Error 500 del SRI | 1. Simular que SRI está caído (Mantenimiento). | Muestra "Servicio SRI no disponible temporalmente". | ⏳ Pendiente |
| **CP-GP-22** | Renovación de token | 1. Esperar a que expire la sesión SRI y recargar. | Pide reconectar o renueva automáticamente. | ⏳ Pendiente |
| **CP-GP-23** | Conexiones concurrentes | 1. Abrir 2 pestañas intentando conectar al mismo tiempo. | Se gestiona una sola sesión SRI. | ⏳ Pendiente |
| **CP-GP-24** | Validar certificado SRI | 1. Conectar interceptando SSL (Proxy). | Falla la conexión por seguridad (Man in the middle). | ⏳ Pendiente |

---

## Feature: FT-04 (Automated Invoice Retrieval)

| ID | Caso de Prueba | Pasos | Resultado Esperado | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **CP-GP-25** | Descarga exitosa XML | 1. Clic en "Sincronizar Facturas". | Se descargan todos los comprobantes del mes. | ⏳ Pendiente |
| **CP-GP-26** | Mes sin facturas | 1. Sincronizar un mes vacío. | Notifica: "No se encontraron facturas en este periodo". | ⏳ Pendiente |
| **CP-GP-27** | Límite por lote SRI | 1. Descargar mes con +5000 facturas. | El sistema pagina la petición para no colgarse. | ⏳ Pendiente |
| **CP-GP-28** | Falla parcial (Reintento) | 1. Falla descarga a la mitad y dar "Reintentar". | Retoma desde el archivo faltante, no desde cero. | ⏳ Pendiente |
| **CP-GP-29** | Archivo PDF corrupto | 1. SRI devuelve PDF corrupto. | Descarga XML válido y marca PDF como indisponible. | ⏳ Pendiente |
| **CP-GP-30** | Cancelar descarga | 1. Iniciar sincronización y dar "Cancelar". | El proceso en background se detiene limpiamente. | ⏳ Pendiente |
| **CP-GP-31** | Doble clic sincronizar | 1. Hacer spam clic en "Sincronizar". | El botón se deshabilita durante el proceso. | ⏳ Pendiente |
| **CP-GP-32** | Verificación hash | 1. Validar peso del archivo tras descarga. | El XML no está truncado ni pesa 0 bytes. | ⏳ Pendiente |

---

## Feature: FT-05 (Fiscal Data Timeline Filtering)

| ID | Caso de Prueba | Pasos | Resultado Esperado | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **CP-GP-33** | Filtro mes específico | 1. Seleccionar "Mayo". | La tabla muestra solo facturas de Mayo. | ⏳ Pendiente |
| **CP-GP-34** | Filtro semestral | 1. Seleccionar "Semestre 1". | Se muestran datos de Enero a Junio. | ⏳ Pendiente |
| **CP-GP-35** | Rango personalizado | 1. Inicio: 15 Mayo / Fin: 20 Mayo. | Filtra estrictamente entre esos días. | ⏳ Pendiente |
| **CP-GP-36** | Rango invertido | 1. Inicio: 30 Mayo / Fin: 01 Mayo. | El UI no permite seleccionar o muestra error. | ⏳ Pendiente |
| **CP-GP-37** | Año bisiesto | 1. Filtrar por 29 de Febrero. | El calendario y el filtro lo procesan bien. | ⏳ Pendiente |
| **CP-GP-38** | Cambio dinámico | 1. Cambiar filtro sin presionar "Buscar". | La tabla se actualiza reactivamente. | ⏳ Pendiente |
| **CP-GP-39** | Filtro fecha futura | 1. Intentar filtrar mes siguiente. | Se muestra vacío o deshabilitado si no hay datos. | ⏳ Pendiente |
| **CP-GP-40** | Borrar filtros | 1. Clic en "Limpiar". | Vuelve a mostrar todo el periodo por defecto. | ⏳ Pendiente |

---

## Feature: FT-06 (Local Import & Ownership Integrity)

| ID | Caso de Prueba | Pasos | Resultado Esperado | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **CP-GP-41** | Importar XML válido | 1. Subir XML de factura local. | Se añade al sistema y tabla correctamente. | ✅ Funcional |
| **CP-GP-42** | Subida Drag & Drop | 1. Arrastrar 50 XMLs a la zona de subida. | Se procesan todos asíncronamente con loader. | ✅ Funcional |
| **CP-GP-43** | RUC no coincide | 1. Subir factura del RUC X al workspace RUC Y. | Rechazada: "La factura no pertenece a este RUC". | ✅ Funcional |
| **CP-GP-44** | Formato no XML | 1. Intentar subir imagen o .exe. | Rechazada por validación de MIME type. | ⚠️ UI Estática (Pendiente) |
| **CP-GP-45** | Factura duplicada | 1. Subir XML que ya está en el sistema. | Muestra: "Comprobante ya importado" y lo ignora. | ⚠️ UI Estática (Pendiente) |
| **CP-GP-46** | XML malformado | 1. Subir archivo .xml con etiquetas borradas. | Captura error de parsing XML y avisa al usuario. | ✅ Funcional |
| **CP-GP-47** | Límite de tamaño | 1. Subir un archivo gigante (> 10MB). | UI bloquea subida por exceso de tamaño. | ⚠️ UI Estática (Pendiente) |
| **CP-GP-48** | Falla a mitad de carga | 1. Refrescar página mientras sube archivos. | Archivos cargados persisten, los demás no. | ⚠️ UI Estática (Pendiente) |

---

## Feature: FT-07 (ATS XLSM Generation Engine)

| ID | Caso de Prueba | Pasos | Resultado Esperado | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **CP-GP-49** | Generación Base | 1. Clic en "Generar Borrador XLSM". | Crea un .xlsm con los datos cargados. | ⏳ Pendiente |
| **CP-GP-50** | Generación vacía | 1. Intentar generar sin tener facturas. | Botón deshabilitado o alerta "No hay datos". | ⏳ Pendiente |
| **CP-GP-51** | Mapeo de decimales | 1. Generar con facturas de 4 decimales. | El XLSM redondea/trunca según norma SRI. | ⏳ Pendiente |
| **CP-GP-52** | Campos nulos | 1. Facturas sin ciertos datos opcionales. | El mapeo deja celda vacía o valor por defecto SRI. | ⏳ Pendiente |
| **CP-GP-53** | Concurrencia de macro | 1. Generar reporte al mismo tiempo que otro user. | Motor soporta colas sin cruzar archivos. | ⏳ Pendiente |
| **CP-GP-54** | Nombramiento Archivo | 1. Verificar nombre del archivo al descargar. | Formato correcto ej: `ATS_0991234567001_052026.xlsm`. | ⏳ Pendiente |
| **CP-GP-55** | Sumatoria total | 1. Revisar fila de totales en XLSM. | Fórmulas de Excel se aplican correctamente en la hoja. | ⏳ Pendiente |
| **CP-GP-56** | Límite de filas excel | 1. Generar con más de 1 millón facturas. | El sistema lo divide o alerta el límite de hoja Excel. | ⏳ Pendiente |

---

## Feature: FT-08 (XLSM Structural Diagnostics)

| ID | Caso de Prueba | Pasos | Resultado Esperado | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **CP-GP-57** | Diagnóstico Limpio | 1. Escanear XLSM sin errores. | Muestra "Estructura válida, listo para XML". | ⏳ Pendiente |
| **CP-GP-58** | Sumatoria Rota | 1. Alterar fórmula de totales en XLSM y subir. | Detecta que el subtotal + IVA no coincide con Total. | ⏳ Pendiente |
| **CP-GP-59** | Cédula Inválida | 1. Cliente con CI de 9 dígitos. | Lanza error indicando la celda exacta y el motivo. | ⏳ Pendiente |
| **CP-GP-60** | Fecha Inválida | 1. Fecha fuera de formato (ej. 2026/05/13 en vez de dd/mm). | Lanza error de formato de fecha. | ⏳ Pendiente |
| **CP-GP-61** | Código Retención obsoleto | 1. Ingresar código retención que ya no rige. | El diagnóstico cruza con el catálogo SRI actual y falla. | ⏳ Pendiente |
| **CP-GP-62** | Exportar Log Errores | 1. Clic en "Descargar Reporte Errores". | Genera txt/pdf con la lista de filas y motivos. | ⏳ Pendiente |
| **CP-GP-63** | Validación masiva | 1. XLSM con múltiples errores en múltiples hojas. | Devuelve todos los errores de una sola pasada. | ⏳ Pendiente |
| **CP-GP-64** | Re-validación | 1. Corregir error, volver a escanear. | El error desaparece del diagnóstico. | ⏳ Pendiente |

---

## Feature: FT-09 (Official XML Encoding DIMM SRI)

| ID | Caso de Prueba | Pasos | Resultado Esperado | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **CP-GP-65** | Conversión válida | 1. Clic en "Generar XML Oficial". | Archivo .xml estructurado creado con éxito. | ⏳ Pendiente |
| **CP-GP-66** | Conversión prematura | 1. Intentar convertir un XLSM que no pasó diagnóstico. | Botón bloqueado indicando que primero solucione errores. | ⏳ Pendiente |
| **CP-GP-67** | Codificación caracteres | 1. Nombres con 'Ñ' o tildes. | El XML final está en UTF-8 válido sin caracteres raros. | ⏳ Pendiente |
| **CP-GP-68** | Esquema XSD | 1. Pasar el XML generado por el validador oficial XSD. | Schema match perfecto sin errores estructurales. | ⏳ Pendiente |
| **CP-GP-69** | Tamaño final | 1. Verificar tamaño de archivo. | XML se minifica correctamente para fácil envío. | ⏳ Pendiente |
| **CP-GP-70** | Generación segura | 1. Interceptar red al dar Clic "Descargar". | Solo el dueño de la sesión puede descargarlo. | ⏳ Pendiente |
| **CP-GP-71** | Metadatos DIMM | 1. Revisar tag `<IdInformante>`. | Corresponde estrictamente al RUC del workspace. | ⏳ Pendiente |
| **CP-GP-72** | Integridad (Hash) | 1. Descargar dos veces el mismo reporte. | El archivo resultante es idéntico a nivel de bytes. | ⏳ Pendiente |

---

## Feature: FT-10 (Workflow Traceability Dashboard)

| ID | Caso de Prueba | Pasos | Resultado Esperado | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **CP-GP-73** | Cambio a Conectado | 1. Validar SRI con éxito. | En dashboard, módulo SRI se marca "Check verde". | ⏳ Pendiente |
| **CP-GP-74** | Barra de progreso | 1. Iniciar importación pesada. | El loader muestra avance % progresivo, no se congela. | ⏳ Pendiente |
| **CP-GP-75** | Alertas en vivo | 1. Ocurre error de diagnóstico en Mod 5. | Widget de dashboard parpadea en rojo mostrando el error. | ⏳ Pendiente |
| **CP-GP-76** | Reversión de paso | 1. Eliminar una factura ya importada. | Si ya estaba en Mod 4, regresa el tracker al Mod 3 (Pendiente). | ⏳ Pendiente |
| **CP-GP-77** | Persistencia de estado | 1. Completar paso 2, cerrar sesión, volver a entrar. | El dashboard recuerda que el paso 2 ya se hizo. | ⏳ Pendiente |
| **CP-GP-78** | Interfaz responsive | 1. Abrir dashboard en móvil. | Gráficos y timeline se adaptan al ancho de pantalla. | ⏳ Pendiente |
| **CP-GP-79** | Estado bloqueante | 1. Intentar saltar del paso 2 al 6 directamente. | Sistema visualiza pasos intermedios como requeridos (Gris/Bloqueado). | ⏳ Pendiente |
| **CP-GP-80** | Estado Final Completado | 1. Descargar XML final oficial. | Todo el pipeline se marca verde brillante "Completado". | ⏳ Pendiente |

---

## Informe Final de Errores Encontrados

Los siguientes casos de prueba no cumplieron con el resultado esperado y requieren atención por parte del equipo de desarrollo:

### 1. CP-GP-07: Validación de Signos Negativos en RUC (No Funcional)
* **Descripción del Fallo:** El campo "Número de RUC" en el formulario de registro permite el ingreso del carácter especial guion / signo de resta (`-`). 
* **Impacto:** Un usuario puede ingresar un RUC negativo (por ejemplo, `-123456789000`), lo cual es un formato fiscal inválido. Esto podría causar inconsistencias en la base de datos o fallos al generar los archivos XML/XLSM (Feature FT-07) más adelante, ya que la validación estructural estricta del SRI fallará.
* **Recomendación:** Aplicar una directiva de teclado o un patrón Regex (`^[0-9]{13}$`) en el frontend que impida la escritura de cualquier carácter que no sea un número del 0 al 9, bloqueando explícitamente el guion (`-`).

### 2. Observación Técnica Secundaria: Enrutamiento SPA
* **Descripción del Comportamiento:** Al intentar acceder directamente a rutas internas protegidas (ej. escribiendo la URL manualmente), el servidor Render devuelve un error 404 estricto en lugar de redirigir limpiamente a la aplicación de React. 
* **Impacto:** Aunque se considera *Funcional* a nivel de seguridad (porque los datos están protegidos), la experiencia de usuario (UX) se ve afectada.
* **Recomendación:** Asegurarse de configurar `_redirects` o configurar el servidor estático en Render para redirigir todas las peticiones `/*` a `index.html`.
