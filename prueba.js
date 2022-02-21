//var add = require("./calculos.js").add;
//var ret = require("./calculos.js").retornar;
var parse = require("./parser.js").parse;
//[a-zA-Z_][a-zA-Z_0-9]* para la variable num 
var errores = [];
REPL();
function lextest(instruccion, readline) {
    var token = guardarTokens(instruccion);
    if (token.length < 1) {
        var parseo = parse(instruccion);
        var pos = parseo.errs[0].pos.overallPos;
        console.log("ERROR: Caracter invalido ('" + instruccion.charAt(pos) + "') en la entrada");
    }
    else {
        var listaTokens = showTokens(token);
        var imprimir = "OK: <" + instruccion + "> ==> " + " [ " + listaTokens + " ] ";
        var sinEspacios = instruccion.replace(" ", "");
        console.log(imprimir);
    }
    REPLaux(readline);
}
function REPL() {
    var readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    REPLaux(readline);
}
function procesarArchivo(instruccion, linea, nombre) {
    var re = /.lex/gi;
    if (instruccion.search(re) != -1) {
        var instruccionMod = instruccion.replace(re, "");
        var token = guardarTokens(instruccionMod);
        if (token.length < 1) {
            var parseo = parse(instruccionMod);
            var pos = parseo.errs[0].pos.overallPos;
            console.log("ERROR: Caracter invalido ('" + instruccionMod.charAt(pos) + "') en la entrada");
            errores.push([nombre, linea.toString(), "ERROR: Caracter invalido ('" + instruccionMod.charAt(pos) + "') en la entrada"]);
        }
        else {
            var listaTokens = showTokens(token);
            var imprimir = "OK: <" + instruccion + "> ==> " + " [ " + listaTokens + " ] ";
            var sinEspacios = instruccion.replace(" ", "");
            console.log(imprimir);
        }
    }
    else {
        console.log("ERROR: Interpretacion no implementada");
        errores.push([nombre, linea.toString(), "ERROR: Interpretacion no implementada"]);
    }
}
function leerArchivo(name, readline) {
    var fs = require('fs');
    try {
        var data = fs.readFileSync(name, 'UTF-8');
        var lines = data.split(/\r?\n/);
        var nLinea = 0;
        for (var i = 0; i < lines.length; i++) {
            procesarArchivo(lines[i], nLinea + 1, name); //Esta hecho para la primera fase del codigo solo lee los que tienen lex
            nLinea += 1;
        }
    }
    catch (err) {
        console.error(err);
    }
    REPLaux(readline);
}
function imprimirErrores(readline) {
    console.log(errores);
    REPLaux(readline);
}
function eliminarErrores(readline) {
    errores = [];
    REPLaux(readline);
}
function REPLaux(readline) {
    readline.question('<Stokhos> ', function (entrada) {
        var re = /.lex/gi;
        var re1 = /.load/gi;
        var re2 = /.failed/gi;
        var re3 = /.reset/gi;
        if (entrada == ".") {
            console.log("&");
            readline.input.destroy();
        }
        if (entrada.search(re) != -1) {
            var instruccion = entrada.replace(re, "");
            lextest(instruccion, readline);
        }
        if (entrada.search(re1) != -1) {
            var name = entrada.replace(re1, "");
            var fileName = name.replace(" ", "");
            leerArchivo(fileName, readline);
        }
        if (entrada.search(re2) != -1) {
            imprimirErrores(readline);
        }
        if (entrada.search(re3) != -1) {
            eliminarErrores(readline);
        }
        else {
            if (entrada != "." && entrada.search(re) == -1 && entrada.search(re1) == -1 && entrada.search(re2) == -1 && entrada.search(re3) == -1) {
                console.log("ERROR: Interpretacion no implementada");
                REPLaux(readline);
            }
        }
    });
}
function showTokens(array) {
    var arreglo = [];
    for (var i = 0; i < array.length - 1; i++) {
        if (i % 2 == 0) {
            if (array[i] == "TkNumber" || array[i] == "TkId") {
                arreglo.push(array[i] + "[" + array[i + 1] + "]");
            }
            else {
                arreglo.push(array[i]);
            }
        }
    }
    return arreglo;
}
function guardarTokens(entrada) {
    var parseo = parse(entrada);
    var arreglo = [];
    if (parseo.ast != undefined || parseo.ast != null) {
        recursivaGuardar(parseo.ast.start, arreglo);
    }
    return arreglo;
}
function recursivaGuardar(siguiente, arreglo) {
    while (siguiente != undefined) {
        arreglo.push(siguiente.kind);
        arreglo.push(siguiente.value);
        siguiente = siguiente.next[0];
    }
}
