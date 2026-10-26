# Lista de hardware · Tiempo Circular

> **Hardware especificado, no adquirido.** Esta configuración no ha sido comprada ni probada en
> campo. Los precios son **estimados** y sirven para planificar, no para presupuestar. Nadie ha
> validado disponibilidad con proveedores en Guatemala.

## Por equipo

Equipos de 3 o 4 estudiantes.

| Cant. | Componente | Especificación | Requerido | Estimado (Q) |
|:--:|---|---|:--:|--:|
| 1 | Placa de desarrollo ESP32 | Cualquier variante con los GPIO 18, 23, 25, 26 y 27 expuestos y salida de 3.3 V | Sí | 90-150 |
| 1 | Módulo TFT redondo 1.28" | Controlador **GC9A01**, 240×240, IPS, interfaz SPI, **sin** táctil | Sí | 90-140 |
| 1 | Cable USB de datos | Del tipo que use la placa: micro-USB o USB-C. **De datos, no solo de carga** | Sí | 20-40 |
| 1 | Protoboard | Media, de 400 puntos, suficiente | Sí | 25-40 |
| 7+ | Jumpers macho-hembra | Para las siete conexiones, más repuestos | Sí | 20-35 |
| — | **Total estimado por equipo** | | | **245-405** |

## Deliberadamente ausentes

| Componente | Por qué no está |
|---|---|
| Módulo RTC (DS3231 o similar) | La hora sale de `millis()` y luego de NTP. Un RTC costaría ~Q25 más por equipo y taparía la lección de la deriva |
| Módulo de tarjeta SD | El programa no carga imágenes desde archivo. Sumaría costo, cableado y modos de falla sin contenido curricular que lo justifique |
| Batería o portapilas | El dispositivo se alimenta por USB durante toda la secuencia |
| Sensores | Este programa construye una interfaz de salida, no un instrumento de medición |

## Por aula

| Cant. | Recurso | Nota |
|:--:|---|---|
| 1 por equipo | Computadora con Arduino IDE 2.x | Con permisos para instalar el driver USB-serie |
| 1 | Reloj de referencia confiable | Para la medición de deriva de la sesión 9. Un teléfono sincronizado sirve |
| 1 | Regla o calibrador | Para medir el diámetro real de la pantalla en la sesión 5 |
| — | Acceso a WiFi de 2.4 GHz | **Opcional.** Solo para la sesión 10; hay ruta alterna sin red |

## Advertencias de compra

**El controlador importa.** Existen módulos redondos de 1.28" con otros controladores. La librería de
este programa es para **GC9A01**. Un módulo con controlador distinto no funcionará con estos
sketches sin cambios.

**Sin táctil.** Las versiones táctiles cuestan más y agregan pines que el programa no usa.

**El ESP32 usa 2.4 GHz.** No se conecta a redes de 5 GHz. Conviene confirmarlo antes de planificar
la sesión 10.

**El cable USB debe ser de datos.** Muchos cables baratos solo llevan alimentación; la placa
enciende pero la computadora no la ve. Es una de las fallas más frecuentes y más frustrantes al
empezar.

## Escala reducida

Si no alcanza para un dispositivo por equipo, el programa funciona con **uno por aula** en modo
demostración: los cálculos de geometría, color y ciclo se hacen en papel por todos los equipos, y la
verificación en pantalla se hace por turnos. Se pierde la práctica de cableado de la sesión 3, que
tendría que hacerse como observación guiada.
