import { e1,e2,e3,e4,e5,e6,e7,e8,termino, e2_$0 } from "./parser2";
import {HashTable, Symbol} from "./hashtable.js"
import {evaluate} from "./getEvaluation.js"


/*La funcion search se encarga de buscar los hijos a derecha del arbol que estamos generando. Se crea un padre, que es la operacion
y de manera recursiva se incluyen los hijos derechos e izquierdos de este padre, para que se genere un arbol binario con el orden
correcto y que representa a este AST pero con un arbol binario.*/

function map(token : string) : string {
		var re = /TkNumber\(/gi;
		var re1 = /TkId\(/gi;
		var re2 = /Tk/gi;
		var nuevo = "";
		if (token.search(re) > -1){
			var token = token.replace(re,"");
			token = token.replace(") ","");
			nuevo = token;
		}
		if (token.search(re1) > -1){
			var token = token.replace(re1,"");
			token = token.replace(") ","");
			nuevo = token;
		}
		if (token.search(re2) > -1){  //Si el token no es ni TkNumber ni TkId se llama a una funcion que contiene una estructura map
			var mappedTo = mapping(); //que mapea cada uno de los tokens del lenguaje a su verdadero valor.
			nuevo = mappedTo.get(token);
		}
		else{
			nuevo = token;
		}
		return nuevo;
	}

function mapping() : Map<string,string>{
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

function mappingTypes() : Map<string,string>{
  	var newMap = new Map<string,string>();
  	newMap.set("TkNot","bool");
  	newMap.set("TkOr","bool");
  	newMap.set("TkAnd","bool");
  	newMap.set("TkPower","num");
  	newMap.set("TkDiv","num");
  	newMap.set("TkPlus","num");
  	newMap.set("TkMult","num");
  	newMap.set("TkMod","num");
  	newMap.set("TkMinus","num");
  	newMap.set("TkLE","bool");
  	newMap.set("TkNE","bool");
  	newMap.set("TkLT","bool");
  	newMap.set("TkGT","bool");
  	newMap.set("TkGE","bool");
  	newMap.set("TkEQ","bool");
  	return newMap;
  }

function search(array : Array<any>,nombre : Function, tipos : Array<string>,tiposOp : Array<string>,errores:Array<string>, typeOfInput : string) : [Array<string>,Array<string>,Array<string>,number] {
    var isArray = 2;
    if (array != undefined && array.length>0){
        for (var i = 0; i < array.length; i++) {
            var entrada = array[i].next;
            [tipos,tiposOp,errores,isArray] = nombre(entrada,tipos,tiposOp,errores,typeOfInput);
            var mappedToType = mappingTypes();
			var typeOfOperation = mappedToType.get(array[i].op.kind);
			tiposOp.push(typeOfOperation);
        }
    }
    return [tipos,tiposOp,errores,isArray];
}

/*La funciones parseEi se encargan de visitar los nodos del arbol AST generados por el parser. Ademas se generan nodos en cada
una de las funciones. Se llama a la funcion search que se encarga de visitar el atributo a que contiene los hijos de la operacion
en el arbol, por lo que si es undefined, no contiene hijos y esa regla en particular no ha sido aplicada.
Se debe considerar que se van generando los nodos de manera recursiva, por lo que el arbol consiste de un nodo que recursivamente 
contiene hijos que forman un arbol binario que puede visitarse con mayor facilidad que el arbol que nos proporciona el parser.
En cada funcion parseEi se llama a la funcion parseEi+1 si es utilizada la regla i y se genera un nodo cuyos hijos son el acumulado de
visitar de manera recursiva a la regla siguiente y la busqueda del atributo a.
A diferencia de la funcion parsing se requiere el retorno de un nodo y un string que es el tipo de la expresion que se esta analizando 
para realizar el analisis de tipos al llegar a la funcion parseE8.*/

/*La funcion parseE1 maneja la regla 1 de la gramatica.*/
function parseE1(expr : e1, tipos : Array<string>,tiposOp : Array<string>,errores:Array<string>, typeOfInput : string) : [Array<string>,Array<string>,Array<string>,number] {
	var leftVar = parseE2(expr.e,tipos,tiposOp,errores,typeOfInput);
	tipos = leftVar[0];
	tiposOp = leftVar[1];
	errores = leftVar[2];
	var isArray = leftVar[3];
	var now= search(expr.a,parseE2,tipos,tiposOp,errores,typeOfInput);
    tipos = now[0];
	tiposOp = now[1];
	errores = now[2];
	if (now[3]!=2){
		isArray = now[3];
	}
    return [tipos,tiposOp,errores,isArray];
}

/*La funcion parseE2 maneja la regla 2 de la gramatica.*/
function parseE2(expr : e2, tipos : Array<string>,tiposOp : Array<string>,errores:Array<string>, typeOfInput : string) : [Array<string>,Array<string>,Array<string>,number] {
	var leftVar = parseE3(expr.e,tipos,tiposOp,errores,typeOfInput);
	tipos = leftVar[0];
	tiposOp = leftVar[1];
	errores = leftVar[2];
	var isArray = leftVar[3];
	var now= search(expr.a,parseE3,tipos,tiposOp,errores,typeOfInput);
    tipos = now[0];
	tiposOp = now[1];
	errores = now[2];
	if (now[3]!=2){
		isArray = now[3];
	}
    return [tipos,tiposOp,errores,isArray];
}

/*La funcion parseE3 maneja la regla 3 de la gramatica.*/
function parseE3(expr : e3, tipos : Array<string>,tiposOp : Array<string>,errores:Array<string>, typeOfInput : string) : [Array<string>,Array<string>,Array<string>,number] {
	var leftVar = parseE4(expr.e,tipos,tiposOp,errores,typeOfInput);
	tipos = leftVar[0];
	tiposOp = leftVar[1];
	errores = leftVar[2];
	var isArray = leftVar[3];
	var now= search(expr.a,parseE4,tipos,tiposOp,errores,typeOfInput);
    tipos = now[0];
	tiposOp = now[1];
	errores = now[2];
	if (now[3]!=2){
		isArray = now[3];
	}
    return [tipos,tiposOp,errores,isArray];
}

/*La funcion parseE4 maneja la regla 4 de la gramatica.*/
function parseE4(expr : e4, tipos : Array<string>,tiposOp : Array<string>,errores:Array<string>, typeOfInput : string) : [Array<string>,Array<string>,Array<string>,number] {
	var leftVar = parseE5(expr.e,tipos,tiposOp,errores,typeOfInput);
	tipos = leftVar[0];
	tiposOp = leftVar[1];
	errores = leftVar[2];
	var isArray = leftVar[3];
	var now= search(expr.a,parseE5,tipos,tiposOp,errores,typeOfInput);
    tipos = now[0];
	tiposOp = now[1];
	errores = now[2];
	if (now[3]!=2){
		isArray = now[3];
	}
    return [tipos,tiposOp,errores,isArray];
}

/*La funcion parseE5 maneja la regla 5 de la gramatica.*/
function parseE5(expr : e5, tipos : Array<string>,tiposOp : Array<string>,errores:Array<string>, typeOfInput : string) : [Array<string>,Array<string>,Array<string>,number] {
	var leftVar = parseE6(expr.e,tipos,tiposOp,errores,typeOfInput);
	tipos = leftVar[0];
	tiposOp = leftVar[1];
	errores = leftVar[2];
	var isArray = leftVar[3];
	var now= search(expr.a,parseE6,tipos,tiposOp,errores,typeOfInput);
    tipos = now[0];
	tiposOp = now[1];
	errores = now[2];
	if (now[3]!=2){
		isArray = now[3];
	}
    return [tipos,tiposOp,errores,isArray];
}

/*La funcion parseE6 maneja la regla 6 de la gramatica. Esta regla considera unicamente los operadores unarios, por lo que no se
hace un llamado a la funcion search, ya que, no existe este atributo.*/
function parseE6(expr : e6, tipos : Array<string>,tiposOp : Array<string>,errores:Array<string>, typeOfInput : string) : [Array<string>,Array<string>,Array<string>,number] {
    if (expr.uop != undefined && expr.uop.length > 0){
    	var mappedToType2 = mappingTypes();
		var typeOfOperation2 = mappedToType2.get(expr.uop[0].kind);
		tipos.push(typeOfOperation2);
        for (var i = 1; i < expr.uop.length; i++) { //esto debe ser uno para que funcionen los unarios
    	    var mappedToType = mappingTypes();
			var typeOfOperation = mappedToType.get(expr.uop[i].kind);
			tiposOp.push(typeOfOperation);
        }
    }
    var leftVar = parseE7(expr.e,tipos,tiposOp,errores,typeOfInput);
    tipos = leftVar[0];
	tiposOp = leftVar[1];
	errores = leftVar[2];
	var isArray = leftVar[3];
    return [tipos,tiposOp,errores,isArray];
}

/*La funcion parseE7 maneja la regla 7 de la gramatica*/
function parseE7(expr : e7, tipos : Array<string>,tiposOp : Array<string>,errores:Array<string>, typeOfInput : string) : [Array<string>,Array<string>,Array<string>,number] {
	var leftVar = parseE8(expr.e,tipos,tiposOp,errores,typeOfInput);
	tipos = leftVar[0];
	tiposOp = leftVar[1];
	errores = leftVar[2];
	var isArray = leftVar[3];
	var now = search(expr.a,parseE8,tipos,tiposOp,errores,typeOfInput);
	tipos = now[0];
	tiposOp = now[1];
	errores = now[2];
	if (now[3]!=2){
		isArray = now[3];
	}
    return [tipos,tiposOp,errores,isArray];
}

/*La funcion parseE8 maneja la regla 8 de la gramatica, por lo que se encarga de los simbolos: {},[] y () y retorna un nodo
que contiene unicamente el valor de un TkId, TkNumber, TkFalse y TkTrue. Se verifica el tipo del termino, si es un numero, se
guarda en el tipo del nodo y si es un ID se analiza la tabla de simbolos para verificar que existe, si no existe se guarda como 
error. En caso de ser unicamente, expresiones, se llega a esta funcion la primera vez con type="", por lo que hay un caso que maneja
esto, para luego modificar el tipo de la primera variable o valor encontrado.*/
function parseE8(expr : e8, tipos : Array<string>,tiposOp : Array<string>,errores:Array<string>, typeOfInput : string) : [Array<string>,Array<string>,Array<string>,number] {
	var hasLType = 2; //0 para arreglos, 1 para declaraciones y 2 para expresiones
	if (expr.kind == "e8_1" || expr.kind == "e8_3" || expr.kind == "e8_4"){
        var result = parseE1(expr.value.e as e1, tipos,tiposOp,errores,typeOfInput);
        tipos = result[0];
		tiposOp = result[1];
		errores = result[2];
    }
    if (expr.kind == "e8_2"){ //es un arreglo
		var result1 = parseArray(expr.value,tipos,tiposOp,errores,typeOfInput);
    	tipos = result1[0]; 
		tiposOp = result1[1];
		errores = result1[2];
		hasLType = 0;
    }
    if (expr.kind != "e8_1" && expr.kind != "e8_2" && expr.kind != "e8_3" && expr.kind != "e8_4"){
    	if (expr.kind == "terms_3"){
            var obtain = symbol.search(map(expr.value.value));
            if (expr.b == undefined){
	            if (obtain[0]!=false){
	            	var t = obtain[1].type;
	            	if (expr.a != null){
		        		tipos.push(t);
		        		var valueOfPosition = evaluate(expr.a.next.e as e1);
		                var result2 = parseE1(expr.a.next.e as e1,tipos,tiposOp,errores,"assignArrayPos");
		                if (result2[0].includes("float")){
		                	errores.push("ERROR: La posicion del arreglo "+map(expr.value.value)+" debe ser un numero entero.")
		                }
		                if (valueOfPosition>=obtain[1].array.length || valueOfPosition < 0){
		                	errores.push("ERROR: La posicion "+valueOfPosition.toString()+" no se encuentra dentro del arreglo.");
		                }
		                tipos = result2[0];
						tiposOp = result2[1];
						errores = result2[2];
						hasLType = 1;
		            }
		            if (expr.a == null){
		            	tipos.push(t);
		            	if (obtain[1].AST.ast.start.kind == "array"){
			            	hasLType = 0;
			            }
			            else{
			            	hasLType = 1;
			            }
		            }
	            }
	            else{
	            	errores.push("ERROR: La variable "+map(expr.value.value)+" no esta definida.");
	            }
            }
            else{
                var functionName = map(expr.value.value);
                if (expr.b.next!=undefined){
                	var result3 = parseFunction(expr.b.next, tipos,tiposOp,errores,functionName,typeOfInput);
                	tipos = result3[0];
					tiposOp = result3[1];
					errores = result3[2];
                }
			    else{
			    	var handle = parseEmptyArgument(expr.value.value);
			    	if (handle != ""){
			    		errores.push(handle);
			    	}
			    }
            }
        }
        else{
            if (expr.kind == "TkNumber"){
            	if (typeOfInput == "assignArrayPos"){
            		var val = map(expr.value);
            		var int = parseInt(val);
            		var float = parseFloat(val);
            		if (int == float){
            			tipos.push("int");
            		}
            		else{
            			tipos.push("float");
            		}
            	}
            	else{
            		tipos.push("num");
            	}
            }
            if (expr.kind == "TkFalse" || expr.kind == "TkTrue"){
            	tipos.push("bool");
            }
        }
    }
    return [tipos,tiposOp,errores,hasLType];
}

function parseEmptyArgument(nameF : string) : string {
	var string = "";
	var name = map(nameF);
	if (name == "reset" || name == "uniform" || name=="pi" || name == "now" || name == "tick"){
		string = "";
	}
	else{
		string = "ERROR: La funcion "+name+" requiere un argumento.";
	}
	return string;
}


function parseFunction(expr : termino, tipos:Array<string>,tiposOp:Array<string>,errores:Array<string>,functionName : string, typeOfInput : string) : [Array<string>,Array<string>,Array<string>] {
	if (functionName == "if"){
		if (expr.b!=undefined){
			if (expr.b.length>2 || expr.b.length<2){
				errores.push("ERROR: La funcion if requiere 3 argumentos.");
			}
			else{
				var resultCondition = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			    var resultExp1 = parseE1(expr.b[0].e.e,resultCondition[0],resultCondition[1],resultCondition[2],typeOfInput);
			    var resultExp2 = parseE1(expr.b[1].e.e,resultExp1[0],resultExp1[1],resultExp1[2],typeOfInput);
			    if (resultExp2[3] != 0 || resultExp2[0].length==3){
			    	if (resultExp2[1][0]=="bool"){
				    	if (resultExp1[0][resultExp1[0].length-2]!=resultExp2[0][resultExp2[0].length-1]){
				    		errores.push("ERROR: El tipo del segundo y tercer argumento debe ser el mismo.");
				    	}
				    	else{
				    		var set = new Set(tiposOp);
				    		var m = set.values();
					        var value = m.next().value;
					        if (set.size <= 1){
					        	if (value == resultExp2[1][0]){
					        		tipos = ["bool"];
					        		tiposOp = ["bool"];
					        	}
					        	else{
					        		errores.push("ERROR: El tipo de las operaciones de las expresiones no coincide con los operandos.");
					        	}
					        }
					        else{
					        	errores.push("ERROR: El tipo de las operaciones de las expresiones no coincide.");
					        }
				    	}
				    }
				    else{
				    	errores.push("ERROR: El tipo del primero argumento de la funcion if no es correcto (debe ser de tipo bool).");
				    }
			    }
			    else{
			    	errores.push("ERROR: La funcion if requiere 3 argumentos para ser correcto.");
			    }
			}
		}
		else{
			errores.push("ERROR: La funcion if requiere 3 argumentos.");
		}
	}
	if (functionName == "type"){
		if (expr.e.e!=undefined){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			tipos.push("types");
		}
		else{
			errores.push("ERROR: La funcion type requiere un argumento.");
		}
	}
	if (functionName == "ltype"){
		if (expr.e.e!=undefined){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3];
			if (hasLType == 2){
				errores.push("ERROR: La funcion ltype requiere un argumento (array o variable).");
			}
			else{
				tipos.push("types");
			}
		}
		else{
			errores.push("ERROR: La funcion ltype requiere un argumento.");
		}
	}
	if (functionName == "reset"){
		if (expr.e.e!=undefined){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			if (result[0].length!=0){
				errores.push("ERROR: La funcion reset no requiere argumentos.");
			}
			else{
				tipos.push("bool");
			}
		}
	}
	if (functionName == "uniform"){
		if (expr.e.e!=undefined){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			if (result[0].length!=0){
				errores.push("ERROR: La funcion uniform no requiere argumentos.");
			}
			else{
				tipos.push("num");
			}
		}
	}
	if (functionName == "floor"){
		if (expr.e.e!=undefined){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3];
			if (hasLType != 2 && result[0].includes("num")==false){
				errores.push("ERROR: La funcion floor requiere un argumento de tipo num.");
			}
			else{
				tipos.push("num");
			}
		}
		else{
			errores.push("ERROR: La funcion floor requiere un argumento.");
		}
	}
	if (functionName == "length"){
		if (expr.e.e!=undefined){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3];
			if (hasLType != 0){
				errores.push("ERROR: La funcion length requiere un argumento (arreglo).");
			}
			else{
				tipos=["num"];
			}
		}
		else{
			errores.push("ERROR: La funcion length requiere un argumento.");
		}
	}
	if (functionName == "sum"){
		if (expr.e.e!=undefined){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3];
			if (hasLType != 0){
				errores.push("ERROR: La funcion sum requiere un argumento (arreglo de tipo num).");
			}
			else{
				var argument : [Array<string>,Array<string>,Array<string>] = [result[0],result[1],result[2]];
				var obt = getASTType(argument,typeOfInput);
				if (obt[0]!=""){
					if (obt[0]=="num"){
						tipos.push("num");
					}
					else{
						errores.push("ERROR: La funcion sum requiere como argumento un arreglo de tipo num.");
					}
				}
			}
		}
		else{
			errores.push("ERROR: La funcion sum requiere un argumento.");
		}
	}
	if (functionName == "avg"){
		if (expr.e.e!=undefined){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3];
			if (hasLType != 0){
				errores.push("ERROR: La funcion avg requiere un argumento (arreglo de tipo num).");
			}
			else{
				var argument3 : [Array<string>,Array<string>,Array<string>] = [result[0],result[1],result[2]];
				var obt = getASTType(argument3,typeOfInput);
				if (obt[0]!=""){
					if (obt[0]=="num"){
						tipos.push("num");
					}
					else{
						errores.push("ERROR: La funcion avg requiere como argumento un arreglo de tipo num.");
					}
				}
			}
		}
		else{
			errores.push("ERROR: La funcion avg requiere un argumento (arreglo de tipo num).");
		}
	}
	if (functionName == "pi"){
		if (expr.e.e!=undefined){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			if (result[0].length!=0){
				errores.push("ERROR: La funcion pi no requiere argumentos.");
			}
			else{
				tipos.push("num");
			}
		}
	}
	if (functionName == "now"){
		if (expr.e.e!=undefined){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			if (result[0].length!=0){
				errores.push("ERROR: La funcion now no requiere argumentos.");
			}
			else{
				tipos.push("num");
			}
		}
	}
	if (functionName == "ln"){
		if (expr.e.e!=undefined){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3];
			if (hasLType != 2 && result[0].includes("num")==false){
				errores.push("ERROR: La funcion ln requiere un argumento de tipo num.");
			}
			else{
				tipos.push("num");
			}
		}
		else{
			errores.push("ERROR: La funcion ln requiere un argumento.");
		}
	}
	if (functionName == "sqrt"){
		if (expr.e.e!=undefined){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3];
			if (hasLType != 2 && result[0].includes("num")==false){
				errores.push("ERROR: La funcion sqrt requiere un argumento de tipo num.");
			}
			else{
				tipos.push("num");
			}
		}
		else{
			errores.push("ERROR: La funcion sqrt requiere un argumento.");
		}
	}
	if (functionName == "exp"){
		if (expr.e.e!=undefined){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3];
			if (hasLType != 2 && result[0].includes("num")==false){
				errores.push("ERROR: La funcion exp requiere un argumento de tipo num.");
			}
			else{
				tipos.push("num");
			}
		}
		else{
			errores.push("ERROR: La funcion exp requiere un argumento.");
		}
	}
	if (functionName == "sin"){
		if (expr.e.e!=undefined){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3];
			if (hasLType != 2 && result[0].includes("num")==false){
				errores.push("ERROR: La funcion sin requiere un argumento de tipo num.");
			}
			else{
				tipos.push("num");
			}
		}
		else{
			errores.push("ERROR: La funcion sin requiere un argumento.");
		}
	}
	if (functionName == "cos"){
		if (expr.e.e!=undefined){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3];
			if (hasLType != 2 && result[0].includes("num")==false){
				errores.push("ERROR: La funcion cos requiere un argumento de tipo num.");
			}
			else{
				tipos.push("num");
			}
		}
		else{
			errores.push("ERROR: La funcion cos requiere un argumento.");
		}
	}
	if (functionName == "formula"){
		if (expr.e.e!=undefined){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3];
			if (hasLType != 1){
				errores.push("ERROR: La funcion formula requiere una variable o posicion de un arreglo como argumento.");
			}
			else{
				tipos.push("types");
			}
		}
		else{
			errores.push("ERROR: La funcion formula requiere un argumento.");
		}
	}
	if (functionName == "tick"){
		if (expr.e.e!=undefined){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			if (result[0].length!=0){
				errores.push("ERROR: La funcion tick no requiere argumentos.");
			}
			else{
				tipos.push("num");
			}
		}
	}
	if (functionName == "array"){
		if (expr.b!=undefined){
			if (expr.b.length>1 || expr.b.length<1){
				errores.push("ERROR: La funcion array requiere 2 argumentos.");
			}
			else{
				var size = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			    var hasLType = size[3];
			    if (hasLType != 2 && size[0].includes("num")==false){
			    	errores.push("ERROR: La funcion array requiere un primer argumento de tipo num para el tamaño del arreglo.");
			    }
			    var init = parseE1(expr.b[0].e.e,size[0],size[1],size[2],typeOfInput);
			    if (init[0][0]!="num"){
			    	errores.push("ERROR: El primer argumento de la funcion array debe ser de tipo num.");
			    }
			    else{
			    	if (init[0].length!=1){
			    		tipos = [init[0][1],"array"];
			    	}
			    	else{
			    		tipos = [init[0][0],"array"];
			    	}
			    	//tipos.push(init[0][1]);
			    	//tipos.push("array");
			    }
			}
		}
		else{
			errores.push("ERROR: La funcion if requiere 3 argumentos.");
		}
	}
	if (functionName == "histogram"){
		if (expr.b!=undefined){
			if (expr.b.length>4 || expr.b.length<4){
				errores.push("ERROR: La funcion histogram requiere 5 argumentos.");
			}
			else{
				var exp = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			    var nsamples = parseE1(expr.b[0].e.e,exp[0],exp[1],exp[2],typeOfInput);
			    var nbuckets = parseE1(expr.b[1].e.e,nsamples[0],nsamples[1],nsamples[2],typeOfInput);
			    var lowerBound = parseE1(expr.b[1].e.e,nbuckets[0],nbuckets[1],nbuckets[2],typeOfInput);
			    var upperBound = parseE1(expr.b[1].e.e,lowerBound[0],lowerBound[1],lowerBound[2],typeOfInput);
			    var hasLType = exp[3];
			    if (hasLType != 2 && exp[0].includes("num")==false){
			    	errores.push("ERROR: La funcion histogram requiere un primer argumento de tipo num.");
			    }
			    else{
			    	if (nsamples[3]!=2 && nsamples[0].includes("num")==false){
			    		errores.push("ERROR: La funcion histogram requiere un segundo argumento de tipo num.");
			    	}
			    	else{
			    		if (nbuckets[3]!=2 && nbuckets[0].includes("num")==false){
			    			errores.push("ERROR: La funcion histogram requiere un tercer argumento de tipo num.");
			    		}
			    		else{
			    			if (lowerBound[3]!=2 && lowerBound[0].includes("num")==false){
			    				errores.push("ERROR: La funcion histogram requiere un cuarto argumento de tipo num.");
			    			}
			    			else{
			    				if (upperBound[3]!=2 && upperBound[0].includes("num")==false){
			    					errores.push("ERROR: La funcion histogram requiere un quinto argumento de tipo num.");
			    				}
			    				else{
			    					tipos.push("array");
			    					tipos.push("num");
			    				}
			    			}
			    		}
			    	}
			    }
			}
		}
		else{
			errores.push("ERROR: La funcion histogram requiere 5 argumentos histogram(num,num,num,num,num).");
		}
	}

	var predefinedFunctions = ["if","type","ltype","reset","uniform","floor","length","sum","avg","pi","now","ln","exp","sin","cos","formula","tick","array","histogram","sqrt"];
	if (predefinedFunctions.indexOf(functionName) <= -1){
		errores.push("ERROR: La funcion "+functionName+" no esta definida en Stokhos.");
	}
    return [tipos,tiposOp,errores];
}


function parseArray(expr : termino,tipos : Array<string>, tiposOp : Array<string>,errores : Array<string>, typeOfInput : string) : [Array<string>,Array<string>,Array<string>] {
    if (expr!=null && expr.e != null && expr.e.e!=null){
    	var result1 = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
	    tipos = result1[0];
		tiposOp = result1[1];
		errores = result1[2];
	    if (expr.b != undefined){
	    	var nodos = [];
	    	for (var i = 0; i < expr.b.length; i++) {
	            var result = parseE1(expr.b[i].e.e,tipos,tiposOp,errores,typeOfInput);
	            tipos = result[0];
				tiposOp = result[1];
				errores = result[2];
	        }
	    }
    }
    tipos.push("array");
    return [tipos,tiposOp,errores];
}

/*La funcion parseTermino analiza un arreglo y verifica un arbol por cada una de las posiciones del arreglo, luego crea el string
que representa al arreglo en su totalidad. Tambien se crea un arreglo con la evaluacion de cada una de las posiciones y los tipos.*/
function parseTermino(expr : termino,tipos : Array<string>, tiposOp : Array<string>,errores : Array<string>, typeOfInput : string) : [Array<string>,Array<string>,Array<string>] {
    var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
    tipos = result[0];
	tiposOp = result[1];
	errores = result[2];
    if (expr.b != undefined){
    	for (var i = 0; i < expr.b.length; i++) {
            var result1 = parseE1(expr.b[i].e.e,tipos,tiposOp,errores,typeOfInput);
            tipos = result1[0];
			tiposOp = result1[1];
			errores = result1[2];
        }
    }
    return [tipos,tiposOp,errores];
}

/*La funcion validateAndEvaluate visita el AST obtenido por medio del parser para realizar la validacion y evaluacion de las expresiones introducidas
en el lenguaje. Se visita el arbol de manera similar a la funcion parsing, pero se realizan cambios para considerar los tipos
de los terminos al conseguirlos en la funcion parseE8. Se genera un arbol que toma como nodo, lo obtenido en la evaluacion de las 
funciones, para conseguir la evaluacion de la expresion, se llama a una funcion del arbol llamada getResult.
Ademas en caso de crear nuevas variables o arreglos, se agregan a la tabla de simbolos que es una de las entradas de la funcion.
Si es una asignacion, se modifica la variable con ayuda de la estructura tabla de hash que se ha generado para la tabla de simbolos.
Ademas se consideran los tipos de la expresion para su posterior uso en un set que sera retornado por la funcion.
Se retorna una tupla de tipo [Array<string>,string,HashTable,Array<any>,Set<string>]. En los que se retorna:
	errores: Array<string>
	ASTStringForm : string
	symbolTable : HashTable
	evaluation : Array<any>
	setOfTypes : Set<string>
	Con la informacion obtenida con esta funcion se puede obtener toda la informacion relacionada a cualquier expresion que sea tipeada
	en Stokhos, ya que, se conocen los tipos, la nueva tabla de simbolos, su string asociado, los errores que genera en caso de hacerlo y
	la evaluacion de la expresion en los valores guardados en tabla de simbolos y otras expresiones.
*/
var symbol : HashTable;

export function getType(ASTtree : any, symbolTable : HashTable, mode : number) : [Array<string>,Array<string>,Array<string>] {
	//0 si se esta usando para definir y 1 si se quiere conocer el tipo de la variable para verificar 
    var type = ASTtree.ast.start.kind; 
    symbol = symbolTable;
    let valor = ASTtree.ast.start.e as e1;
    var arbol : string;
    var mappedTo = mappingTypes();
    var tipos = [];
	var tiposOp = [];
	var errores = [];
    if (type == "declaration"){
        valor = ASTtree.ast.start.e.e as e1;
        var declarationType = ASTtree.ast.start.type.kind;
        var declarationID = ASTtree.ast.start.id.value;
         //que mapea cada uno de los tokens del lenguaje a su verdadero valor.
		var nuevo = map(declarationType);
        var result = symbolTable.search(map(declarationID));
        if (mode == 0){
            if (result[0]!=true){
	    		tipos.push(nuevo);
		        [tipos,tiposOp,errores] = parseE1(valor,tipos,tiposOp,errores,type);
	    	}
	    	else{
	    		errores.push("ERROR: La variable "+map(declarationID)+" ya ha sido definida.");
	    	}	
        }
        else{
        	if (result[0]==true){
        		tipos.push(nuevo);
		        [tipos,tiposOp,errores] = parseE1(valor,tipos,tiposOp,errores,type);
        	}
        	else{
        		errores.push("ERROR: La variable "+map(declarationID)+" no ha sido definida.");
        	}
        }
    	
    }
    if (type == "assign"){ //se debe buscar el tipo en la tabla de simbolos si no existe se lanza un error
    	var assignId = ASTtree.ast.start.id.value;
    	valor = ASTtree.ast.start.e.e as e1;
    	var result = symbolTable.search(map(assignId));
    	if (result[0]!=false){
    		var t = result[1].type; //getASTType(getType(result[1].AST,symbolTable,1),type);
    		if (t!=""){
    			tipos.push(t);
	    		if (ASTtree.ast.start.a != undefined){
	    			[tipos,tiposOp,errores] = parseE1(valor,tipos,tiposOp,errores,type);
	    			var results = parseE1(ASTtree.ast.start.a.next.e,tipos,tiposOp,errores,"assignArrayPos");
	    			if (results[0].includes("float")){
	    				errores.push("ERROR: La posicion del arreglo debe ser un numero entero.");
	    			}
		    	}
		    	else{
		    		[tipos,tiposOp,errores] = parseE1(valor,tipos,tiposOp,errores,type);
		    	}
    		}
    		//else{
    		//	errores.push(t[1]);
    		//}
    	}
    	else{
    		errores.push("ERROR : La variable "+map(assignId)+" no ha sido declarada.");
    	}
    }
    if (type == "array"){
        var valor2 = ASTtree.ast.start.e;
        var arrayType = ASTtree.ast.start.type.kind;
        var arrayName = ASTtree.ast.start.id.value;
        var result = symbolTable.search(map(arrayName));
    	if (result[0]==false && mode==0){
    		if (ASTtree.ast.start.e.e != null){
    			[tipos,tiposOp,errores] = parseE1(valor2.e,tipos,tiposOp,errores,type);
    			//[tipos,tiposOp,errores] = parseTermino(valor2,tipos,tiposOp,errores,type);
    			if (tipos.includes("array") == false){
    				errores.push("ERROR: El valor asignado al arreglo no es de tipo arreglo.");
    			}
    		}
    		tipos.push(map(arrayType));
    	}  
    	else{
    		errores.push("ERROR: La variable "+map(arrayName)+" ya ha sido declarada.");
    	}
    }
    if (type == "exp"){
    	[tipos,tiposOp,errores] = parseE1(valor,tipos,tiposOp,errores,type);
    }
    return [tipos,tiposOp,errores];
}

export function getASTType(get: [Array<string>,Array<string>,Array<string>], kind : string) : [any,Array<string>] {
	var tipos = new Set(get[0]);
	var tiposOp = new Set(get[1]);
	var errores = get[2];
	var returnT : [any,Array<string>];
	var valid = true;
	if (tipos.has("array") && kind != "array" && kind != "exp"){
		valid = false;
	}
	if (valid == true){
		tipos.delete("array");
		tipos.delete("types");
		tipos.delete("float");
		tipos.delete("int");
		if (errores.length != 0){
			returnT = ["",errores];
		}
		else{
			if (tipos.size>1){
				returnT = ["",["ERROR: Los tipos no coinciden."]];
			}
			else{
				var t = tipos.values();
				if (tiposOp.size > 1){
					returnT = ["",["ERROR: Los tipos de las operaciones no coinciden."]];
				}
				else{
					if (tiposOp.size != 0){
						var m = tiposOp.values();
						var value = t.next().value;
						var value1 = m.next().value;
						if (value == value1){
							returnT = [value,[]];
						}
						else{
							returnT = ["",["ERROR: Los tipos de la operacion y los operandos no coincide."]];
						}
					}
					else{
						returnT = [t.next().value,errores];
					}
				}
			}
		}
	}
	else{
		returnT = ["",["ERROR: El tipo de la variable y su valor no coinciden."]];
	}
	return returnT;
}