import { parsing,blank } from "./parsingFunctions.js"

/*La clase VM implementa la maquina virtual de Stokhos que puede manejar el lexer, parser y lectura de archivos del lenguaje.
Se inicializa con los parsers necesarios para utilizar el lexer y parser del lenguaje.*/
export class VM {
  parser = require("./parser.js").parse;
  parser2 = require("./parser2.js").parse;
  constructor() {
  	this.parser = require("./parser.js").parse;
  	this.parser2 = require("./parser2.js").parse;
  }
  /*La funcion process es el hilo principal en el que se puede utilizar el lenguaje Stokhos. 
  NOTA: Aun no ha sido implementado.
  */
  process(){
  	console.log("ERROR: Interpretacion no implementada");
  }
  /*La funcion lextest es el lexer del lenguaje Stokhos, se encarga de manejar la entrada introducida por el usuario y generar los
  tokens con los que trabajara el parser luego. Tiene varias funcionalidad, el numero de entrada number puede ser 0, en caso de llamar
  a .lex desde el REPL. Tambien puede ser 1 en caso de que se utilice para la lectura de archivo y 2 para ser utilizado por el parser,
  ya que, retorna el arreglo de tokens necesarios.*/
  lextest(instruccion : String,number) : Array<string> {
	var token = this.saveTokens(instruccion);
	var empty = " ";
	var cadena = empty.repeat(instruccion.length);
	if (instruccion.replace(cadena,"") == ""){
		console.log('OK: lex("") ==> ' + '[ ]');
		return ["newLine"];
	}
	else{
		if (token.length < 1){
			var parseo = this.parser(instruccion);
			var pos = parseo.errs[0].pos.overallPos;
			console.log("ERROR: Caracter invalido ('" + instruccion.charAt(pos) + "') en la entrada");
		}
		else{
			  var listaTokens = this.showTokens(token);
		    var imprimir = 'OK: lex("' + instruccion.substr(1,instruccion.length) + '") ==> ' + '[' + listaTokens + ']';
		    var sinEspacios = instruccion.replace(" ","");
		    if (number != 2){
		    	console.log(imprimir);
		    	return ["newLine"];
		    }
		    else{
		    	return listaTokens;
		    }
		}
	}
	if (number==0){
		return ["newLine"];
	}
	return ["noNewLine"];
  }
  /*La funcion leerArchivo, lee las lineas de un archivo y llama a la funcion lextest anterior para analizarlas. Si el archivo
  contiene una linea que tenga la funcion .load, esta se llama a si misma para ese y archivo y termina de procesar dicho archivo
  antes de comenzar con el original. En caso de errores, se guardan en un arreglo y se retornan al REPL en donde hay una variable
  global de la clase que guarda los errores de las corridas realizadas con .load*/
  leerArchivo(name,call) : [string,Array<Array<string>>] {
	const fs = require('fs');

	try {
	    const data = fs.readFileSync(name, 'UTF-8');
	    var errores : Array<Array<string>> = [];
	    const lines = data.split(/\r?\n/);
	    var nLinea = 0;
	    for (var i = 0; i < lines.length; i++) {
	      var re = /.lex/gi;
	      var re1 = /.load/gi;
	      if (lines[i] == " " || lines[i] == ""){
	      	continue;
	      }
	      if (lines[i].search(re) != -1){
	      	var instruccionMod = lines[i].replace(re,"");
	      	this.lextest(instruccionMod,1);
	      }
	      if (lines[i].search(re1) != -1){
	      	var name = lines[i].replace(re1,"");
			    var fileName = name.replace(" ","");
			    var error = this.leerArchivo(fileName,1);
			    errores = errores.concat(error[1]);
	      }
	      else{
	      	if (lines[i] != "" && lines[i] != " " && lines[i].search(re) == -1 && lines[i].search(re1) == -1){
	      		console.log("ERROR: Interpretacion no implementada");
		        errores.push([lines[i], lines[i].toString(),"ERROR: Interpretacion no implementada"]);
	      	}
	      }
	      nLinea += 1;
	    }
	} catch (err) {
	    console.error(err);
	}
	if (call==0){
		return ["newLine", errores];
	}
	return ["noNewLine", errores];
  }
  /*La funcion showTokens retorna un arreglo de strings que contiene los tokens de la expresion introducida en consola con la forma
  de string deseada. Este sera el arreglo de string que se le muestra al usuario al introducir una expresion luego de la funcion .lex*/
  showTokens(array : Array<string>) : Array<string>{
	var arreglo : Array<string> = [];
	for (var i = 0; i < array.length-1; i++) {
		if (i%2==0){
			if (array[i] == "TkNumber" || array[i] == "TkId"){
				arreglo.push(array[i] + "(" + array[i+1] + ")");
			}
			else{
				arreglo.push(array[i]);
			}
		}
	}
	return arreglo;
  }
  /*La funcion saveTokens retorna un arreglo de strings que contiene el tipo de token seguido por su valor.*/
  saveTokens(input) : Array<string> {
	var parseo = this.parser(input);
	var arreglo : Array<string> = [];
	if (parseo.ast != undefined || parseo.ast != null){
		this.saveInArray(parseo.ast.start,arreglo);
	}
	return arreglo;
  }
  /*La funcion saveInArray guarda los tokens del lexer en un arreglo, siguiendo de manera recursiva por medio de un while
  los nodos del arbol generado.*/
  saveInArray(siguiente, array : Array<string>) :  void {
    while(siguiente != undefined){
    	   array.push(siguiente.kind);
    	   array.push(siguiente.value);
    	   siguiente = siguiente.next[0];
    }
  }
  /*La funcion testParser se utiliza al llamar a la funcion .ast en el REPL para probar el parser de Stokhos que a su vez llama 
  a la funcion parse de esta VM.*/
  testParser(entrada : string){
  	this.parse(entrada);
  }
  /*La funcion parse recibe una entrada desde el REPL y llama a la funcion del lexer que otorga los tokens, luego se realiza un nuevo
  parseo de estos tokens y llama a la funcion ast2str que imprime el AST como string.*/
  parse(entrada : string){
  	var tokens : Array<string> = this.lextest(entrada,2);
  	tokens[tokens.length-1] = tokens[tokens.length-1].concat(" ");
  	var entradaModificada = tokens.join(" ");
  	var parseo = this.parser2(entradaModificada);
  	try{
  		this.ast2str(parseo,entrada);
  	}
  	catch(parseo){
  		if (parseo.ast == null){
  			console.log("ERROR : '"+entrada+"' no es parte de la sintaxis de Stokhos.");
  		}
  	}
  }
  /*La funcion ast2str toma el AST y la entrada del REPL, luego llama a la funcion parsing, que retorna un arreglo de strings con el 
  orden inorder del arbol y luego se mapea este arreglo con una estructura map que pasa los tokens a valores reales del lenguaje y
  finalmente con getString se retorna un string basado en el arreglo de strings que puede ser mostrado en consola.*/
  ast2str(AST : any,input : string){
  	var arrayInorder = parsing(AST);
  	var typeOfParsing = arrayInorder[arrayInorder.length-1];
  	var inorderArrangement = arrayInorder.slice(0,arrayInorder.length-1);
  	//console.log(arrayInorder);
  	blank();
  	var map = this.getNames();
  	var stringToShow = this.getString(arrayInorder,map);
  	console.log("'"+input+"'"+"=parse=> [[AST]] =ast2str => '"+stringToShow+"'");
  }
  /*La funcion getString toma el arreglo de strings generado por el analisis del AST y una estructura map. Se analiza cada una
  de las posiciones del arreglo y se modifica con la estructura map o sin ella en caso de ser TkId o TkNumber, los que deben
  ser modificados, ya que, se debe conseguir el valor real que contienen entre los parentesis.
  Si la expresion insertada en consola es una instruccion, se realiza el mismo procedimiento pero añadiendo los strings necesarios.*/ 
  getString(arrayInorder : Array<string>, map : Map<string,string>) : string{
  	var parseo : string = "";
  	var re = /TkNumber/gi;
  	var re1 = /TkId/gi;
  	if (arrayInorder[arrayInorder.length-1] == "exp"){
  		for (var i = 0; i < arrayInorder.length-1; i++) {
  		if (arrayInorder[i].search(re) == 0 || arrayInorder[i].search(re1)==0){
  			parseo = this.verifyToken(arrayInorder,parseo,i);
  		}
  		else{
  			var stringS = map.get(arrayInorder[i]);
  			parseo = parseo.concat(stringS);
  		}  		
  	}
  	}
  	else{
  		parseo = "def(";
  		for (var i = 0; i < arrayInorder.length-1; i++) {
  			if (arrayInorder[i].search(re) == 0 || arrayInorder[i].search(re1)==0){
  				parseo = this.verifyToken(arrayInorder,parseo,i);
  		  }
  		  else{
  		  	var stringP = map.get(arrayInorder[i]);
  		  	parseo = parseo.concat(stringP);
  		  }  		
	  		if (i < arrayInorder.length-2){
	  			parseo = parseo.concat(",");
	  		}
	  		else{
	  			parseo = parseo.concat(")");
	  		}
  		}
  	}
  	return parseo;
  }
  /*La funcion verifyToken verifica si el arreglo de strings contiene un token id o number y se elimina la informacion no relevante
  para luego ser concatenado con el string final de la expresion.*/
  verifyToken(arrayInorder : Array<string>, parseo :string, i :number) : string {
  	  var re = /TkNumber\(/gi;
  		var re1 = /TkId\(/gi;
  		if (arrayInorder[i].search(re) == 0){
  			var token = arrayInorder[i].replace(re,"");
  			token = token.replace(") ","");
  			parseo = parseo.concat(token);
  		}
  		if (arrayInorder[i].search(re1) == 0){
  			var token = arrayInorder[i].replace(re1,"");
  			token = token.replace(") ","");
  			parseo = parseo.concat(token);
  		}
  	return parseo;
  }
  /*La funcion getNames retorna una estructura Map<string,string> que es capaz de mapear el nombre de cada token TkName con su valor
  dentro del lenguaje Stokhos.*/
  getNames() : Map<string,string> {
  	var newMap = new Map<string,string>();
  	newMap.set("TkNum","num");
  	newMap.set("TkFalse ","false");
  	newMap.set("TkTrue ","true");
  	newMap.set("TkBool","bool");
  	newMap.set("TkAssign",":=");
  	newMap.set("TkColon",":");
  	newMap.set("TkSemiColon",";");
  	newMap.set("TkComma",",");
  	newMap.set("TkQuote","'");
  	newMap.set("TkNot","!");
  	newMap.set("TkOpenPar","(");
  	newMap.set("TkClosePar",")");
  	newMap.set("TkOpenBracket","[");
  	newMap.set("TkCloseBracket","]");
  	newMap.set("TkOpenBrace","{");
  	newMap.set("TkCloseBrace","}");
  	newMap.set("TkOr","||");
  	newMap.set("TkAnd","&&");
  	newMap.set("TkPower","^");
  	newMap.set("TkDiv","/");
  	newMap.set("TkPlus","+");
  	newMap.set("TkMult","*");
  	newMap.set("TkMod","%");
  	newMap.set("TkMinus","-");
  	newMap.set("TkLE","<=");
  	newMap.set("TkNE","<>");
  	newMap.set("TkLT","<");
  	newMap.set("TkGT",">");
  	newMap.set("TkGE",">=");
  	newMap.set("TkEQ","=");
  	return newMap;
  }
}