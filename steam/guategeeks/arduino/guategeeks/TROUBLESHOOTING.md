# Solución de problemas

Ordenado por la frecuencia real con que aparece cada falla, no por subsistema.

## Antes que nada: diagnostique por capas

El error más caro es cambiar dos cosas a la vez. Cada sketch prueba un subsistema en aislamiento, y
esa es su función principal cuando algo falla:

```
¿Falla el robot autónomo?
  ├─ ¿Los botones responden?     → volver a 01_botones_y_buzzer
  ├─ ¿Los motores responden?     → volver a 02_prueba_motores
  ├─ ¿El sensor mide bien?       → volver a 03_prueba_ultrasonido
  └─ Si los tres funcionan solos, el problema está en la integración o la calibración
```

## Los motores no responden

**Revise primero la potencia del shield.** En la variante L293D no hay cable `STBY` externo: si
nada se mueve, casi siempre falta potencia de motor, el shield no está bien asentado o el sketch no
se compiló con la librería correcta.

| Revisar | Cómo |
|---|---|
| Alimentación del shield | Multímetro en el borne `EXT_PWR`, `M+` o equivalente: debe leer ~7.2 V |
| LED de potencia del shield | Debe encender si el shield lo incluye |
| Shield asentado | Revisar que todos los pines entren en los headers del Arduino |
| M1/M2 | Motor izquierdo en M1 y derecho en M2, bornes firmes |
| Librería | `AFMotor.h` instalado si se usa un Motor Shield v1-compatible |
| Tierra común | Continuidad entre GND de Arduino, shield y batería |
| Interruptor principal | En ON |
| Carga de batería | Sobre 6.5 V; por debajo el torque cae mucho |

## Solo responde un motor

Aísle el canal: intercambie los cables del motor entre M1 y M2. Si la falla se mueve con el cable,
el problema es el motor; si se queda en el mismo puerto, es el shield o su borne.

## El robot gira al revés de lo esperado

Los puertos M1 y M2 están intercambiados, o un motor quedó con polaridad invertida. Dos opciones:
intercambiar los dos cables de ese motor en el borne o cambiar la constante de inversión documentada
en el sketch. Conviene corregirlo antes de la sesión de calibración.

## El Arduino se reinicia al arrancar los motores

Caída de tensión por el pico de corriente del arranque.

- Verifique el capacitor de **470 µF** entre la entrada de motor y GND, cerca del shield, con la
  polaridad correcta
- Confirme que la entrada de motor del shield viene del interruptor y **no** del pin 5V del Arduino
- Revise la carga de la batería

## El sensor devuelve siempre 400

400 cm es el centinela de «no llegó eco». Casi siempre significa:

- **TRIG y ECHO invertidos.** TRIG va a A3, ECHO a A4
- Sensor sin alimentación: verifique VCC y GND
- Sensor apuntando al vacío, o con cables cruzando su cara

## Lecturas de distancia erráticas

| Causa | Señal |
|---|---|
| Zona muerta | Ocurre solo muy cerca, bajo unos 3 cm |
| Superficie blanda o en ángulo | El eco se dispersa; pruebe con una superficie plana y dura |
| Vibración del robot en marcha | Las lecturas empeoran al moverse, no quieto |

El firmware toma la mediana de tres lecturas justamente por esto.

## La distancia medida es la mitad de la real

Está dividiendo dos veces. La conversión correcta es `duracion_us / 58`, y ese 58 **ya incluye** el
viaje de ida y vuelta del sonido. Si además divide entre 2, obtiene la mitad.

## Una pulsación cuenta como varias

Es rebote mecánico del pulsador. La ventana de antirrebote está en 60 ms en el sketch `01` y en
180 ms en el `04`. Bajarla demasiado hace reaparecer el problema; subirla mucho hace que el botón se
sienta lento.

## El buzzer no suena, o suena siempre igual

Debe ser un buzzer **pasivo**. Uno activo trae su propio oscilador y solo responde a HIGH y LOW, así
que `tone()` no producirá tonos distinguibles y los modos serán imposibles de diferenciar de oído.

## El robot no avanza recto

Es lo esperado antes de calibrar: los dos motores nunca son idénticos. Use
`05_asistente_calibracion`.

Si después de calibrar sigue desviándose siempre al mismo lado por mucho que ajuste, el problema es
mecánico, no eléctrico: revise el roce de esa oruga, su tensión y la alineación del motor. Compensar
por software un roce creciente solo esconde la falla.

## El robot queda atrapado en las esquinas

La evasión elige dirección y duración de giro al azar precisamente para evitarlo. Si aun así se
atasca, amplíe el rango aleatorio del tiempo de giro, o aumente el retroceso previo.

## No compila

| Mensaje | Causa |
|---|---|
| `AFMotor.h: No such file or directory` | Instalar AFMotor / Adafruit Motor Shield V1 para los sketches `02`, `04` y `05` |
| `deducing from brace-enclosed initializer list` | Recorrer una lista entre llaves con `for`-range; use un arreglo indexado |
| `cannot jump from switch statement to this case label` | Declarar una variable con inicializador dentro de un `case` sin llaves |

## El IDE no encuentra la placa

- Pruebe otro cable USB: muchos cables baratos son solo de carga
- Pruebe otro puerto
- Herramientas → Placa → **Arduino Uno**, y seleccione el puerto correcto
- En Linux, puede faltar permiso sobre el puerto serie

## Verificar sin el robot completo

Los sketches `01` y `03` no usan motores, así que se pueden cargar y probar con solo el Arduino, el
sensor o los botones y el buzzer sobre una protoboard. Es útil para preparar la sesión antes de que
el robot esté armado.
