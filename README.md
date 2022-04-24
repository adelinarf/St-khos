# Stókhos
Lenguaje interactivo orientado a simulaciones estocásticas. 

Adelina Figueira y Ana Santos.

Stókhos es un lenguaje interactivo implementado con la finalidad de realizar simulaciones estocásticas. Cuenta con dos tipos: num y bool y es posible generar arreglos de estos tipos al igual que variables y aunque no es posible para el usuario definir funciones dentro de Stókhos, hay 19 funciones predefinidas con las que se puede trabajar.

# Sintaxis de Stókhos

## Definición de una variable

    tipo nombre := valor;

Donde tipo puede ser num o bool, el nombre debe comenzar siempre con una letra o _ y el valor debe coincidir con el tipo que se define.
Ejemplos:

    num x := 3;
    bool y := false;

## Definición de arreglos
De manera similar a los anterior los arreglos se definen como:

    [tipo] nombre := [];

Ejemplos:
    
    [num] a:=[];
    [num] b:=[1,2,3];
    [bool] x:=[false,true];

## Operadores
Los operadores que se utilizan en Stókhos son:

    Suma           : +
    Resta          : -
    Multiplicación : *
    Menor que      : <
    Mayor que      : >
    Menor igual que: <=
    Mayor igual que: >=
    Desigualdad    : <>
    División       : /
    Módulo         : %
    Negación       : !
    Conjunción     : &&
    Disyunción     : ||
    Potencia       : ^
    Igualdad       : =

# Librerías y paquetes utilizados
En este proyecto se hace uso del generador de parser tsPEG (https://github.com/EoinDavey/tsPEG), el paquete @types/node de npm, npm y el código está escrito en el lenguaje de programación Typescript.

# ¿Cómo realizar la corrida?
Se requiere de Node.js para la corrida de este proyecto, por lo que se debe instalar Node.js por medio del sitio web:  https://nodejs.org/en/. Junto a Node.js se instala npm que nos ayudará a instalar los demás paquetes necesarios para el proyecto.
Se debe realizar la instalación de tsPEG con el comando:  

    npm install -g tspeg

Instalar el paquete @types/node con el comando:  

    npm install @types/node --save-dev

Si no posees Typescript en tu dispositivo, puedes instalarlo con el siguiente comando:

    npm install -g typescript

## Corrida para Windows
En el repositorio se encuentran 3 archivos para la corrida en Windows: compilerW, runW y cleanW.
Se debe correr compilerW.bat para compilar los archivos de Typescript y producir los .ts relacionados a la gramática del lenguaje. Luego de compilar los archivos, se debe abrir el archivo runW.bat para comenzar el REPL de Stókhos, de esta manera se inicia el REPL y se puede comenzar a trabajar con el lenguaje. Para eliminar los archivos generados por compilerW.bat, se corre cleanW.bat.
#### Para correr los archivos .bat en Windows solo debe darse doble click sobre ellos.

## Corrida para otros sistemas operativos
En el repositorio se encuentran 3 archivos para la corrida en Linux y macOs. Se debe correr el archivo build, para generar los archivos en Javascript y los .ts relacionados a la gramática del lenguaje. Luego se debe correr el archivo run para comenzar a utilizar el REPL de Stókhos. Finalmente, se borran los archivos creados por medio de build al correr el archivo clean.
#### Los archivos build, run y clean solo deben llamarse desde la consola.

# El REPL
## Primera etapa
Se pueden observar los arreglos de tokens si se utiliza la funcion .lex seguido de una expresión correcta en el lenguaje Stókhos, si es correcta la expresión se muestra un arreglo con los tokens relacionados, si no lo es, se muestra un error adecuado.
Se puede utilizar la funcion .load para cargar un archivo que se leerá línea por línea, por el momento solo se lee correctamente las líneas que cuentan con la función .lex al igual que se realiza la lectura en el REPL. También se pueden utilizar las funciones .failed que demuestran los errores al leer un archivo y .reset que elimina dichos errores.
Hay un archivo de ejemplo para lectura utilizando la función .load llamado ej.txt.
Las entradas en el REPL pueden ser de la siguiente manera

    <Stokhos> .lex (expresión)
    <Stokhos> .load nombrearchivo.txt
    <Stokhos> .failed
    <Stokhos> .reset

Para salir del REPL se coloca únicamente un punto.

    <Stokhos> .
    
# El Parser
## Segunda etapa
En esta etapa se ha construido una gramática para el lenguaje Stókhos, que permite el uso de dos tipos (booleanos y números), también ofrece la posibilidad de generar arreglos de dichos tipos, reconocer operaciones binarias y unarias y se genera el AST o árbol de sintaxis abstracta para cada una de las expresiones e instrucciones que introduzca el usuario en el REPL. También se ha generado una función .ast que permite al usuario probar el parser de Stókhos, en caso de introducir una expresión o instrucción de sintaxis inválida aparecerá un mensaje de error. Se puede llamar a la función .ast de la siguiente manera:

    <Stokhos> .ast (expresión)
    
Obteniendo un resultado de la siguiente forma:

    OK : ast('expresión') ==> (expresión)

Siendo (expresión), la expresión introducida por el usuario, pero que incluye los paréntesis relevantes. Finalmente, se ha modificado la función de leerArchivo de la etapa 1, para que sea capaz de leer archivos que llamen a otros archivos dentro de sí mismos. Pueden ser utilizadas las funciones .ast y .lex dentro de los archivos que se desean cargar por medio de .load pero al realizar operaciones o definiciones de variables sin llamar a las funciones .ast y .lex se observa un error en la consola, ya que, aún no se ha implementado dicha funcionalidad en la etapa 2.

# Verificación de tipos, evaluación de expresiones y funciones predefinidas
## Tercera etapa
En esta etapa se agrega la verificación de tipos de cada una de las expresiones que pueden ser utilizadas dentro del lenguaje. En caso de las expresiones que incluyen constantes como números o booleanos, se realiza su evaluación y se crean las funciones predefinidas del lenguaje Stókhos.
Las expresiones que incluyen constantes pueden evaluarse de la siguiente manera, por ejemplo:
    
    <Stokhos> 2+3
    OK : (2+3) ==> 5

Las funciones predefinidas creadas en esta etapa son: if, type, ltype, uniform, floor, length, sum, avg, pi y now.

# Manejo de variables y mejoras en la máquina virtual de Stókhos
## Cuarta Etapa
Durante esta etapa se manejan las variables y la tabla de símbolos del lenguaje Stókhos. Se aplican los conceptos de rvalue y cvalue a cada una de las variables del lenguaje. Además se agregan otras funciones predefinidas: ln, exp, sin, cos, formula, tick, array, sqrt e histogram.
Se incluye en la carga de archivos el procesamiento de expresiones de Stókhos sin necesidad de utilizar funciones "mágicas" del lenguaje como .lex o .ast. También se consideran los ciclos de cómputo de la VM para actualizar los rvalue de las variables, cuando el ciclo de cómputo en el que se actualizó la variable y el ciclo en el que se desea ver su rvalue no es el mismo y se trata de expresiones con comillas simples.

# Funciones predefinidas de Stókhos

    if(condición, exp1, exp2) : Si la condición es cierta retorna exp1, si no retorna exp2.
    type(exp)                 : Retorna el tipo de la expresión exp.
    ltype(exp)                : Retorna el tipo de la expresión exp y exp tiene cvalue.
    uniform()                 : Retorna un número aleatorio entre 0 y 1.
    floor(exp)                : Retorna la función piso del número exp.
    length(exp)               : Retorna el tamaño del arreglo exp.
    sum(exp)                  : Retorna la suma de los elementos del arreglo exp.
    avg(exp)                  : Retorna el valor promedio del arreglo exp.
    pi()                      : Retorna el valor de la constante pi.
    now()                     : Retorna el número de milisegundos transcurridos desde .
    ln(exp)                   : Retorna el logaritmo natural de exp.
    exp(exp1)                 : Retorna el valor de la constante de Euler elevada a exp1.
    sin(exp)                  : Retorna el valor del seno de exp.
    cos(exp)                  : Retorna el valor del coseno de exp.
    formula(exp)              : Retorna el cvalue de la variable exp.
    tick()                    : Aumenta el ciclo de cómputo de la VM.
    sqrt(exp)                 : Retorna la raíz cuadrada de exp.
    array(size,init)          : Retorna un arreglo de tamaño size, cuyos elementos se inicializan de acuerdo a init.
    histogram(exp, nsamples, nbuckets, lowerbound,upperbound) : Retorna un arreglo que resulta de la frecuencia de los valores de exp evaluados nsamples veces y que se dividen sobre el arreglo de tamaño nbuckets+2 entre lowerbound y upperbound. Cada valor evaluado de exp se le asigna una posición del arreglo de acuerdo al lowerbound, upperbound y los rangos de valores que se consideran en cada posición del arreglo de salida. También muestra en el REPL un pequeño histograma que representa la salida.