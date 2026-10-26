# 04 · SMARS autónomo

Firmware final. Integra botones, buzzer, las dos orugas y el sensor en una máquina de estados que
evita obstáculos sin intervención.

**Sesiones 9 y 10** · Reto nivel 3 · [Leer el código](https://guategeeks.com/programas-educativos/guategeeks/lectura-de-codigo) · [Integrarlo](https://guategeeks.com/programas-educativos/guategeeks/integracion-autonoma)

## Qué hace

Tres modos, seleccionables con el botón MODO y arrancados con INICIO:

| Modo | Comportamiento |
|---|---|
| `DETENIDO` | Motores apagados |
| `EXPLORAR` | Avanza mientras haya espacio; ejecuta la evasión al detectar un obstáculo |
| `DEMOSTRACION` | Secuencia corta de exhibición, y se detiene sola al terminar |

Cada modo se anuncia con tantos pitidos como su número, cada uno más agudo que el anterior.

## Pines

Usa la tabla de pines del shield L293D: motor izquierdo en M1, motor derecho en M2, buzzer en A0,
botones MODO/INICIO en A1/A2, sensor HC-SR04 con TRIG en A3 y ECHO en A4, y A5 sin conectar para
semilla de aleatoriedad.

Requiere la librería **AFMotor / Adafruit Motor Shield V1**.

## Parámetros calibrables

Son los tres valores que conviene ajustar según el robot y la batería:

| Constante | Valor | Qué controla |
|---|---:|---|
| `VELOCIDAD` | 165 | Avance normal; límite seguro para 6×AAA NiMH |
| `VELOCIDAD_GIRO` | 155 | Giro; algo menor porque exige más torque |
| `UMBRAL_CM` | 24 | A qué distancia se considera obstáculo |

## La maniobra de evasión

Al detectar un obstáculo: frena, avisa con el buzzer, retrocede 320 ms, **elige dirección al azar**,
gira durante un tiempo **aleatorio entre 380 y 680 ms**, y vuelve a medir.

La aleatoriedad es deliberada. Si girara siempre al mismo lado el mismo tiempo, en una esquina
repetiría la misma maniobra indefinidamente y quedaría atrapado — que es justo lo que el reto final
prohíbe.

## La mediana de tres lecturas

Antes de decidir, toma tres mediciones y conserva la del medio. Una lectura aislada puede fallar por
un eco raro; la mediana descarta ese valor extremo sin promediar, que arrastraría el error.

## Cómo cargarlo y verificar

1. **Con el robot levantado**, cargar y recorrer los tres modos con el botón MODO.
2. Verificar que INICIO arranca y pausa.
3. Solo entonces bajar el robot a un espacio despejado y poner modo `EXPLORAR`.

## Si algo falla

| Síntoma | Revisar |
|---|---|
| No se mueve en ningún modo | Potencia del shield, M1/M2, `AFMotor`, y que INICIO esté activado |
| Detecta obstáculos que no existen | Cables cruzando la cara del sensor |
| Choca antes de frenar | `UMBRAL_CM` muy bajo para su velocidad |
| Queda atrapado en esquinas | Aumentar el rango aleatorio del giro |
| No avanza recto | Falta calibrar: ver el sketch `05` |

Más casos en [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

## Procedencia

Adoptado de `smars_aula_autonomo_v2_fuentes_publicas/code/arduino/04_smars_autonomo/` el
2026-07-30. Licencia **MIT**, conservada en el encabezado del archivo. Cambios: formato,
comentarios en español, pines adaptados y motor API migrada al shield L293D con `AFMotor`.
Ver [LICENCIAS.md](../LICENCIAS.md).
