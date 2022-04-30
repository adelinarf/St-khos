import { e1,e2,e3,e4,e5,e6,e7,e8,termino, e2_$0 } from "./parser2";
import {HashTable, Symbol} from "./hashtable.js"
import {evaluate} from "./getEvaluation.js"
import {map, mapping} from "./mappingFunctions.js"

/*La funcion mappingTypes retorna una estructura Map que toma un token de un operador y retorna el tipo que debe retornar dicha operacion.*/
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

/*La funcion search se encarga de buscar los hijos a derecha del arbol que estamos generando. Retorna una tupla con los tipos, tipos
de las operaciones, los errores encontrados y si es un arreglo o no.*/
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
En cada funcion parseEi se llama a la funcion parseEi+1 de manera recursiva y se retorna una tupla que contiene los tipos, tipos
de las operaciones, los errores encontrados y si es un arreglo o no.*/

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

/*La funcion parseE8 maneja la regla 8 de la gramatica. Considera los tipos de las variables, las expresiones y las entradas de las 
funciones predefinidas en Stokhos que son llamadas por el usuario.*/
function parseE8(expr : e8, tipos : Array<string>,tiposOp : Array<string>,errores:Array<string>, typeOfInput : string) : [Array<string>,Array<string>,Array<string>,number] {
	var hasLType = 2; //0 para arreglos, 1 para declaraciones y 2 para expresiones, se utiliza al llamar a las funciones predefinidas de Stokhos
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
				var OPTIONS = typeOfInput.split(",");
				if (OPTIONS[0]=="array" && OPTIONS[1]==map(expr.value.value)){
					hasLType = 1;
				}
				else{
					if (obtain[0]!=false){
						var t = obtain[1].type;
						if (expr.a != null){ //Se quiere acceder a una posicion de un arreglo.
							tipos.push(t);
							var valueOfPosition = evaluate(expr.a.next.e as e1);
							var result2 = parseE1(expr.a.next.e as e1,tipos,tiposOp,errores,"assignArrayPos");
							if (result2[0].includes("float")){ //Como es una posicion de un arreglo debe ser un entero
								errores.push("ERROR: La posicion del arreglo "+map(expr.value.value)+" debe ser un numero entero.")
							} //Si la posicion es mas grande que el tamano del arreglo o menor a 0 se registra un error.
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
								hasLType = 1; //Si no es un arreglo pero es una variable
							}
						}
					}
					else{
						errores.push("ERROR: La variable "+map(expr.value.value)+" no esta definida.");
					}
				}
            }
            else{
                var functionName = map(expr.value.value);
                if (expr.b.next!=undefined){ //Si la funcion contiene argumentos se llama a la funcion parseFunction
                	var result3 = parseFunction(expr.b.next, tipos,tiposOp,errores,functionName,typeOfInput);
                	tipos = result3[0];
					tiposOp = result3[1];
					errores = result3[2];
                }
			    else{ //Si la funcion no contiene argumentos se llama a la funcion parseEmptyArgument
			    	var handle = parseEmptyArgument(expr.value.value);
			    	if (handle != ""){
			    		errores.push(handle);
			    	}
			    }
            }
        }
        else{
            if (expr.kind == "TkNumber"){
            	if (typeOfInput == "assignArrayPos"){ //Esta variable se utiliza para las funciones predefinidas de Stokhos que solicitan
            		var val = map(expr.value);        //tipos como float, int y boolean que no forman parte de los tipos basicos de 
            		var int = parseInt(val);          //Stokhos, pero pueden conseguirse por medio de estos pequenos cambios en el codigo.
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

/*La funcion parseEmptyArgument toma el nombre de una funcion introducida por el usuario y verifica si es alguna de las funciones
predefinidas en Stokhos como funciones sin argumentos. Si no lo es, se registra un error.*/
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

/*La funcion parseFunction evalua los argumentos de las funciones predefinidas de Stokhos. Si el nombre de la funcion no esta definido
se registra un error.*/
function parseFunction(expr : termino, tipos:Array<string>,tiposOp:Array<string>,errores:Array<string>,functionName : string, typeOfInput : string) : [Array<string>,Array<string>,Array<string>] {
	if (functionName == "if"){
		if (expr.b!=undefined){
			if (expr.b.length>2 || expr.b.length<2){ //Si la funcion tiene mas de 2 o menos de 2 elementos en este objeto no tiene
				errores.push("ERROR: La funcion if requiere 3 argumentos."); //la cantidad necesaria de argumentos
			}
			else{
				var resultCondition = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			    var resultExp1 = parseE1(expr.b[0].e.e,resultCondition[0],resultCondition[1],resultCondition[2],typeOfInput);
			    var resultExp2 = parseE1(expr.b[1].e.e,resultExp1[0],resultExp1[1],resultExp1[2],typeOfInput);
			    if (resultExp2[3] != 0 || resultExp2[0].length==3){
			    	if (resultExp2[1][0]=="bool"){  //el tipo del primer argumeto debe ser booleano
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
					        else{ //Si hay mas de un elemento en el set entonces no coinciden los tipos de las operaciones
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
	if (functionName == "type"){ //esta funcion solo requiere un argumento y no importa el tipo que tenga, acepta todo tipo de expresiones
		if (expr.e.e!=undefined && expr.b.length == 0){
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
	if (functionName == "ltype"){ //esta funcion solo requiere un argumento y debe ser una variable con cvalue
		if (expr.e.e!=undefined && expr.b.length == 0){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3]; //se verifica que una variable tenga cvalue al evaluar su tipo, existe una variable que verifica
			if (hasLType == 2){       //si es un arreglo o una variable y no unicamente una expresion
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
	if (functionName == "reset"){ //Se verifica que la funcion reset no tiene ningun argumento anadido
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
		if (expr.e.e!=undefined){  //Se verifica que la funcion reset no tiene ningun argumento anadido
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
		if (expr.e.e!=undefined && expr.b.length == 0){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3];
			if (hasLType != 2 && result[0].includes("num")==false){ //si tiene un cvalue pero es de tipo num se puede ingresar
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
		if (expr.e.e!=undefined && expr.b.length == 0){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3];
			if (hasLType != 0){ //Unicamente pueden incluirse variables que tiene hasLType 0 porque son arreglos
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
		if (expr.e.e!=undefined && expr.b.length == 0){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3];
			if (hasLType != 0){ //Solo pueden incluirse arreglos de tipo num
				errores.push("ERROR: La funcion sum requiere un argumento (arreglo de tipo num).");
			}
			else{
				var argument : [Array<string>,Array<string>,Array<string>] = [result[0],result[1],result[2]];
				var obt = getASTType(argument,typeOfInput);
				if (obt[0]!=""){
					if (obt[0]=="num"){
						tipos.push("num");
					}
					else{ //Si en los tipos del arreglo no se encuentran num se guarda un error.
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
		if (expr.e.e!=undefined && expr.b.length == 0){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3];
			if (hasLType != 0){ //Avg solo puede trabajar con arreglos
				errores.push("ERROR: La funcion avg requiere un argumento (arreglo de tipo num).");
			}
			else{
				var argument3 : [Array<string>,Array<string>,Array<string>] = [result[0],result[1],result[2]];
				var obt = getASTType(argument3,typeOfInput);
				if (obt[0]!=""){
					if (obt[0]=="num"){  //Se verifica que los arreglos son de tipo num
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
			if (result[0].length!=0){  //Si hay algun tipo, es que se introdujo un argumento
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
			if (result[0].length!=0){  //Si hay algun tipo, es que se introdujo un argumento
				errores.push("ERROR: La funcion now no requiere argumentos.");
			}
			else{
				tipos.push("num");
			}
		}
	}
	if (functionName == "ln"){
		if (expr.e.e!=undefined && expr.b.length == 0){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3];  //se verifica que si es una variable sea numerica
			if (hasLType != 2 && result[0].includes("num")==false){
				errores.push("ERROR: La funcion ln requiere un argumento de tipo num.");
			}
			else{ //si es solo una expresion numerica se introduce el tipo num
				tipos.push("num");
			}
		}
		else{
			errores.push("ERROR: La funcion ln requiere un argumento.");
		}
	}
	if (functionName == "sqrt"){
		if (expr.e.e!=undefined && expr.b.length == 0){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3]; //se verifica que si es una variable sea numerica
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
		if (expr.e.e!=undefined && expr.b.length == 0){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3]; //se verifica que si es una variable sea numerica
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
		if (expr.e.e!=undefined && expr.b.length == 0){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3];  //se verifica que si es una variable sea numerica
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
		if (expr.e.e!=undefined && expr.b.length == 0){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3];  //se verifica que si es una variable sea numerica
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
		if (expr.e.e!=undefined && expr.b.length == 0){
			var result = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			tipos = result[0];
			tiposOp = result[1];
			errores = result[2];
			var hasLType = result[3];
			if (hasLType != 1){  //Se verifica que la variable tenga un cvalue
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
			if (result[0].length!=0){ //garantiza que si hay algun tipo entonces hay un argumento y no es posible
				errores.push("ERROR: La funcion tick no requiere argumentos.");
			}
			else{
				tipos.push("num");
			}
		}
	}
	if (functionName == "array"){
		if (expr.b!=undefined){
			if (expr.b.length>1 || expr.b.length<1){ //se verifica la cantidad de argumentos
				errores.push("ERROR: La funcion array requiere 2 argumentos.");
			}
			else{
				var size = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			    var hasLType = size[3];
			    if (hasLType != 2 && size[0].includes("num")==false){ //el primer argumento puede ser una variable de tipo num o un numero
			    	errores.push("ERROR: La funcion array requiere un primer argumento de tipo num para el tamaño del arreglo.");
			    }
			    var init = parseE1(expr.b[0].e.e,size[0],size[1],size[2],typeOfInput);
			    if (init[0][0]!="num"){ 
			    	errores.push("ERROR: El primer argumento de la funcion array debe ser de tipo num.");
			    }
			    else{
			    	if (init[0].length!=1){ //el segundo argumento puede ser de tipo num o bool, ya que es un inicializador
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
			if (expr.b.length>4 || expr.b.length<4){ //se verifica la cantidad de argumentos que se introdujeron
				errores.push("ERROR: La funcion histogram requiere 5 argumentos.");
			}
			else{
				var exp = parseE1(expr.e.e,tipos,tiposOp,errores,typeOfInput);
			    var nsamples = parseE1(expr.b[0].e.e,exp[0],exp[1],exp[2],typeOfInput);
			    var nbuckets = parseE1(expr.b[1].e.e,nsamples[0],nsamples[1],nsamples[2],typeOfInput);
			    var lowerBound = parseE1(expr.b[1].e.e,nbuckets[0],nbuckets[1],nbuckets[2],typeOfInput);
			    var upperBound = parseE1(expr.b[1].e.e,lowerBound[0],lowerBound[1],lowerBound[2],typeOfInput);
			    var hasLType = exp[3];
			    if (hasLType != 2 && exp[0].includes("num")==false){ //se verifica que todos los argumentos sean de tipo num
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
	//Si la funcion no forma parte del arreglo predefinedFunctions, entonces no es una funcion predefinida dentro del lenguaje.
	var predefinedFunctions = ["if","type","ltype","reset","uniform","floor","length","sum","avg","pi","now","ln","exp","sin","cos","formula","tick","array","histogram","sqrt"];
	if (predefinedFunctions.indexOf(functionName) <= -1){
		errores.push("ERROR: La funcion "+functionName+" no esta definida en Stokhos.");
	}
    return [tipos,tiposOp,errores];
}

/*La funcion parseArray evalua los tipos de los elementos de un arreglo. Se llama a cada funcion para evaluar los tipos con los obtenidos
anteriormente, por lo que los errores se acumulan dentro del mismo arreglo, al igual que los tipos, los tipos de las operaciones y 
finalmente se agrega a los tipos el string array.*/
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

/*La funcion getType verifica los tipos del AST, dada una tabla de simbolos y un modo. El modo que se introduce como entrada en la 
funcion puede ser 0 si se utiliza para verificar el tipo de la expresion y 1 si unicamente se desea verificar su tipo sin verificar la
tabla de simbolos.
Los tipos de las variables se guardan en un arreglo llamado tipos, los de las operaciones en un arreglos llamado tiposOp y los errores 
encontrados durante la verificacion de tipos se alojan en un arreglo llamado errores.
	DECLARACIONES:
Se verifica el tipo con la funcion parseE1 y si la variable existe o no dentro de la tabla de simbolos. Si ya existe la variable, se 
guarda un error en el arreglo.
	ASIGNACIONES:
Se verifica el tipo con la funcion parseE1 y si la variable existe o no. Si no existe, se guarda un error en el arreglo. Si la asignacion
es de una posicion de un arreglo, se verifica que el tipo del numero de la posicion sea entero, si no lo es se guarda un error.
	ARREGLOS:
Se verifica el tipo con la funcion parseE1 y si la variable existe o no dentro de la tabla de simbolos. Si ya existe la variable, se 
guarda un error en el arreglo. Si el analisis de tipos de parseE1 no retorna un arreglo que contiene el string array entonces no es un 
arreglo y se guarda un error.
	EXPRESIONES (que no son declaraciones, asignaciones o arreglos): 
Se llama a la funcion parseE1 que verifica los tipos.
*/
var symbol : HashTable;

export function getType(ASTtree : any, symbolTable : HashTable, mode : number) : [Array<string>,Array<string>,Array<string>] {
	//El valor de la variable mode es 0 si se esta usando para definir y 1 si se quiere conocer el tipo de la variable para verificar 
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
    		var t = result[1].type;
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
    			[tipos,tiposOp,errores] = parseE1(valor2.e,tipos,tiposOp,errores,type+","+map(arrayName));
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

/*La funcion getASTType toma el resultado obtenido de la funcion getTypes y un tipo y retorna una tupla con el tipo y errores encontrados.
En caso de que haya un error en los tipos, la primera posicion de la tupla es un string vacio, sino es el tipo y los errores se encuentran
vacios.*/
export function getASTType(get: [Array<string>,Array<string>,Array<string>], kind : string) : [any,Array<string>] {
	var tipos = new Set(get[0]);
	var tiposOp = new Set(get[1]);
	var errores = get[2];
	var returnT : [any,Array<string>];
	var valid = true;
	if (tipos.has("array") && kind != "array" && kind != "exp"){
		valid = false; //Se verifica que la definicion del arreglo sea definida con un arreglo del lado derecho 
	}
	if (valid == true){
		tipos.delete("array"); //se eliminan los valores auxiliares: array, types, float e int
		tipos.delete("types");
		tipos.delete("float");
		tipos.delete("int");
		if (errores.length != 0){
			returnT = ["",errores]; //Si hay errores se retornan
		}
		else{
			if (tipos.size>1){
				returnT = ["",["ERROR: Los tipos no coinciden."]]; //Si en el conjunto de tipos hay mas de uno, no coinciden.
			}
			else{
				var t = tipos.values();
				if (tiposOp.size > 1){
					returnT = ["",["ERROR: Los tipos de las operaciones no coinciden."]]; //Si hay varios tipos de operaciones,no coinciden
				}
				else{
					if (tiposOp.size != 0){
						var m = tiposOp.values();
						var value = t.next().value;
						var value1 = m.next().value;
						if (value == value1){
							returnT = [value,[]];
						}
						else{    //Se verifica si el tipo de la operacion y de los operandos coinciden
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
