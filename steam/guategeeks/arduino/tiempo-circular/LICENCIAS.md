# Licencias y atribución · Tiempo Circular

## El código de este programa

Los seis sketches de `arduino/tiempo-circular/` son **obra propia** de GuateGeeks y se distribuyen
bajo licencia **MIT**.

```
Copyright (c) 2026 GuateGeeks

Se concede permiso, libre de cargo, a cualquier persona que obtenga una copia de
este software y de los archivos de documentación asociados, para utilizarlos sin
restricción, incluyendo sin limitación los derechos de usar, copiar, modificar,
fusionar, publicar, distribuir, sublicenciar y/o vender copias del software, y a
permitir a las personas a las que se les proporcione el software a hacer lo
mismo, sujeto a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso deberán incluirse en todas
las copias o partes sustanciales del software.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO.
```

## Qué se tomó del tutorial de esp32io.com, y qué no

El programa partió de un tutorial público de **esp32io.com** sobre el módulo TFT redondo GC9A01 con
ESP32.

**Se tomó de esa fuente:**

- El mapa de pines del módulo: VCC, GND, CS, DC, SDA (MOSI), SCL, RST
- El cableado sugerido a los GPIO 18, 23, 25, 26 y 27 del ESP32
- La identificación de la librería `DIYables TFT Round` y su dependencia de Adafruit GFX
- La lista de capacidades que un programa sobre este módulo debería cubrir: texto y números, fuentes
  externas, figuras, imágenes y reloj

**No se tomó de esa fuente:**

- **Nada de código.** La copia guardada de esa página perdió el cuerpo de todos los ejemplos: cada
  llamada a método, literal de cadena y argumento numérico fue eliminado, de modo que
  `TFT_display.<método>` no aparece ni una vez en los 81 KB del archivo. Solo sobrevivieron
  comentarios, llaves y declaraciones vacías. No había código que derivar aunque se hubiera querido.
Los ejemplos de esa página se declaran de dominio público en su encabezado, pero eso no cambia lo
anterior: el código de aquí es propio porque no había otra opción.

**Se tomaron también las 14 imágenes**, que se reproducen en el programa **con crédito visible** a
esp32io.com / DIYables en cada aparición. Son material de terceros, no obra de GuateGeeks, y no hay
licencia expresa de reproducción: varias llevan la marca de agua `diyables.io`. La tabla de
procedencia completa está en la
[página de licencias del programa](https://guategeeks.com/programas-educativos/tiempo-circular/licencias).

Ninguna de esas imágenes muestra la salida de **estos** sketches: fueron hechas para el tutorial
original, antes de que este código existiera. Para las pantallas de geometría, ángulos y Cholq'ij no
hay fotografía, y el material lo dice en lugar de sugerir lo contrario.

## Librería de terceros

**DIYables TFT Round**, de DIYables.io — [repositorio](https://github.com/DIYables/DIYables_TFT_Round).
Se **cita e instala desde su origen**; no se copia ni se redistribuye en este repositorio. Su
dependencia, **Adafruit GFX Library**, se instala junto con ella y conserva su propia licencia.

## Marco curricular

Las competencias, indicadores, criterios y contenidos citados provienen de las **mallas curriculares
del Ciclo Básico** del Ministerio de Educación de Guatemala (Mineduc), Dirección General de
Currículo (DIGECUR).

La fuente navegable de CNB Guatemala publica el contenido bajo **CC BY-SA 4.0** salvo indicación
contraria. Los PDF oficiales indican que puede reproducirse total o parcialmente citando al Mineduc
y sin usos comerciales.

Cada cita de este programa incluye la página que la propia malla declara como fuente, para que
pueda verificarse.

## Contenido del calendario Cholq'ij

> **Pendiente de revisión cultural.** Este contenido no ha sido revisado por una persona con
> conocimiento del calendario maya. Hasta que eso ocurra, no debe considerarse material final.

**Fuente principal:** la malla curricular de **Matemática, Segundo Básico** del Mineduc, contenidos
**5.2.1** (ciclos en el calendario Cholq'ij y Hab'), **5.2.3** (los cuadrantes y los puntos
cardinales) y **5.3.1** (el 13 y el 20, ciclos de la vida), página 15. La estructura del ciclo que
el programa enseña —13 números, 20 posiciones, 260 días— es la que el propio currículo nacional
prescribe.

**Alcance declarado.** El programa trabaja la estructura del ciclo, su aritmética y su representación
sobre una circunferencia. **No** enseña práctica ceremonial, no interpreta las energías de un día, no
trabaja el contenido 5.3.2 («Matemática Maya: Espiritual y holística»), y **no habla en nombre de
comunidades mayas ni de ajq'ijab'**.

**Sobre los nombres de los nawales.** El material actual **no los nombra**. Si en una revisión
posterior se incorporan, deberá indicarse la variante lingüística usada y la fuente de la grafía,
porque los nombres y sus escrituras varían entre idiomas mayas y entre comunidades.

**Sobre la correlación con el calendario gregoriano.** El programa **no codifica una constante de
correlación propia**. El día de anclaje se configura a partir de una fuente publicada que el docente
elige y puede verificar. Afirmar una correlación que no se puede sostener sería el peor resultado
posible: parecer autoritativo sin serlo.

## Marcos internacionales

- **CSTA K-12 Computer Science Standards** — Computer Science Teachers Association
- **ISTE Standards for Students** — International Society for Technology in Education
- **NGSS** — Next Generation Science Standards

Se citan por código y sub-indicador, sin reproducir el texto completo de los marcos.
