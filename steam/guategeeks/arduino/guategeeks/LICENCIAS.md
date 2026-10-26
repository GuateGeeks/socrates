# Licencias y atribución

Este directorio combina material con licencias distintas. Confundirlas bloquea usos permitidos o
incumple los restringidos.

## Resumen

| Componente | Licencia | Qué permite |
|---|---|---|
| Los cinco sketches `.ino` | **MIT** | Copiar, modificar y usar en cursos, **incluidos comerciales**, conservando el aviso |
| Documentación de SMARS | CC BY-SA 4.0 | Derivados con la misma licencia y atribución |
| Modelos 3D de SMARS | **CC BY-NC-SA** | **Solo uso no comercial**, con atribución |
| README y guías de este directorio | CC BY-SA 4.0 | Derivados con la misma licencia |
| Librería AFMotor / Motor Shield V1 | Licencia de su proveedor | Instalar desde Arduino IDE o la fuente oficial, conservando sus avisos |

La distinción que más importa: **el código es MIT** y puede usarse en cursos pagados; **los modelos
3D no**.

## SMARS

SMARS es un proyecto educativo modular creado por **Kevin Thomas** y desarrollado por una comunidad
de makers. **GuateGeeks no está afiliado oficialmente al proyecto.**

Atribución requerida al redistribuir los modelos:

> SMARS modular robot, diseño de Kevin Thomas. Fuente:
> https://www.thingiverse.com/thing:2662828. Distribuido bajo CC BY-NC-SA según la página fuente
> consultada.

Una institución que cobre específicamente por copias impresas del chasis debe solicitar permiso o
confirmar los términos con el autor.

## Los sketches

Los cinco se **adoptaron** del paquete SMARS Aula Autónomo el **2026-07-30**, conservando su
encabezado de licencia MIT. En esta variante se adaptaron al shield L293D confirmado para
GuateGeeks: motores en M1/M2, botones en A1/A2, sensor en A3/A4 y buzzer en A0.

| Sketch | Cambios respecto al original |
|---|---|
| `01_botones_y_buzzer` | Pines actualizados a A1/A2/A0 para liberar los digitales del shield |
| `02_prueba_motores` | Motor API migrada de pines TB6612FNG a shield L293D M1/M2 con `AFMotor` |
| `03_prueba_ultrasonido` | Pines actualizados a A3/A4 |
| `04_smars_autonomo` | Motor API migrada a shield L293D, pines actualizados y A5 como entropía |
| `05_asistente_calibracion` | Motor API migrada a shield L293D y conserva la corrección para poder compilar |

**Verificación de equivalencia esperada:** el comportamiento pedagógico se conserva por contrato
(botones, buzzer, distancia, evasión, calibración), pero ya no es una equivalencia pin-a-pin contra
el upstream porque el hardware canónico cambió de driver.

### La corrección de `05_asistente_calibracion`

En su forma original no compilaba para `arduino:avr:uno`:

```
error: deducing from brace-enclosed initializer list
       requires #include <initializer_list>
```

Recorrer una lista entre llaves con `for`-range necesita ese encabezado, que el core AVR no expone.
Se sustituyó por el bucle indexado sobre un arreglo que los sketches `02` y `04` ya usaban para lo
mismo, llamando a `pinMode(..., OUTPUT)` sobre los mismos siete pines en el mismo orden.

## Estado de compilación

Los cinco compilan para `arduino:avr:uno`, verificado con `arduino-cli 1.2.0`, core
`arduino:avr 1.8.8` y **Adafruit Motor Shield library 1.0.1**. Los sketches `02`, `04` y `05`
requieren esa librería.

| Sketch | Flash | RAM |
|---|---:|---:|
| `01_botones_y_buzzer` | 3 464 B (10 %) | 209 B (10 %) |
| `02_prueba_motores` | 2 858 B (8 %) | 194 B (9 %) |
| `03_prueba_ultrasonido` | 2 490 B (7 %) | 188 B (9 %) |
| `04_smars_autonomo` | 6 144 B (19 %) | 221 B (10 %) |
| `05_asistente_calibracion` | 5 006 B (15 %) | 222 B (10 %) |

## Fuentes

- Modelo original — https://www.thingiverse.com/thing:2662828
- Biblioteca de partes — https://www.smarsfan.com/learn/parts/index
- Instrucciones de construcción — https://www.smarsfan.com/build/buildinstructions/wheeled/
- Repositorio comunitario — https://github.com/kevinmcaleer/smars
- Arduino Uno Rev3 — https://docs.arduino.cc/hardware/uno-rev3/
- L293D — https://www.ti.com/product/L293D
- Adafruit Motor Shield v1 / AFMotor — https://learn.adafruit.com/adafruit-motor-shield

## Si va a redistribuir

1. Conserve el encabezado MIT en cada sketch, incluso reformateado.
2. Atribuya SMARS a Kevin Thomas y a la comunidad, aclarando la falta de afiliación.
3. **No incluya los modelos 3D en un paquete comercial.** Enlácelos.
4. Mantenga CC BY-SA 4.0 en los derivados de la documentación.
