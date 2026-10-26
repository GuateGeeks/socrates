# Sketches Arduino · GuateGeeks SMARS

Cinco sketches por capas para el robot de orugas SMARS. Cada uno prueba un subsistema en aislamiento
antes de integrarlo, de modo que cuando el robot autónomo falla se puede retroceder para localizar el
problema.

Adoptados del proyecto SMARS bajo licencia **MIT**. Ver [LICENCIAS.md](./LICENCIAS.md).

## Los cinco sketches

| # | Sketch | Sesión | Qué prueba |
|---|---|:--:|---|
| 01 | [`01_botones_y_buzzer`](./01_botones_y_buzzer/) | 6 | Entradas con `INPUT_PULLUP`, antirrebote, tonos |
| 02 | [`02_prueba_motores`](./02_prueba_motores/) | 7 | Shield L293D, M1/M2, dirección y velocidad de ambas orugas |
| 03 | [`03_prueba_ultrasonido`](./03_prueba_ultrasonido/) | 8 | Distancia por tiempo de vuelo |
| 04 | [`04_smars_autonomo`](./04_smars_autonomo/) | 9-10 | Máquina de estados, tres modos, evasión de obstáculos |
| 05 | [`05_asistente_calibracion`](./05_asistente_calibracion/) | 11 | Compensación de la diferencia entre orugas |

Cada carpeta trae su propio README con pines, verificación y fallas frecuentes.

## Tabla de pines

Compartida por los cinco. No es negociable. El objetivo de esta implementación es un shield L293D
compatible con Arduino Motor Shield v1 y la librería `AFMotor`.

| Arduino / shield | Destino |
|---|---|
| Shield M1 | Motor izquierdo |
| Shield M2 | Motor derecho |
| A0 | Buzzer pasivo |
| A1 | Botón MODO a GND, con `INPUT_PULLUP` |
| A2 | Botón INICIO a GND, con `INPUT_PULLUP` |
| A3 | TRIG del HC-SR04 |
| A4 | ECHO del HC-SR04 |
| A5 | Sin conectar; fuente de ruido para `randomSeed()` |
| D3-D12 | Reservados por el shield L293D |
| 5V | VCC del sensor y periféricos de 5 V |
| GND | Tierra común |

> En esta variante no se cablean `STBY`, `PWMA`, `PWMB`, `AIN1`, `AIN2`, `BIN1` ni `BIN2`.
> El shield controla internamente esas señales; en el curso los motores se nombran como M1 y M2.

El diagrama de cableado completo está en la documentación de SMARS Aula Autónomo
(`docs/05_electronica.md` del paquete fuente) y en la
[página de materiales](https://guategeeks.com/programas-educativos/guategeeks/materiales) del
programa.

## Requisitos

**Hardware:** Arduino Uno, shield L293D compatible con Motor Shield v1, dos motorreductores N20 de
6 V, sensor HC-SR04, dos pulsadores, buzzer pasivo, portapilas 6×AAA con NiMH, capacitor de 470 µF
y dos de 100 nF.

**Software:** Arduino IDE 2. Instalar **AFMotor / Adafruit Motor Shield V1** para los sketches que
mueven motores (`02`, `04` y `05`).

## Cómo cargar un sketch

1. Abrir la **carpeta completa** en Arduino IDE. El Arduino IDE exige que el `.ino` se llame igual
   que su directorio, así que no renombre uno sin el otro.
2. Herramientas → Placa → **Arduino Uno**.
3. Herramientas → Puerto → el de su placa.
4. Cargar, y abrir el Monitor Serie a **9600 baudios**.

> Antes de cargar `02` o `04`, **levante el robot**. Ambos mueven las orugas apenas termina la carga.

## Estado de compilación

Los cinco compilan para `arduino:avr:uno`, verificado con `arduino-cli 1.2.0`, core
`arduino:avr 1.8.8` y **Adafruit Motor Shield library 1.0.1**. Tamaños en
[LICENCIAS.md](./LICENCIAS.md).

## Cuando algo falla

Empiece por [TROUBLESHOOTING.md](./TROUBLESHOOTING.md), que ordena las fallas por frecuencia real y
explica cómo diagnosticar por capas.

## Documentación del programa

- [Guía docente](https://guategeeks.com/programas-educativos/guategeeks/guia-docente)
- [Materiales y pines](https://guategeeks.com/programas-educativos/guategeeks/materiales)
- [Seguridad](https://guategeeks.com/programas-educativos/guategeeks/seguridad)
