# Lista de materiales — GuateGeeks SMARS Aula Autónomo

Contrato de hardware canónico. Los sketches y toda la documentación asumen exactamente esta
configuración; cambiarla exige recalibrar el firmware.

**Shield objetivo confirmado para esta implementación:** Arduino Motor Shield v1-compatible con
puentes H L293D y librería `AFMotor`. Si el aula usa un shield L293D distinto, no lo trate como
sustitución directa sin ajustar código y cableado.

> **Fuente:** adaptado de `smars_aula_autonomo_v2_fuentes_publicas/docs/02_materiales.md`.
> Ver [LICENCIAS.md](./LICENCIAS.md) para atribución y términos.

## Kit electrónico por equipo

| Componente | Cant. | Especificación | Sustitución aceptable |
|---|---:|---|---|
| Arduino Uno R3 | 1 | ATmega328P, USB | Arduino Nano, adaptando el montaje |
| Shield **L293D compatible con Motor Shield v1** | 1 | Bornes M1-M4, entrada de potencia para motores, compatible con `AFMotor` | Otro shield L293D solo si se adapta código y cableado |
| Motorreductor N20 | **2** | 6 V, 100-200 RPM, eje D de 3 mm | N20 de 9 V si se recalibra la velocidad |
| Sensor HC-SR04 | 1 | Ultrasónico, 4 pines | US-100 en modo trigger/echo |
| Pulsador momentáneo | **2** | Normalmente abierto | Interruptor táctil grande |
| Buzzer piezoeléctrico | 1 | **Pasivo**, 5 V | Buzzer activo, usando HIGH/LOW en vez de `tone()` |
| Portapilas 6×AAA | 1 | Con interruptor y fijación por velcro | Pack NiMH 7.2 V protegido |
| Batería AAA NiMH | 6 | 1.2 V, misma capacidad y lote | Pack NiMH 7.2 V |
| Interruptor principal | 1 | SPST, 1 A o más | El del portapilas |
| Capacitor electrolítico | 1 | 470 µF, 16 V | 220 a 1000 µF |
| Capacitor cerámico | 2 | 100 nF en terminales de motor | 47 a 220 nF |
| Cables Dupont | 20 | Macho-macho y macho-hembra | Cable flexible 22-26 AWG |
| Cable para motores | 40 cm | Flexible, dos colores | Dupont cortado y soldado |
| Termoencogible | 10 cm | 2 a 3 mm | Cinta aislante de buena calidad |

**El buzzer debe ser pasivo.** `tone()` genera la frecuencia; un buzzer activo tiene oscilador propio
y solo responde a HIGH/LOW.

## Consumibles de impresión

| Componente | Cant. | Especificación |
|---|---:|---|
| Filamento PLA/PLA+ | 250-400 g | 1.75 mm; PETG con ajuste de temperatura |
| Segmentos de filamento | 40 | Cortados al ancho del eslabón de oruga |
| Cinchos pequeños | 6 | 2.5 mm de ancho |

## Tabla de pines canónica

Esta asignación no es negociable: los cinco sketches la comparten.

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
| D3-D12 | Reservados por el shield L293D en la ruta canónica |
| 5V | VCC del sensor y periféricos de 5 V |
| GND | Tierra común |

No se cablean `STBY`, `PWMA`, `PWMB`, `AIN1`, `AIN2`, `BIN1` ni `BIN2`: el shield maneja esas
señales internamente. En el curso los motores se nombran por puerto: M1 izquierdo y M2 derecho.

## Alimentación

1. Positivo de batería al interruptor principal.
2. Salida del interruptor al borne de potencia de motores del shield (`EXT_PWR`, `M+` o equivalente).
3. En pruebas de banco, alimentar el Arduino por USB y mantener el robot levantado.
4. Para operación autónoma, alimentar el Arduino por `VIN` o jack DC solo después de verificar la
   configuración del jumper de potencia del shield.
5. Negativo de batería a GND común.
6. Capacitor de 470 µF entre la entrada de motor y GND, cerca del shield, **respetando polaridad**.
7. Verificar polaridad, LED de potencia del shield si existe y bornes M1/M2 firmes antes de cargar
   el sketch de motores.

**Nunca alimentar los motores desde el pin 5V del Arduino.**

**No usar batería rectangular de 9 V como estándar.** Puede aparecer en fotos de referencia, pero no
entrega corriente suficiente para pruebas confiables de motores en aula.

## Herramientas

| Herramienta | Uso | Esencial |
|---|---|---|
| Multímetro | Verificar voltajes, continuidad, tierra común | Sí |
| Cautín 25-60 W + estaño | Cables de motor, terminales | Sí |
| Pinza de corte y de punta | Preparación de cables y orugas | Sí |
| Destornilladores pequeños | Fijación de motores y chasis | Sí |
| Regla o calibrador | Medición de tolerancias (sesiones 3-4) | Sí |
| Impresora FDM | Cama mínima 100 × 100 mm | Sí, o servicio externo |
| Computadora con USB | Cargar firmware | Sí |

## Software

- **Arduino IDE 2** — https://www.arduino.cc/en/software
- Slicer: PrusaSlicer, Cura, OrcaSlicer o Bambu Studio
- Navegador moderno para consultar el material

Instalar la librería **AFMotor / Adafruit Motor Shield V1** antes de compilar los sketches que
mueven motores (`02`, `04` y `05`). Los sketches `01` y `03` no la necesitan.

## Modelos 3D — atención a la licencia

Los modelos del chasis y las orugas **no son obra de GuateGeeks**. Se distribuyen bajo
**CC BY-NC-SA** según la página fuente consultada.

- Modelo original: https://www.thingiverse.com/thing:2662828
- Biblioteca de partes: https://www.smarsfan.com/learn/parts/index
- Instrucciones de construcción: https://www.smarsfan.com/build/buildinstructions/wheeled/
- Repositorio comunitario: https://github.com/kevinmcaleer/smars

Atribución requerida:

> SMARS modular robot, diseño de Kevin Thomas. Fuente:
> https://www.thingiverse.com/thing:2662828. Distribuido bajo CC BY-NC-SA según la página fuente
> consultada.

**Restricción no comercial:** una institución que cobre específicamente por copias impresas debe
solicitar permiso o confirmar los términos con el autor. La electrónica se monta sobre el chasis
público con velcro o placa perforada, sin requerir modelos propios.

## Presupuesto

Los precios varían por país y proveedor, así que aquí se separan las categorías en lugar de fijar
cifras que envejecen mal. Para presupuestar:

1. Kit electrónico reutilizable (dura varios ciclos)
2. Consumibles de impresión y soldadura
3. Baterías y cargadores
4. Repuestos — sobre todo motores, sensores y cables

Comprar al menos **10 % de repuestos** en lotes de diez equipos. Los motorreductores N20 y los
cables de motor son las fallas más frecuentes.

## Hojas de datos

- Arduino Uno Rev3 — https://docs.arduino.cc/hardware/uno-rev3/
- L293D — https://www.ti.com/product/L293D
- Adafruit Motor Shield v1 / AFMotor — https://learn.adafruit.com/adafruit-motor-shield
