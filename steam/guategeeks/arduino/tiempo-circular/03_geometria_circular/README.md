# 03 · Geometría circular

Convierte un ángulo en un par de coordenadas. Es el corazón matemático del programa.

**Sesiones 5, 6 y 7** · Reto niveles 1 y 2 ·
[Sesión 5](https://guategeeks.com/programas-educativos/tiempo-circular/la-pantalla-es-un-plano) ·
[Sesión 6](https://guategeeks.com/programas-educativos/tiempo-circular/angulos-notables) ·
[Sesión 7](https://guategeeks.com/programas-educativos/tiempo-circular/seno-y-coseno)

> **No verificado en hardware.** Este sketch no ha sido cargado en una placa física.

## Un sketch, tres sesiones

Se cambia la constante `SESION` en la parte de arriba del archivo:

| Valor | Sesión | Qué dibuja |
|:--:|:--:|---|
| `5` | 5 | Centro, borde y los dos ejes |
| `6` | 6 | Las doce marcas cada 30° |
| `7` | 7 | Una manecilla apuntando a un ángulo de prueba |

Modificar un parámetro y ver el efecto **es** el reto nivel 2. Que las tres vistas vivan en el mismo
archivo permite comparar sin recablear nada.

## Las dos fórmulas

Todo el programa se apoya en estas dos líneas:

```
x = CX + radio · sin(ángulo)
y = CY − radio · cos(ángulo)
         ↑
         el signo negativo es la parte que casi todos olvidan
```

### ¿Por qué el menos?

En la pantalla, **la Y crece hacia abajo**. En el plano cartesiano de la clase de matemática, crece
hacia arriba. Si se escribe un más, la carátula queda espejada: las 12 aparecen donde van las 6.

```
        pantalla                        cuaderno
     (0,0) ──────► x                  y ▲
       │                                │
       │   Y crece hacia abajo          │   Y crece hacia arriba
       ▼                                └──────► x
       y
```

### ¿Por qué el seno va con la X?

Porque acá el ángulo se mide **desde las 12**, es decir desde el eje vertical, y no desde el
horizontal como suele hacerse en clase. Medido desde la vertical, el cateto horizontal es el
**opuesto** al ángulo —y le toca el seno— y el vertical es el **adyacente**, que le toca el coseno.

Es la misma razón trigonométrica de siempre; lo que cambió es desde dónde se mide.

## Los ángulos notables

Doce marcas en una vuelta: 360 ÷ 12 = **30° exactos**. Las de las 12, 3, 6 y 9 caen sobre 0°, 90°,
180° y 270°, los ángulos notables que pide **MAT 1.2**, y por eso se dibujan más largas.

La simetría se comprueba mirando: cada marca tiene su opuesta sobre la misma recta, y girar la
figura 30° la deja idéntica a como estaba.

## La comprobación con Pitágoras

En la sesión 7 el sketch imprime en el Monitor Serie el ángulo, el radio, las coordenadas calculadas
y la distancia del centro al extremo obtenida con Pitágoras. **Esa distancia tiene que dar el radio
otra vez.** Si no lo da, el punto no cayó sobre la circunferencia y hay un error en el cálculo.

Es una verificación que los estudiantes pueden repetir en el cuaderno antes de mirar la pantalla.

## Qué debe verse

**Sesión 5:** círculo blanco, eje horizontal verde, eje vertical azul, y las etiquetas `0 grados`
arriba y `(120,120)` en el centro.

**Sesión 6:** doce marcas amarillas, cuatro de ellas más largas.

**Sesión 7:** las doce marcas más una línea roja gruesa desde el centro. Con `ANGULO_PRUEBA` en 90,
debe apuntar **a las 3 en punto**. Si apunta a las 9, sobra o falta un signo.

## Evidencia de las sesiones

- **Sesión 5:** carátula con centro y radio medidos sobre la pantalla física con regla, comparados
  con los valores del código
- **Sesión 6:** las doce marcas dibujadas, más la justificación escrita de por qué son 30° y qué
  simetría tiene la figura
- **Sesión 7:** manecilla apuntando a un ángulo pedido por el docente, más el cálculo hecho a mano
  de las coordenadas de su extremo y su verificación con Pitágoras

## Si algo falla

| Síntoma | Revisar |
|---|---|
| La carátula está de cabeza | El signo de la fórmula de Y: debe ser `CY - r*cos` |
| La manecilla apunta a las 9 en vez de a las 3 | Signo del seno, o ángulo medido en sentido antihorario |
| Todo se dibuja pegado a una esquina | `CX` y `CY` distintos de 120 |
| La manecilla apunta bien pero es demasiado corta o larga | El radio que se le pasa a `dibujarAguja` |
| Los ángulos dan valores absurdos | Se olvidó convertir a radianes: `sin()` y `cos()` no reciben grados |

Más casos en [TROUBLESHOOTING.md](../TROUBLESHOOTING.md).

## Procedencia

Código propio, licencia **MIT**. Ver [LICENCIAS.md](../LICENCIAS.md).
