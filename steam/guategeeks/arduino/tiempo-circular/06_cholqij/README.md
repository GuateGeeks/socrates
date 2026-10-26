# 06 · Cholq'ij

Una carátula que cuenta el ciclo de 260 días del Cholq'ij en lugar de las 12 horas del reloj.

**Sesión 11** · Reto nivel 3 · [Ver la sesión completa](https://guategeeks.com/programas-educativos/tiempo-circular/cholqij)

> **No verificado en hardware.** Este sketch no ha sido cargado en una placa física.
>
> **Pendiente de revisión cultural.** El contenido de calendario de esta capa no ha sido revisado
> por una persona con conocimiento del calendario maya. Hasta que eso ocurra, no debe considerarse
> material final.

## Qué hace y qué no hace

**Hace:** dibuja la estructura del ciclo —20 posiciones y 13 números—, calcula en qué punto del
ciclo cae un día a partir de un ancla configurada, y hace explícita la aritmética de los dos
anillos.

**No hace:** no interpreta el significado de un día, no lee energías, no nombra los nawales y no
sustituye a quien sí tiene ese conocimiento. El programa trabaja **la estructura y la aritmética del
ciclo**, no su lectura ceremonial.

Esa frontera está declarada también en la
[alineación curricular](https://guategeeks.com/programas-educativos/tiempo-circular/alineacion-cnb),
porque el criterio de evaluación que la malla asigna a MAT 5.2 —«reconoce las energías de un día en
particular»— es justamente lo que este programa **no** cubre.

## La aritmética del ciclo

```
   Cholq'ij = 13 números × 20 posiciones = 260 días

   La combinación no se repite hasta el día 260 porque 13 y 20
   no tienen divisores comunes.

   Repartidos sobre la circunferencia:

     20 posiciones →  360 / 20 = 18°           EXACTO
     13 números    →  360 / 13 = 27.6923…°     NO EXACTO   ← la lección
```

### El anillo de 20 hace visible la base 20

**MAT 5.1** pide operar cantidades «aplicando las características de base 20». En este anillo, la
posición en la pantalla **es** el valor posicional: contar de la posición 19 a la 0 da la vuelta
completa y vuelve a empezar, exactamente como al pasar de 19 a 20 en una cuenta de base 20.

Las posiciones 0, 5, 10 y 15 caen sobre 0°, 90°, 180° y 270°, que son los **cuadrantes** del
contenido 5.2.3 de la malla. Por eso se dibujan más grandes.

### El divisor que no es exacto

360 ÷ 13 = 27.6923… No cabe un número entero de veces en la vuelta. Si alguien lo redondeara a 27.7
y diera las trece vueltas, llegaría a **360.1°** en vez de 360°.

El sketch imprime ese cálculo en el Monitor Serie. A un radio de 78 píxeles, una décima de grado
vale menos de un píxel: **el error existe pero no se ve**. La pregunta de la sesión es qué pasaría si
el radio fuera mucho mayor, o si en vez de trece vueltas fueran cientos.

Es redondeo, error acumulado y cifras significativas sin necesidad de inventar un pretexto.

## El ancla: el dato que la máquina no puede deducir

Para saber en qué día del ciclo estamos hoy hace falta saber qué día del Cholq'ij corresponde a una
fecha conocida. **Este programa no trae una constante de correlación propia**, porque no está en
posición de afirmar una que no puede verificar.

El docente toma el dato de una fuente publicada y lo escribe en tres constantes:

```c
const int  POSICION_ANCLA    = 0;   // 0 a 19
const int  NUMERO_ANCLA      = 1;   // 1 a 13
const long DIAS_DESDE_ANCLA  = 0;   // días transcurridos hasta hoy
```

Que el modelo necesite un dato de afuera no es una falla del sketch: es parte de lo que se aprende.
Un modelo se ancla en una observación, no se deduce de la nada. Vale la pena decirlo así en clase.

## Qué debe verse

Dos anillos concéntricos de puntos sobre fondo negro: el exterior con **20** puntos amarillos —cuatro
de ellos más grandes, en los cuadrantes— y el interior con **13** puntos celestes. Un punto de cada
anillo está en rojo y más grande: es el día de hoy.

En el centro, el número y la posición del día, la palabra `Cholq'ij` y el día del ciclo sobre 260.

En el Monitor Serie: la estructura del ciclo con los dos pasos angulares a cuatro decimales, y el
cálculo del error de redondeo.

## Evidencia de la sesión

- Los dos pasos angulares calculados a mano antes de leerlos en pantalla: 360÷20 y 360÷13
- Explicación escrita de por qué el ciclo dura 260 días y no 33
- Cálculo del error acumulado al redondear el paso de los números, y una estimación de a qué radio
  ese error alcanzaría un píxel
- Carátula funcionando con el ancla configurada por el docente

## Salida alterna

Un equipo que no construya esta carátula **completa el programa igual**. La
[guía docente](https://guategeeks.com/programas-educativos/tiempo-circular/guia-docente) indica qué
evidencia la sustituye.

## Si algo falla

| Síntoma | Revisar |
|---|---|
| Los 20 puntos no cierran el círculo | `PASO_POSICION` debe ser 360.0/20, con punto decimal |
| Los 13 puntos se amontonan de un lado | Se está usando división entera: 360/13 da 27, no 27.69 |
| El día de hoy no coincide con el ancla | Las tres constantes del ancla, y que `DIAS_DESDE_ANCLA` cuente desde el día correcto |
| El número del día sale 0 | Los números van de 1 a 13; el índice se corre con `-1` y `+1` |
| Los cuadrantes no quedan arriba, derecha, abajo e izquierda | La rotación de la pantalla, o el signo de la fórmula de Y |

Más casos en [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

## Procedencia y fuentes

Código propio, licencia **MIT**.

La estructura del ciclo —13 números, 20 posiciones, 260 días, cuadrantes y puntos cardinales— se
apoya en los contenidos **5.2.1**, **5.2.3** y **5.3.1** de la malla curricular de Matemática de
Segundo Básico del Mineduc (p. 15). Ver [LICENCIAS.md](../LICENCIAS.md) para la lista completa de
fuentes y la atribución.
