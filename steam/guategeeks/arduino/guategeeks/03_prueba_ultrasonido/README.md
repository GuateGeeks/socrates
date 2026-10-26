# 03 · Prueba de ultrasonido

Mide distancia con el sensor HC-SR04 e imprime el resultado en el Monitor Serie.

**Sesión 8** · Reto nivel 2 · [Ver la sesión completa](https://guategeeks.com/programas-educativos/guategeeks/sensor-ultrasonico)

## Qué hace

Cada 150 ms emite un pulso ultrasónico, mide cuánto tarda el eco en volver y convierte ese tiempo a
centímetros. No usa motores.

## Pines

| Pin | Destino |
|---|---|
| A3 | TRIG del HC-SR04 |
| A4 | ECHO del HC-SR04 |

Alimentación del sensor: VCC a 5V, GND a GND.

## Cómo cargarlo y verificar

1. Conectar el sensor. **TRIG a A3 y ECHO a A4**, no al revés.
2. Cargar y abrir el Monitor Serie a 9600 baudios.
3. Poner un objeto plano a una distancia medida con cinta métrica y comparar.

## El número 58

El sonido viaja a unos 343 m/s, o sea 0.0343 cm por microsegundo. El pulso recorre el camino de ida
y vuelta, así que cubre el doble de la distancia buscada. Un centímetro de ida y vuelta toma
2 ÷ 0.0343 ≈ **58 µs**.

```
distancia_cm = duracion_us / 58
```

**Ese 58 ya incluye el viaje redondo.** Volver a dividir entre dos da la mitad de la distancia real,
y es el error clásico con este sensor.

## El centinela de 400

Cuando no llega eco dentro del tiempo límite, `pulseIn()` devuelve 0. La función traduce eso a
**400 cm**, no a 0, porque «no detecté nada» significa vía libre, no obstáculo pegado al sensor. Si
devolviera 0, el robot frenaría justo cuando tiene el camino despejado.

## Si algo falla

| Síntoma | Revisar |
|---|---|
| Siempre devuelve 400 | TRIG y ECHO invertidos, o sensor sin alimentación |
| Lecturas erráticas de cerca | Zona muerta del sensor, por debajo de unos 3 cm |
| Valores que saltan sin razón | Superficie blanda o en ángulo; el eco se dispersa |

Más casos en [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

## Procedencia

Adoptado de `smars_aula_autonomo_v2_fuentes_publicas/code/arduino/03_prueba_ultrasonido/` el
2026-07-30. Licencia **MIT**, conservada en el encabezado del archivo. Cambios: formato,
comentarios en español y pines adaptados al shield L293D. Ver [LICENCIAS.md](../LICENCIAS.md).
