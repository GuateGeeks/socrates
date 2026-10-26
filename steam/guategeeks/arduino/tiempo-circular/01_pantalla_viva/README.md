# 01 · Pantalla viva

Enciende la pantalla, dibuja el borde del área visible, marca el centro y escribe dos palabras.

**Sesión 3** · Reto nivel 1 · [Ver la sesión completa](https://guategeeks.com/programas-educativos/tiempo-circular/el-primer-pixel)

> **No verificado en hardware.** Este sketch no ha sido cargado en una placa física.

## Subsistema que prueba

El **bus SPI y la alimentación**, aislados de todo lo demás. No hay tiempo, no hay ángulos, no hay
red. Si la pantalla enciende y muestra el círculo, el cableado está bien y las cinco capas
siguientes tienen dónde apoyarse.

## Pines

| Pin del módulo | ESP32 | Función |
|---|---|---|
| VCC | 3.3 V | Alimentación |
| GND | GND | Tierra |
| SCL | GPIO18 | Reloj SPI |
| SDA | GPIO23 | Datos SPI (MOSI) |
| DC | GPIO25 | Dato o comando |
| CS | GPIO26 | Selección de chip |
| RST | GPIO27 | Reinicio |

SCL y SDA no aparecen en el código: son los pines SPI por defecto del ESP32 y la librería los toma
sola. Los tres que sí se declaran son DC, CS y RST.

## Qué debe verse

Fondo azul oscuro, un círculo blanco delgado pegado al borde, una cruz blanca pequeña en el centro
y las palabras **Tiempo** y **Circular** en amarillo, una arriba y otra abajo del centro.

En el Monitor Serie a 115200 baudios deben aparecer el ancho y el alto que reporta la librería.
Ambos deben decir **240**.

## Por qué un círculo y una cruz

La pantalla es un cuadrado de 240×240 píxeles, pero el vidrio solo deja ver el **círculo inscrito**.
Lo que se dibuje en las esquinas se calcula, se envía y se pierde. El círculo del borde hace visible
ese límite, y la cruz fija el centro (120, 120), que será el origen de todos los cálculos de las
sesiones 5 a 11.

## Evidencia de la sesión

- Fotografía de la pantalla encendida mostrando el círculo, la cruz y el texto
- Bitácora de cableado: las siete conexiones, verificadas una por una y firmadas por el rol de
  Cableado
- Anotación del valor de rotación elegido y por qué

## Si algo falla

| Síntoma | Revisar |
|---|---|
| Pantalla completamente apagada | VCC y GND invertidos, o el módulo sin alimentación |
| Pantalla blanca o con ruido | CS, DC o RST en el GPIO equivocado |
| Enciende pero no dibuja nada | SCL y SDA intercambiados |
| El texto sale de lado o al revés | Valor de `setRotation()`; probar 0, 1, 2 y 3 |
| El Monitor Serie no muestra nada | Velocidad distinta de 115200, o placa equivocada seleccionada |

Más casos en [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

## Procedencia

Código propio, licencia **MIT**. El mapa de pines proviene del tutorial público de esp32io.com sobre
este módulo; el código **no**. Ver [LICENCIAS.md](../LICENCIAS.md).
