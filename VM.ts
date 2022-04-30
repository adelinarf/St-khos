import {HashTable, Symbol} from "./hashtable.js"
import { getString } from "./getString.js"
import { getType , getASTType} from "./getTypes.js"
import { getEvaluation } from "./getEvaluation.js"
import {searchType} from "./searchType.js"

/*La clase VM implementa la maquina virtual de Stokhos que puede manejar el lexer, parser y lectura de archivos del lenguaje.
Se inicializa con los parsers necesarios para utilizar el lexer y parser del lenguaje.*/
export class VM {
  parser = require("./parser.js").parse;
  parser2 = require("./parser2.js").parse;
  symbolTable = new HashTable();
  computeCycle = 0;
  constructor() {
  	this.parser = require("./parser.js").parse;
  	this.parser2 = require("./parser2.js").parse;
  }
  /*La funcion process es el hilo principal en el que se puede utilizar el lenguaje Stokhos. Se parsea el input ingresado por el usuario,
  se hace uso de la funcion parse, que produce los tokens mediante el lexer y luego por medio de estos tokens se parsea la combinacion de
  tokens con ayuda de la gramatica del lenguaje. Una vez parseada la expresion se retorna un arbol sintactico abstracto o AST.
  Este AST puede ser nulo en caso de que haya un error y la expresion no forme parte de la sintaxis de Stokhos, si no lo es se emite
  un mensaje de error.
  En caso de que la expresion introducida por el usuario forme parte de la gramatica de Stokhos, se procede a realizar la verificacion de
  tipos. En casi de ser una asignacion, se considera el caso en que se asigna un arreglo, para evitar problemas con el kind durante la
  verificacion de tipos. 
  Al verificar los tipos con las funciones getTye y getASTType, si esta ultima retorna en la primera posicion de su tupla un string vacio,
  entonces los tipos no son los correctos, si no es vacio, este es el tipo de la expresion o definicion que se esta introduciendo.
  Una vez se han verificado los tipos se procede a ejecutar la definicion o asignacion o evaluar la expresion que haya introducido el
  usuario en el REPL.
  */
  process(input : string) : string {
  	var AST = this.parse(input,1);
  	var errores = "";
  	try{
  		var typeOfEntry = AST.ast.start.kind;
  		if (AST.ast.start.kind == "assign"){
  			typeOfEntry = searchType(AST,this.symbolTable);
  		}
	  	var types = getASTType(getType(AST,this.symbolTable,0),typeOfEntry);
	  	if (types[0]!=""){
	  		var typeOfInput = AST.ast.start.kind;
	  		if (typeOfInput == "declaration" || typeOfInput == "array" || typeOfInput == "assign"){
	  			this.execute(AST,input);
	  		}
	  		else{
	  			this.eval(AST,input);
	  		}
	  	}
	  	else{
	  		console.log(types[1][0]);
	  		errores = types[1][0];
	  	}
	  }
  	catch(error){
  		if (error instanceof RangeError){
				console.log("ERROR: Stack Overflow"); //En caso de que existan menciones circulares a la misma variable se muestra este error 
				errores = "ERROR: Stack Overflow";
  		}
  		if (error.ast == null){
  			console.log("ERROR: La expresion '"+input+"' no forma parte de la sintaxis de Stokhos.");
  			errores = "ERROR: La expresion '"+input+"' no forma parte de la sintaxis de Stokhos.";
  		}
  	}
  	return errores;
  }
  /*La funcion execute se encarga de ejecutar las definiciones realizadas por el usuario. Dentro de esta funcion se aumenta una vez 
  el ciclo de computo y se utiliza la funcion getEvaluation para ejecutar las definiciones, en donde seran insertadas en la tabla de
  simbolos y evaluadas en caso de ser necesario, dependiendo del ciclo de computo en el que se encuentre la VM.*/
  execute(AST : any, input : string){
  	this.computeCycle +=1;
  	var execution = getEvaluation(AST,this.symbolTable,this.computeCycle);
  	console.log("ACK: "+input);
  	this.symbolTable = execution[1]; //se actualiza la tabla de simbolos con los valores actualizados
  	this.computeCycle = execution[2]; //se actualiza el ciclo de computo
  }
  /*La funcion eval se encarga de evaluar las expresiones introducidas por el usuario en el REPL. Se hace uso de la funcion 
  getEvaluation para obtener los valores necesarios de las expresiones y sus evaluaciones y en caso de que retornen un arreglo,
  se colocan los simbolos "[]" para mostrar al usuario los valores de manera comprensible y que pueda reconocer que se trata de
  un arreglo.*/
  eval(AST : any, input : string){
  	var evaluation = getEvaluation(AST,this.symbolTable,this.computeCycle);
  	this.symbolTable = evaluation[1];
  	this.computeCycle = evaluation[2]; //se actualiza el ciclo de computo, ya que, puede ser modificado unicamente en esta funcion eval
  	if (Array.isArray(evaluation[0])){ //por medio de la funcion predefinida de Stokhos tick()
  		evaluation[0] = "["+evaluation[0].toString()+"]";
  	}
  	console.log("OK: "+input+" ==> "+evaluation[0]);
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
			if (number != 2){
				console.log("ERROR: Caracter invalido ('" + instruccion.charAt(pos) + "') en la entrada");
			}
			if (number == 1){
				return ["ERROR: Caracter invalido ('" + instruccion.charAt(pos) + "') en la entrada"];
			}
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
	    var nLinea = 1;
	    for (var i = 0; i < lines.length; i++) {
	      var re = /.lex/gi;
	      var re1 = /.load/gi;
	      var re2 = /.ast/gi;
	      if (lines[i] == " " || lines[i] == ""){
	      	continue;
	      }
	      if (lines[i].search(re) != -1){
	      	var instruccionMod = lines[i].replace(re,"");
	      	var getError = this.lextest(instruccionMod,1);
	      	if (getError[0]!="newLine"){
	      		errores.push([name, nLinea.toString(), getError[0]]);
	      	}
	      }
	      if (lines[i].search(re1) != -1){
	      	var name = lines[i].replace(re1,"");
			    var fileName = name.replace(" ","");
			    var error = this.leerArchivo(fileName,1);
			    errores = errores.concat(error[1]);
	      }
	      if (lines[i].search(re2) != -1){
	      	var line = lines[i].replace(re2,"");
          var geterror = this.testParser(line);
          if (geterror != ""){
          	errores.push([name, nLinea.toString(), geterror]);
          }
	      }
	      else{
	      	if (lines[i] != "" && lines[i] != " " && lines[i].search(re) == -1 && lines[i].search(re1) == -1 && lines[i].search(re2) == -1){
	      		var e = this.process(lines[i]);
	      		if (e!=""){
	      			errores.push([name, nLinea.toString(),e]);
	      		}
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
  testParser(entrada : string) : string {
  	var get = this.parse(entrada,0);
  	return get;
  }
  /*La funcion parse recibe una entrada desde el REPL y llama a la funcion del lexer que otorga los tokens, luego se realiza un nuevo
  parseo de estos tokens y llama a la funcion ast2str que imprime el AST como string.*/
  parse(entrada : string, val : number) : any {
  	var tokens : Array<string> = this.lextest(entrada,2);
  	tokens[tokens.length-1] = tokens[tokens.length-1].concat(" ");
  	var entradaModificada = tokens.join(" ");
  	var parseo = this.parser2(entradaModificada);
  	var output = "";
  	if (val == 0){
  		try{
  			this.ast2str(parseo,entrada);
	  	}
	  	catch(parseo){
	  		if (parseo.ast == null){
	  			console.log("ERROR : '"+entrada+"' no es parte de la sintaxis de Stokhos.");
	  			output = "ERROR : '"+entrada+"' no es parte de la sintaxis de Stokhos.";
	  		}
	  	}
  	}
  	else{
  		output = parseo;
  	}
  	return output;
  }
  /*La funcion ast2str toma el AST y la entrada del REPL, luego llama a la funcion getString que retorna el AST en forma de string
  parentizado.*/
  ast2str(AST : any,input : string){
  	var stringToShow = getString(AST,0);
  	console.log("OK: ast('"+input+"') ==> "+stringToShow);
  }
}