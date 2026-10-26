# 05 · La hora que viene de la red

El mismo reloj, con la hora tomada de un servidor NTP por WiFi.

**Sesión 10** · Reto nivel 3 · [Ver la sesión completa](https://guategeeks.com/programas-educativos/tiempo-circular/la-hora-de-la-red)

> **No verificado en hardware.** Este sketch no ha sido cargado en una placa física.

## Subsistema que prueba

La **comunicación**. El dibujo y el manejo del tiempo ya funcionan desde la capa anterior; lo único
nuevo es de dónde sale la hora. Si el reloj deja de verse bien al agregar WiFi, el problema es de
memoria o de tiempos, no de geometría.

## Antes de cargarlo: las credenciales

El sketch **no compila** hasta que exista un archivo `credenciales.h` en esta misma carpeta.

1. Copiar [`credenciales.h.ejemplo`](credenciales.h.ejemplo)
2. Renombrar la copia a `credenciales.h`
3. Escribir ahí el nombre de la red y la clave

`credenciales.h` está en el `.gitignore` del repositorio y **no se versiona**. Si la clave viviera
dentro del sketch, cualquier equipo que comparta su código estaría publicando la clave del WiFi de
la escuela. Esa es la razón, y conviene decirla en voz alta en clase.

## Qué corrige respecto a la capa anterior

| Falla de `04_reloj_millis` | Cómo se corrige aquí |
|---|---|
| Se adelanta o se atrasa | La hora se vuelve a pedir al servidor, así que la deriva no se acumula |
| Arranca siempre a la misma hora | La hora llega de la red, no de una constante escrita a mano |
| No sabe en qué día vive | `struct tm` trae fecha completa, útil para la sesión 11 |

## El huso horario

Los servidores NTP entregan la hora en **UTC**: el mismo instante para todo el planeta. Guatemala
está en **UTC-6**, así que hay que restar seis horas.

```c
const long OFFSET_UTC_SEG    = -6 * 3600;  // seis horas, en segundos
const int  OFFSET_VERANO_SEG = 0;          // Guatemala no cambia de hora
```

Ese segundo cero es contenido, no relleno: en un país que sí aplica horario de verano, esa constante
no sería cero y el reloj cambiaría solo dos veces al año. Vale la pena preguntar en clase qué pasaría
si alguien copiara este código en un país que sí lo hace.

## Ruta alterna sin red

Si la escuela no tiene WiFi utilizable, **el programa se completa igual**. El sketch está escrito
para no colgarse: intenta conectar durante 20 segundos, avisa en pantalla y en el Monitor Serie, y
sigue.

La sesión 10 trae la actividad alterna: se ajusta la hora a mano sobre `04_reloj_millis` y se trabaja
el contenido de husos horarios con datos en papel. La evidencia cambia, el aprendizaje no. Ver
[la sesión](https://guategeeks.com/programas-educativos/tiempo-circular/la-hora-de-la-red).

## Qué debe verse

Primero el mensaje `Conectando WiFi...`, después `Pidiendo la hora...`, y luego el mismo reloj de la
capa anterior pero mostrando la hora real de Guatemala.

En el Monitor Serie a 115200 baudios: los puntos del intento de conexión, la dirección IP asignada y
la hora recibida.

Si algo falla, el mensaje en pantalla dice qué falló: `Sin WiFi` o `NTP no respondio`. Un reloj en
blanco no dice nada; un reloj que explica su falla es depurable.

## Evidencia de la sesión

- Reloj mostrando la hora correcta, comparado contra un reloj de referencia
- Anotación de la dirección IP obtenida y del servidor NTP usado
- Respuesta escrita a: ¿por qué el servidor entrega UTC en lugar de la hora local?
- **O**, en la ruta sin red: reloj ajustado a mano, más el cálculo escrito de qué hora es en otros
  tres husos horarios a partir de la hora local

## Si algo falla

| Síntoma | Revisar |
|---|---|
| `credenciales.h: No such file or directory` | Falta copiar y renombrar el archivo de ejemplo |
| Se queda en `Conectando WiFi...` y luego dice `Sin WiFi` | SSID o clave equivocados, o red de 5 GHz: el ESP32 solo usa 2.4 GHz |
| Conecta pero dice `NTP no respondio` | La red bloquea el puerto NTP; usar la ruta alterna |
| La hora sale seis horas adelantada | `OFFSET_UTC_SEG` quedó en 0: se está mostrando UTC |
| La hora sale doce horas corrida | Confusión entre `tm_hour` de 0-23 y el reloj de 12 |
| El reloj se ve entrecortado al conectar | El stack de WiFi compite por tiempo de CPU; es esperable durante la conexión |

Más casos en [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

## Procedencia

Código propio, licencia **MIT**. Ver [LICENCIAS.md](../LICENCIAS.md).
