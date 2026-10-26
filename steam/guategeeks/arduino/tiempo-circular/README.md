# Tiempo Circular · Sketches ESP32

Seis sketches por capas para el programa [Tiempo Circular](https://guategeeks.com/programas-educativos/tiempo-circular),
de segundo básico. Cada uno prueba **un** subsistema en aislamiento antes de integrarlo.

> **Estado: no verificado en hardware.** Ninguno de estos sketches ha sido cargado en una placa
> física. El hardware está especificado pero no adquirido. Ver
> [TROUBLESHOOTING.md](TROUBLESHOOTING.md) para el alcance exacto de lo que sí se comprobó.

## Hardware canónico

| Cant. | Componente | Nota |
|:--:|---|---|
| 1 | Placa de desarrollo ESP32 | Cualquiera con los GPIO listados abajo expuestos |
| 1 | Módulo TFT redondo 1.28" GC9A01 | 240×240, IPS, bus SPI, sin táctil |
| 1 | Cable USB de datos | Para alimentar y programar |
| 1 | Protoboard y jumpers | 7 conexiones |

**No** se usa módulo de reloj de tiempo real (RTC) ni módulo de tarjeta SD. La hora sale de
`millis()` y después de NTP por el WiFi del propio ESP32.

## Mapa de pines

Este es el **único** mapa de pines del programa. Los seis sketches lo usan sin variaciones.

| Pin del módulo TFT | ESP32 | Función |
|---|---|---|
| VCC | 3.3 V | Alimentación |
| GND | GND | Tierra |
| SCL | GPIO18 | Reloj SPI |
| SDA | GPIO23 | Datos SPI (MOSI) |
| DC | GPIO25 | Dato o comando |
| CS | GPIO26 | Selección de chip |
| RST | GPIO27 | Reinicio |

## Progresión

| Sketch | Sesión | Subsistema que prueba en aislamiento |
|---|:--:|---|
| [`01_pantalla_viva`](01_pantalla_viva/) | 3 | SPI, alimentación, `begin()`, rotación, relleno y texto |
| [`02_color_y_bits`](02_color_y_bits/) | 4 | RGB565 armado desde componentes; binario, hexadecimal y decimal |
| [`03_geometria_circular`](03_geometria_circular/) | 5-7 | Centro y radio, ángulos notables, manecilla por seno y coseno |
| [`04_reloj_millis`](04_reloj_millis/) | 8-9 | Reloj analógico y digital sobre `millis()`, redibujo parcial |
| [`05_reloj_ntp`](05_reloj_ntp/) | 10 | WiFi, NTP, huso horario UTC-6 |
| [`06_cholqij`](06_cholqij/) | 11 | Anillo de 20 a 18°, ciclo de 13 a 360/13, conteo desde un ancla |

Si el reloj falla, se vuelve a la capa anterior para localizar el problema. Un fallo en
`04_reloj_millis` que no aparece en `03_geometria_circular` está en el manejo del tiempo, no en el
dibujo.

## Librería

`DIYables TFT Round` de DIYables.io, que depende de `Adafruit GFX Library`. Se instala desde el
gestor de librerías del Arduino IDE buscando **«DIYables TFT Round»** y aceptando la instalación de
dependencias. Ver [TROUBLESHOOTING.md](TROUBLESHOOTING.md) para el resto de la preparación del
entorno ESP32.

La librería **no se distribuye aquí**: se cita y se instala desde su origen.

## Convenciones del código

- Comentarios en español.
- Los colores se arman con una función `rgb565()` propia en lugar de constantes de la librería. Eso
  es deliberado: en la sesión 4 el color **es** el contenido, y una constante opaca lo escondería.
- Las coordenadas se calculan siempre con la misma pareja de fórmulas, explicada en
  [`03_geometria_circular`](03_geometria_circular/README.md).
- Las credenciales de WiFi van en un archivo `credenciales.h` aparte, que **no se versiona**.

## Licencia

Código propio bajo **MIT**. Ver [LICENCIAS.md](LICENCIAS.md) para la atribución completa, incluido
qué se tomó del tutorial público de esp32io.com y qué no.
