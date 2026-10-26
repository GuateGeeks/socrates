# 04 · El reloj que deriva

Reloj analógico y digital completo, sobre `millis()`. Sin red.

**Sesiones 8 y 9** · Reto niveles 2 y 3 ·
[Sesión 8](https://guategeeks.com/programas-educativos/tiempo-circular/el-reloj-que-deriva) ·
[Sesión 9](https://guategeeks.com/programas-educativos/tiempo-circular/medir-la-deriva)

> **No verificado en hardware.** Este sketch no ha sido cargado en una placa física.

## Subsistema que prueba

El **manejo del tiempo** y el **redibujo parcial**. La geometría ya quedó resuelta en la capa
anterior, así que si una manecilla aparece en el lugar equivocado el problema está aquí, en cómo se
convierte el tiempo en ángulos, y no en las fórmulas.

## Este reloj está mal a propósito

`millis()` cuenta milisegundos desde que la placa arrancó, usando el oscilador del ESP32. Ese
oscilador **no es exacto**, así que el reloj se adelanta o se atrasa de forma medible. Además,
`millis()` no sabe qué hora es: hay que escribirle una hora inicial a mano, y cada reinicio la
devuelve a ese valor.

Las dos cosas son observables en una clase, y las dos son el contenido de la sesión 9. No hay que
arreglarlas todavía.

## Los tres ángulos

```
segundero   6°/s              360° ÷ 60 s          ← movimiento circular uniforme
minutero    6°/min            360° ÷ 60 min
horario     30°/h + 0.5°/min  360° ÷ 12 h, más el avance dentro de la hora
```

El medio grado por minuto del horario es lo que evita que se quede clavado en la hora en punto
durante sesenta minutos y salte de golpe. Quitarlo y ver el resultado es un buen experimento.

### El segundero es MCU

**CN 4.3.1** pide describir el movimiento circular uniforme «de una partícula conocida y las
magnitudes que intervienen». El segundero lo es:

| Magnitud | Valor |
|---|---|
| Velocidad angular | 6°/s, constante |
| Período | 60 s |
| Frecuencia | 1/60 Hz |

La diferencia con el ejemplo del libro es que aquí los estudiantes escriben la línea que lo mueve.

## Por qué se redibuja solo lo que cambió

El sketch borra cada manecilla pintándola de color de fondo y la vuelve a pintar en su nueva
posición, en lugar de limpiar la pantalla entera cada vez.

Un búfer completo de pantalla ocuparía 240 × 240 × 2 bytes = **115 KB**, que no sobra en un ESP32
que además va a levantar WiFi en la sesión 10.

**Experimento que vale la pena:** cambiar el redibujo por un `fillScreen()` en cada vuelta y mirar
la pantalla. El parpadeo aparece de inmediato. Es la forma más rápida de que se vea que una decisión
de implementación tiene consecuencias visibles.

## Cómo medir la deriva (sesión 9)

1. Anotar la hora exacta de un reloj de referencia y la que muestra la pantalla, al mismo instante.
2. Dejar el dispositivo encendido y sin tocar durante un intervalo largo y anotado: una hora de
   clase sirve, varias horas es mejor.
3. Volver a comparar las dos horas.
4. La diferencia entre ambas comparaciones es la deriva acumulada en ese intervalo.

Se reporta en segundos por hora, con las **cifras significativas** que la medición aguante: si el
reloj de referencia se leyó al segundo, no tiene sentido reportar décimas.

## Qué debe verse

Carátula con las doce marcas, tres manecillas —blanca la de la hora, celeste la del minuto, roja la
del segundo—, un punto rojo en el centro y la hora digital en amarillo debajo, en formato `HH:MM:SS`.

El segundero debe avanzar a saltos de un segundo, sin parpadeo del resto de la pantalla.

## Evidencia de las sesiones

- **Sesión 8:** reloj funcionando, más la anotación de qué pasa al quitar el `+ minutos * 0.5` del
  horario
- **Sesión 9:** tabla de deriva con al menos dos mediciones separadas por un intervalo anotado, el
  cálculo de segundos por hora y la justificación de cuántas cifras significativas se reportan

## Si algo falla

| Síntoma | Revisar |
|---|---|
| El reloj arranca siempre a la misma hora | Es el comportamiento esperado: `HORA_INICIAL_MS` es fija |
| Toda la pantalla parpadea | Se está limpiando la pantalla completa en cada vuelta del `loop` |
| Las manecillas dejan un rastro | Falta borrar la posición anterior antes de dibujar la nueva |
| La carátula se va borrando de a pedazos | Falta volver a trazar la carátula después de borrar las manecillas |
| El horario salta de golpe cada hora | Falta el término `minutos * 0.5` |
| La hora digital se ve como números encimados | Falta borrar el rectángulo del texto antes de escribir |

Más casos en [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

## Procedencia

Código propio, licencia **MIT**. Ver [LICENCIAS.md](../LICENCIAS.md).
