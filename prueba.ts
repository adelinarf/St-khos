//var add = require("./calculos.js").add;
//var ret = require("./calculos.js").retornar;
var parse = require("./parser.js").parse;
//[a-zA-Z_][a-zA-Z_0-9]* para la variable num 
var errores : Array<Array<string>> = [];

REPL();

function lextest(instruccion : String,readline){
	var token = guardarTokens(instruccion);
	if (token.length < 1){
  	console.log("ERROR: Caracter invalido en la entrada "+instruccion);
  }
  else{
		var listaTokens = showTokens(token);
	  var imprimir = "OK: <" + instruccion + "> ==> " + " [ " + listaTokens + " ] "
	  var sinEspacios = instruccion.replace(" ","");
	  console.log(imprimir);
  }
	REPLaux(readline);
}

function REPL(){
	const readline = require('readline').createInterface({
	  input: process.stdin,
	  output: process.stdout
	});
	REPLaux(readline)
}

function procesarArchivo(instruccion : String,linea,nombre){
	var token = guardarTokens(instruccion);
	var listaTokens = showTokens(token);
  var imprimir = "OK: <" + instruccion + "> ==> " + " [ " + listaTokens + " ] "
  console.log(imprimir);
}

function leerArchivo(name,readline){
	const fs = require('fs');

	try {
	    // read contents of the file
	    const data = fs.readFileSync(name, 'UTF-8');

	    // split the contents by new line
	    const lines = data.split(/\r?\n/);
	    console.log(lines);
	    // print all lines
	    var nLinea = 0;
	    for (var i = 0; i < lines.length; i++) {
	      procesarArchivo(lines[i],nLinea,name);
	      nLinea += 1;
	    }
	} catch (err) {
	    console.error(err);
	}
	REPLaux(readline);
}

function REPLaux(readline){
	readline.question('<Stokhos> ', entrada => {
		var re = /.lex/gi;
		var re1 = /.load/gi;
		if (entrada == "."){
			console.log("&")
			readline.input.destroy();
		}
		if (entrada.search(re) != -1){
			var instruccion = entrada.replace(re,"");
			lextest(instruccion,readline);
		}
		if (entrada.search(re1) != -1){
			var name = entrada.replace(re1,"");
			var fileName = name.replace(" ","");
			leerArchivo(fileName,readline);
		}
		else{
			if (entrada != "."){
				console.log("ERROR: Interpretacion no implementada");
			  REPLaux(readline);
			}
		}
    });
}


function showTokens(array : Array<string>) : Array<string>{
	var arreglo : Array<string> = [];
	for (var i = 0; i < array.length-1; i++) {
		if (i%2==0){
			if (array[i] == "TkNumber" || array[i] == "TkId"){
				arreglo.push(array[i] + "[" + array[i+1] + "]");
			}
			else{
				arreglo.push(array[i]);
			}
		}
	}
	return arreglo;
}

function guardarTokens(entrada) : Array<string> {
	var parseo = parse(entrada);
	var arreglo : Array<string> = [];
	recursivaGuardar(parseo?.ast,arreglo);
	return arreglo;
}

function recursivaGuardar(siguiente, arreglo : Array<string>) :  void {
    while(siguiente != undefined){
    	   arreglo.push(siguiente?.kind);
    	   arreglo.push(siguiente?.value);
    	   siguiente = siguiente?.next[0];
    }
}