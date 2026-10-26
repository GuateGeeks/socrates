# Solución de problemas · Tiempo Circular

## Estado de verificación de este material

Conviene ser exacto sobre qué se comprobó y qué no.

| Qué | Estado |
|---|---|
| Carga y ejecución en una placa ESP32 física | **No verificado.** No hay hardware disponible |
| Compilación con `arduino-cli` | **No ejecutada.** `arduino-cli` no está instalado en la máquina donde se escribió este material |
| API de la librería `DIYables TFT Round` | **Inferida.** El índice de librerías de Arduino confirma que depende de `Adafruit GFX Library`, de modo que `fillScreen`, `drawCircle`, `drawLine`, `fillCircle`, `fillRect`, `setCursor`, `setTextColor`, `setTextSize`, `print`, `width` y `height` son métodos heredados de Adafruit GFX. El nombre de la clase y del encabezado provienen del tutorial público de esp32io.com y del repositorio de la librería |
| Mapa de pines | Tomado del tutorial público de esp32io.com. No verificado en físico |
| Aritmética de ángulos, RGB565 y del ciclo de 260 días | Verificable en papel; los sketches imprimen sus propios cálculos para que se contrasten |

Si al cargar el primer sketch aparece un error de compilación por un método que no existe, es esto:
el nombre exacto de algún método de la librería puede diferir. La solución es abrir los ejemplos que
trae la librería instalada y ajustar la llamada. **Reportarlo sería útil.**

## Preparación del entorno ESP32

El ESP32 no viene configurado en el Arduino IDE. Es una cadena de herramientas distinta de la del
Arduino Uno que usa [GuateGeeks SMARS](https://guategeeks.com/programas-educativos/guategeeks), así
que aunque ya se haya trabajado ese programa, esto hay que hacerlo igual.

### 1. Agregar el gestor de tarjetas

1. Arduino IDE → **Preferencias**
2. En «Gestor de URLs adicionales de tarjetas», agregar:
   ```
   https://espressif.github.io/arduino-esp32/package_esp32_index.json
   ```
3. Aceptar

### 2. Instalar el core

1. **Herramientas → Placa → Gestor de tarjetas**
2. Buscar **esp32**
3. Instalar el paquete de Espressif Systems

Es una descarga grande. Con conexión lenta conviene hacerlo antes de la clase, no durante.

### 3. Instalar la librería

1. Ir al ícono de **Librerías** en la barra lateral
2. Buscar **DIYables TFT Round**
3. Instalar, y aceptar **Install All** cuando pregunte por las dependencias

La dependencia que instala es `Adafruit GFX Library`. Si se instala solo la primera y se rechazan
las dependencias, nada compila.

### 4. Seleccionar placa y puerto

- **Herramientas → Placa → esp32 → ESP32 Dev Module** (o el modelo específico de la placa)
- **Herramientas → Puerto →** el puerto que aparece al conectar la placa

### 5. El driver USB-serie

Si al conectar la placa no aparece ningún puerto nuevo, falta el driver del chip USB-serie. Hay dos
comunes, y hay que identificar cuál trae la placa mirando el chip pequeño junto al conector USB:

| Chip | Driver |
|---|---|
| CP2102 | Driver VCP de Silicon Labs |
| CH340 / CH9102 | Driver CH34x de WCH |

En macOS reciente puede requerir autorizar la extensión en **Configuración → Privacidad y
seguridad** después de instalarla y reiniciar.

## Fallas frecuentes

### La placa no aparece como puerto

| Causa | Qué hacer |
|---|---|
| Cable USB solo de carga | Cambiar por un cable de datos. Es la causa más común |
| Driver USB-serie no instalado | Ver la sección anterior |
| Puerto ocupado por otro programa | Cerrar el Monitor Serie de otra ventana del IDE |

### Error al subir el sketch

| Mensaje | Qué hacer |
|---|---|
| `Failed to connect to ESP32` | Mantener presionado el botón **BOOT** de la placa mientras empieza la subida |
| `A fatal error occurred: Timed out` | Bajar la velocidad de subida en Herramientas, o cambiar de cable |
| `Sketch too big` | Placa equivocada seleccionada |

### La pantalla no muestra nada

Antes de tocar el código, revisar las siete conexiones en este orden:

1. **VCC a 3.3 V**, no a 5 V ni a un pin de datos
2. **GND a GND**
3. SCL a **GPIO18**
4. SDA a **GPIO23**
5. DC a **GPIO25**
6. CS a **GPIO26**
7. RST a **GPIO27**

| Síntoma | Causa probable |
|---|---|
| Completamente apagada | Alimentación: VCC o GND |
| Blanca o con ruido | CS, DC o RST en el pin equivocado |
| Enciende pero no dibuja | SCL y SDA intercambiados |
| Dibuja pero de lado | Valor de `setRotation()`; probar 0, 1, 2 y 3 |

### El dibujo sale mal

| Síntoma | Causa |
|---|---|
| La carátula está de cabeza | El signo de la fórmula de Y: debe ser `CY - r*cos`, con menos |
| La manecilla apunta a las 9 en vez de a las 3 | Signo del seno, o el ángulo se está midiendo al revés |
| Todo pegado a una esquina | `CX` y `CY` distintos de 120 |
| Los ángulos dan valores absurdos | Falta convertir a radianes: `sin()` y `cos()` no reciben grados |
| Los 13 puntos del Cholq'ij se amontonan | División entera: `360/13` da 27, hay que escribir `360.0/13` |

### La pantalla parpadea

Se está limpiando la pantalla completa en cada vuelta del `loop`. Hay que borrar solo lo que cambió.
Está explicado en el [README de `04_reloj_millis`](04_reloj_millis/README.md).

### WiFi y NTP

| Síntoma | Causa |
|---|---|
| `credenciales.h: No such file or directory` | Falta copiar `credenciales.h.ejemplo` y renombrarlo |
| No conecta nunca | Red de 5 GHz: el ESP32 solo usa 2.4 GHz |
| Conecta pero no llega la hora | La red bloquea NTP. Usar la ruta alterna de la sesión 10 |
| La hora sale seis horas adelantada | Se está mostrando UTC: revisar `OFFSET_UTC_SEG` |

## Por qué no hay un módulo RTC

El tutorial del que salieron el pinout y el cableado recomienda agregar un **DS3231** para tener hora
real. Este programa **no lo usa**, y la decisión es pedagógica, no de costo.

Un RTC daría la hora correcta desde la primera sesión y con eso desaparecerían las sesiones 8, 9 y
10 tal como están planteadas: no habría deriva que medir, ni error experimental que reportar con
cifras significativas, ni razón para introducir NTP y los husos horarios. El reloj impreciso es el
material de tres sesiones.

Si alguien quisiera agregarlo de todos modos, costaría unos Q25 por equipo, ocuparía dos pines más
por I²C, y convendría hacerlo **después** de la sesión 9, como extensión: una vez medida la deriva,
comparar el mismo montaje con y sin RTC es un buen cierre.

## Cuando nada de esto sirve

Volver a la capa anterior. La progresión de sketches existe justamente para esto: si
`04_reloj_millis` falla pero `03_geometria_circular` dibuja bien, el problema está en el manejo del
tiempo y no en la geometría. Reducir el espacio de búsqueda antes de leer código línea por línea es
más rápido que adivinar.
