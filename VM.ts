import { parsing } from "./parsingFunctions.js"
import { validateAndEvaluate, cleanErrors, HashTable, Symbol } from "./validateLibrary.js"

/*La clase VM implementa la maquina virtual de Stokhos que puede manejar el lexer, parser y lectura de archivos del lenguaje.
Se inicializa con los parsers necesarios para utilizar el lexer y parser del lenguaje.*/
export class VM {
  parser = require("./parser.js").parse;
  parser2 = require("./parser2.js").parse;
  symbolTable = new HashTable();
  constructor() {
  	this.parser = require("./parser.js").parse;
  	this.parser2 = require("./parser2.js").parse;
  }
  /*La funcion process es el hilo principal en el que se puede utilizar el lenguaje Stokhos. 
  Realiza el parseo de la entrada con ayuda de la funcion parse y luego verifica si se encuentran funciones predefinidas en
  la entrada de la VM. Si no lo son y la expresion es sintacticamente correcta pasa a validar el AST con ayuda de la funcion 
  validate y la libreria de validadores y evaluadores de Stokhos.
  Si la entrada es una expresion, se llama a la funcion RV y eval y si es una definicion, asignacion o arreglo, se llama a
  la funcion RV y execute.
  Al final de procesar la entrada se eliminan los errores alojados en el arreglo errores de la libreria de validacion.
  */
  process(input : string){
  	var AST = this.parse(input,1);
  	var predef = this.predefinedFunctions(input); //Se verifica si input contiene una funcion predefinida
  	if (AST.ast != undefined && AST.ast != null){
  		var ASTstring = this.validate(AST); //se obtiene el string
  		if (ASTstring[0] != ""){
  			var typeOf = AST.ast.start.kind;
  			if (typeOf == "exp"){
  				this.RV(input,ASTstring[1]);
  				this.eval(input,ASTstring[1]);
  			}
  			if (typeOf == "declaration" || typeOf == "assign" || typeOf == "array"){
  				this.RV(input,ASTstring[1]);
  				this.execute(input,ASTstring[1]);
  			}
  		}
  	}
  	else{
  		var isVar = this.isVariable(input);
  		if (isVar != true && predef != true){
  			console.log("ERROR : '"+input+"' no es parte de la sintaxis de Stokhos.");
  		}
  	}
  	cleanErrors();
  }
  /*La funcion RV toma la entrada y la version en string obtenida de la libreria de validacion y evaluacion*/
  RV(input : string,arr : Array<any>){
  	console.log(input+" =RV=> "+arr[0].toString());
  }
  /*La funcion predefinedFunctions toma la entrada de la VM y analiza diversas expresiones regulares para determinar
  cual de ellas se encuentra dentro del string. Si contiene una de las funciones predefinidas que no son manejadas por
  el parser, se llama a una funcion que analiza la entrada y retorna true, si no la contiene retorna false.*/
	  predefinedFunctions(input : string) : boolean {
		var re = /if\(/gi;
		var re1 = /type\(/gi;
		var re2 = /ltype\(/gi;
		var re3 = /reset\(/gi;
		var re4 = /uniform\(/gi;
		var re5 = /floor\(/gi; //Se agregan los parentesis para prevenir que se tomen variables cuyo nombre comience con alguna
		var re6 = /length\(/gi;//palabra definida para algunas de las funciones.
		var re7 = /sum\(/gi;
		var re8 = /avg\(/gi;
		var re9 = /pi\(/gi;
		var re10= /now\(/gi;
		var output = false;
		if (input.search(re) == 0){
			this.predefinedIf(input);
			output = true;
		}
		if (input.search(re1) == 0){
			this.predefinedType(input);
			output = true;
		}
		if (input.search(re2) == 0){
			this.predefinedLType(input);
			output = true;
		}
		if (input.search(re3) == 0){
			this.predefinedReset();
			output = true;
		}
		if (input.search(re4) == 0){
			this.predefinedUniform();
			output = true;
		}
		if (input.search(re5) == 0){
			this.predefinedFloor(input);
			output = true;
		}
		if (input.search(re6) == 0){
			this.predefinedLength(input,0);
			output = true;
		}
		if (input.search(re7) == 0){
			this.predefinedSum(input,0);
			output = true;
		}
		if (input.search(re8) == 0){
			this.predefinedAvg(input);
			output = true;
		}
		if (input.search(re9) == 0){
			this.predefinedPi();
			output = true;
		}
		if (input.search(re10) == 0){
			this.predefinedNow();
			output = true;
		}
		return output;
	}
	/*La funcion predefinedIf toma la entrada y consigue el valor de las expresiones que se desean analizar. Parsea cada una de las 
	expresiones para conseguir sus tipos y los analiza, al analizar las expresiones expT y expF se incluyen en la tabla de simbolos 
	por lo que se puede verificar directamente con la funcion de validacion, cual es el resultado de la condicion segun los valores que
	se han modificado. Esto se realiza para cada expT y expF y luego se retorna expT si esta es verdadera y expF si no lo es.*/
	predefinedIf(input : string) : boolean {
		var splitted = input.split(",");
		var condition = splitted[0].replace("if(","");
		var expT = splitted[1];
		var expF = splitted[2].substr(0,splitted[2].length-1);
		var AST = this.parse(condition+";",1);
		var res = validateAndEvaluate(AST,this.symbolTable);
		var typeOfCondition = "";
		var output : boolean = false;
		var show = input + " ==> ";
		res[4].forEach(function(value) {
		  typeOfCondition = value;
		});
		if (typeOfCondition != "bool"){
			console.log("La condicion "+condition+" debe ser de tipo bool.");
		}
		else{
			var AST2 = this.parse(expT+";",1);
			var res2 = validateAndEvaluate(AST2,this.symbolTable);
			var typeOfExpT = "";
			res2[4].forEach(function(value) {
			  typeOfExpT = value;
			});
			var AST3 = this.parse(expF+";",1);
			var res3 = validateAndEvaluate(AST3,this.symbolTable);
			var typeOfExpF = "";
			res3[4].forEach(function(value) {
			  typeOfExpF = value;
			});
			var evaluateT = false;
			var evaluateF = false;
			if (typeOfExpF!=typeOfExpT){
				console.log("ERROR: La expresion "+expF+" y "+expT+" deben ser del mismo tipo ("+typeOfExpF+" , "+typeOfExpT+")");
			}
			else{
				var resT = validateAndEvaluate(AST2,this.symbolTable);
				var condResult = validateAndEvaluate(AST,resT[2]);
				if (condResult[3][0]==true){
					evaluateT = true;
				}
				var resF = validateAndEvaluate(AST3,this.symbolTable);
				var condResult2 = validateAndEvaluate(AST,resF[2]);
				if (condResult2[3][0]==true){
					evaluateF = true;
				}
				if (evaluateT == true){
					output = evaluateT;
					show = show + "("+expT +")"+" == "+output.toString();
				}
				else{
					output = evaluateF;
					show = show + "("+expF +")"+" == "+output.toString();
				}
				console.log(show);
			}
		}
		return output;
	}
	/*La funcion predefinedType toma una entrada de la VM y analiza su contenido. En caso de tener "[]" se trata de una posicion 
	de un arreglo y se considera el nombre del arreglo para conseguir el tipo de sus elementos. Si no es un arreglo, se parsea la
	expresion, se analiza con la funcion de validacion y de esta manera se consigue el tipo de la expresion introducida.*/
	predefinedType(input : string) : string {
		input = input.replace(" ","");
		input = input.replace("type(","");
		var evaluate = input.substr(0,input.length-1);
		var re = /\[/gi;
		var re1 = /\]/gi;
		var typeOfInput = "";
		var print = true;
		if (evaluate.search(re) >= 0 && evaluate.search(re1) >= 0){
			//esta llamando a una posicion de un arreglo
			var arrayOf = input.split("[");
			if (arrayOf[0]!=""){
				var p = this.symbolTable.search(arrayOf[0]);
				if (p[0]!=false){
					//existe el arreglo
					var symbol = p[1].array;
					var float = parseFloat(p[1].number);
					var integer = parseInt(p[1].number);
					if (float == integer){
						typeOfInput = "int";
					}
					else{
						typeOfInput = "float";
					}
					//typeOfInput = p[1].type;
				}
				else{
					print = false;
					console.log("ERROR: La variable "+arrayOf[0]+" no existe");
				}
			}
			else{
				var random = Math.floor(Math.random() * (1000000+1));
				var stringAux = arrayOf[1].replace(")","").replace("]","").split(",");
				var ast = this.parse(stringAux[0]+";",1);
				var astA = validateAndEvaluate(ast,this.symbolTable);
				var tipo = "";
				astA[4].forEach(function(value) {
				  tipo = value;
				});
		  	var string = "["+tipo+"] arr___"+random.toString()+":="+evaluate+";";
		  	var AST = this.parse(string,1);
		  	var res = validateAndEvaluate(AST,this.symbolTable);
		  	if (res[0].length > 0){
		  		print = false;
		  		console.log("ERROR: "+res[0][0]);
		  	}
		  	else{
		  		var getSymbol = res[2].search("arr___"+random.toString());
			  	if (getSymbol[0]!= false){
						if (getSymbol[1].array!=undefined){
							if (getSymbol[1].type == "num"){
								var float = parseFloat(getSymbol[1].array[0]);
								var integer = parseInt(getSymbol[1].array[0]);
								if (float == integer){
									typeOfInput = "int";
								}
								else{
									typeOfInput = "float";
								}
							}
							else{
								typeOfInput = "boolean"; //getSymbol[1].type;
							}
						}
					}
				}
			}
		}
		else{
			var AST = this.parse(evaluate+";",1);
			var res = validateAndEvaluate(AST,this.symbolTable);
			var re = /TkId/gi;
			var found = "";
			res[4].forEach(function(value) {
			  found = value;
			});
			var gotten = this.symbolTable.search(evaluate);
			if (gotten[0]!=false){
				if (gotten[1].type == "num"){
					var int = parseInt(gotten[1].number);
					var flt = parseFloat(gotten[1].number);
					if (int == flt){
						typeOfInput = "int";
					}
					else{
						typeOfInput = "float";
					}
				}
				else{
					typeOfInput = "boolean";
				}
			}
			else{
				if (found == "num"){
					var int = parseInt(res[3][0]);
					var flt = parseFloat(res[3][0]);
					if (int == flt){
						typeOfInput = "int";
					}
					else{
						typeOfInput = "float";
					}
				}
				if (found == "bool"){
					typeOfInput = "boolean";
				}
				if (found != "num" && found != "bool"){
					print = false;
					console.log("ERROR: La variable "+evaluate+" no existe");
				}
			}
		}
		if (print == true){
			console.log("type("+input+") ==> "+typeOfInput);
		}
		return typeOfInput;
		}
		/*La funcion predefinedLType toma una entrada de la VM y analiza su contenido para verificar si es un tipo asignable: arreglo,
		definicion de variables. Se verifica si la entrada contiene [], si los contiene se busca el nombre del arreglo en la tabla de 
		simbolos y si existe, se muestra el tipo del arreglo. Si se trata de la posicion de un arreglo, emite un error, ya que, no
		existen los arreglos multidimensionales en el lenguaje.
		Si se trata de una definicion de variable, se busca directamente en la tabla de simbolos, en caso de existir, se imprime su
		tipo considerando que puede ser una variable de tipo num o bool o un arreglo de num o bool.*/
	predefinedLType(input :string) : string {
		input = input.replace(" ","");
		input = input.replace("ltype(","");
		var evaluate = input.substr(0,input.length-1);
		var AST = this.parse(evaluate+";",1);
		//si es asignable es una variable y se encuentra en la tabla de simbolos
		var re = /\[/gi;
		var re1 = /\]/gi;
		var typeOfInput = "";
		var print = true;
		if (evaluate.search(re) >= 0 && evaluate.search(re1) >= 0){
			//esta llamando a una posicion de un arreglo
			var arrayOf = input.split("[");
			if (arrayOf[0]!=""){
				console.log("ERROR: La variable "+evaluate+" no es un asignable.");
				print = false;
		  }
		  else{
		  	var random = Math.floor(Math.random() * (1000000+1));
				var stringAux = arrayOf[1].replace(")","").replace("]","").split(",");
				var ast = this.parse(stringAux[0]+";",1);
				var astA = validateAndEvaluate(ast,this.symbolTable);
				var tipo = "";
				astA[4].forEach(function(value) {
				  tipo = value;
				});
		  	var string = "["+tipo+"] arr___"+random.toString()+":="+evaluate+";";
		  	var AST = this.parse(string,1);
		  	var res = validateAndEvaluate(AST,this.symbolTable);
		  	if (res[0].length > 0){
		  		print = false;
		  		console.log("ERROR: "+res[0][0]);
		  	}
		  	else{
		  		var getSymbol = res[2].search("arr___"+random.toString());
			  	if (getSymbol[0]!= false){
						if (getSymbol[1].array!=undefined){
							typeOfInput = getSymbol[1].type;
						}
					}
				}
			}
		}
		var evaluation1 = this.symbolTable.search(evaluate);
  	var isVar = false;
  	if (evaluation1[0]!=false){
  		typeOfInput = evaluation1[1].type;
  		if (evaluation1[1].array != undefined){
  			typeOfInput = "["+evaluation1[1].type+"]";
  		}
  	}
  	if (evaluate.search(re) < 0 && evaluate.search(re1) < 0 && evaluation1[0]==false){
  		console.log("ERROR: La expresion "+evaluate+" no tiene LVALUE");
  		print = false;
  	}
  	if (print == true){
  		console.log("ltype("+input+") ==> "+typeOfInput);
  	}
	  return typeOfInput;
		}
		/*La funcion predefinedReset elimina todas las variables que se encuentran en la tabla de simbolos, inicializando nuevamente
		la tabla de hash en la que se alojan.*/
	predefinedReset() : boolean {
		this.symbolTable = new HashTable();
		return true;
	}
	/*La funcion predefinedUniform retorna un numero aleatorio entre 0 y 1, este numero debe ser entero, por lo que, se utiliza la 
	funcion floor para tomar unicamente los enteros, ya que, la funcion random retorna el tipo float.*/
	predefinedUniform() : number {
		//aleatorio entre 0 y 1
		var rad = (Math.random() * (2));
		console.log(Math.floor(rad));
		return Math.floor(rad);
	}
	/*La funcion predefinedFloor retorna el mayor numero entero n tal que n<=x con x siendo el numero que se introduce por medio
	de la entrada en la VM. Se parsea la expresion y luego se llama a la funcion de validacion para conseguir su tipo, en caso de
	ser de tipo num, se puede conseguir floor(x), pero si no lo es, no es posible realizar la operacion.
	Se verifica si la entrada es de tipo numerico, pudiendo ser un numero, una variable de tipo num o una posicion de un arreglo
	de tipo num.
	*/
	predefinedFloor(input : string) : number {
		input = input.replace(" ","");
		input = input.replace("floor(","");
		var value = input.substr(0,input.length-1);
		var re = /\[/gi;
		var re1 = /\]/gi;
		var out = 0;
		if (value.search(re) >= 0 && value.search(re1) >= 0){
			var arrayOf = value.split("[");
			if (arrayOf[0]==""){
				console.log("ERROR: La entrada "+value+" no es de tipo num.");
		  }
		  else{
		  	var pos = parseInt(arrayOf[1].replace("]","").replace(")",""));
		  	var getSymbol = this.symbolTable.search(arrayOf[0]);
		  	if (getSymbol[0]!= false){
					if (getSymbol[1].array!=undefined && getSymbol[1].type == "num"){
						out = Math.floor(parseFloat(getSymbol[1].array[pos]));
						console.log(out);
					}
				}
				else{
					console.log("ERROR: La variable "+value+" no existe en la tabla de simbolos.");
				}
			}
		}
		else{
			var AST = this.parse(value+";",1);
			if (AST.ast != null && AST.ast != undefined){
				var res = validateAndEvaluate(AST,this.symbolTable);
				var evaluation = res[3];
				var typeOf = "";
				res[4].forEach(function(value) {
					  typeOf = value;
					});
				if (typeOf == "num"){
					var getSearch = this.symbolTable.search(value);
			  	var isArray = false;
			  	if (getSearch[0]!=false){
			  		if (getSearch[1].array != undefined){
			  			isArray = true;
			  		}
			  	}
			  	if (isArray == true){
			  		console.log("ERROR: La variable "+value+" es un arreglo, no un numero de tipo num.");
			  	}
			  	else{
			  		out = Math.floor(parseFloat(evaluation[0]));
			  		console.log(out);
			  	}
				}
				else{
					console.log("ERROR: La entrada "+value+" no es de tipo num.");
				}
			}
			else{
				console.log("ERROR: La expresion "+value+" no esta definida en la sintaxis de Stokhos.");
			}
		}
		return out;
	}
	/*La funcion predefinedLength retorna el tamano de un arreglo que se introduce desde la VM. Se verifica si el nombre del arreglo
	se encuentra en la tabla de simbolos, si se encuentra la variable y es un arreglo, se retorna su tamano, si no esta se muestra
	un mensaje de error. Se verifica que la entrada sea un arreglo o el nombre de una variable que representa a un arreglo.
	Si contiene [] se trata de un arreglo introducido directamente, por lo que se incluye en la tabla de simbolos
	con un nombre de arreglo random, luego se parsea este string y se consiguen sus valores, buscando directamente en la tabla de 
	simbolos e iterando sobre el arreglo guardado dentro de ella.
	Si no contiene [], se trata de una variable que representa un arreglo, solo se debe buscar en la tabla de simbolos y sumar los
	valores del arreglo guardados dentro de esta estructura.*/
	predefinedLength(input : string, val : number) : number {
		input = input.replace(" ","");
		input = input.replace("length(","");
		var value = input.substr(0,input.length-1);
		value = value.replace(" ","");
		var get : [boolean,Symbol] = this.symbolTable.search(value);
		var size = 0;
		var re = /\[/gi;
		var re1 = /\]/gi;
		var typeOfInput = "";
		if (value.search(re) >= 0 && value.search(re1) >= 0){
			//es un arreglo
			var re2 = /\[num\]/gi;
		  var re3 = /\[bool\]/gi;
		  if (value.search(re2) < 0 && value.search(re3) < 0){
		  	var random = Math.floor(Math.random() * (1000000+1));
		  	var string = "[num] arr___"+random.toString()+":="+value+";";
		  	var AST = this.parse(string,1);
		  	var res = validateAndEvaluate(AST,this.symbolTable);
		  	if (res[0].length > 0){
		  		if (val == 0){
		  			console.log("ERROR: "+res[0][0]);
		  		}
		  		size = -1;
		  	}
		  	else{
		  		var getSymbol = res[2].search("arr___"+random.toString());
			  	if (getSymbol[0]!= false){
						if (getSymbol[1].array!=undefined){
							size = getSymbol[1].array.length;
							if (val == 0){
								console.log(size);
							}
						}
						else{
							if (val == 0){
								console.log("ERROR: La variable "+value+" no es un arreglo");
							}
							size = -1;
						}
					}
		  	}			  	
		  }
			if (get[1].type == "" && value.search(re) < 0 && value.search(re1) < 0){
				if (val == 0){
					console.log("ERROR: La expresion "+value+" no es una variable, ni un arreglo");
				}
				size = -1;
			}
			if (get[1].type != "" && value.search(re) < 0 && value.search(re1) < 0){
				if (val == 0){
					console.log("ERROR: La expresion "+value+" no puede sumarse con la funcion sum.");
				}
				size = -1;
			}
		}
		else{
			if (get[0]!= false){
				if (get[1].array!=undefined){
					size = get[1].array.length;
					if (val == 0){
						console.log(size);
					}
				}
				else{
					if (val == 0){
						console.log("ERROR: La variable "+value+" no es un arreglo");
					}
					size = -1;
				}
			}
		}
		return size;
	}
	/*La funcion predefinedSum retorna la suma de los elementos de un arreglo que se introduce desde la VM. Se verifica si
	el valor introducido es una variable que representa un arreglo o se trata de un arreglo introducido directamente en la entrada
	de la funcion sum. Si contiene [] se trata de un arreglo introducido directamente, por lo que se incluye en la tabla de simbolos
	con un nombre de arreglo random, luego se parsea este string y se consiguen sus valores, buscando directamente en la tabla de 
	simbolos e iterando sobre el arreglo guardado dentro de ella.
	Si no contiene [], se trata de una variable que representa un arreglo, solo se debe buscar en la tabla de simbolos y sumar los
	valores del arreglo guardados dentro de esta estructura.*/
	predefinedSum(input : string, val : number) : number {
		input = input.replace(" ","");
		input = input.replace("sum(","");
		var value = input.substr(0,input.length-1);
		value = value.replace(" ","");
		var get : [boolean,Symbol] = this.symbolTable.search(value);
		var sum = 0;
		if (get[1].type != "num"){
			var re = /\[/gi;
			var re1 = /\]/gi;
			var typeOfInput = "";
			if (value.search(re) >= 0 && value.search(re1) >= 0){
				//es un arreglo
				var re2 = /\[num\]/gi;
			  var re3 = /\[bool\]/gi;
			  if (value.search(re2) < 0 && value.search(re3) < 0){
			  	var random = Math.floor(Math.random() * (1000000+1));
			  	var string = "[num] arr___"+random.toString()+":="+value+";";
			  	var AST = this.parse(string,1);
			  	var res = validateAndEvaluate(AST,this.symbolTable);
			  	if (res[0].length > 0){
			  		if (val == 0){
			  			console.log("ERROR: "+res[0][0]);
			  		}
			  		sum = -1;
			  	}
			  	else{
			  		var getSymbol = res[2].search("arr___"+random.toString());
				  	if (getSymbol[0]!= false){
							if (getSymbol[1].array!=undefined){
								for (var i = 0; i < getSymbol[1].array.length; i++) {
									sum = sum + parseFloat(getSymbol[1].array[i]);
								}
								if (val == 0){
									console.log(sum);
								}
							}
							else{
								if (val == 0){
									console.log("ERROR: La variable "+value+" no es un arreglo");
								}
								sum = -1;
							}
						}
			  	}			  	
			  }
			}
			if (get[1].type == "" && value.search(re) < 0 && value.search(re1) < 0){
				if (val == 0){
					console.log("ERROR: La expresion "+value+" no es una variable, ni un arreglo");
				}
				sum = -1;
			}
			if (get[1].type != "" && value.search(re) < 0 && value.search(re1) < 0){
				if (val == 0){
					console.log("ERROR: La expresion "+value+" no puede sumarse con la funcion sum.");
				}
				sum = -1;
			}
		}
		else{
			if (get[0]!= false){
				if (get[1].array!=undefined){
					for (var i = 0; i < get[1].array.length; i++) {
						sum = sum + parseFloat(get[1].array[i]);
					}
					if (val == 0){
						console.log(sum);
					}
				}
				else{
					if (val == 0){
						console.log("ERROR: La variable "+value+" no es un arreglo");
					}
					sum = -1;
				}
			}
		}
		return sum;
	}
	/*La funcion predefinedAvg toma un arreglo por medio de la VM y retorna el valor promedio del arreglo. Esta funcion llama a
	las funciones predefinedSum y predefinedLength para analizar la suma de los elementos del arreglo y su tamano.*/
	predefinedAvg(input : string) : number {
		input = input.replace(" ","");
		input = input.replace("avg(","");
		var value = input.substr(0,input.length-1);
		var sum = this.predefinedSum("sum("+value+")",1);
		var length = this.predefinedLength("length("+value+")",1);
		if (sum != -1 && length != -1){
			console.log(sum / length);
		}
		else{
			console.log("ERROR: "+value+" no es un arreglo o es un arreglo de tipo distinto a num.");
		}
		return sum / length;
	}
	/*La funcion predefinedPi retorna una aproximacion a la constante Pi con doble precision.*/
	predefinedPi() : number {
		var pi = Math.asin(1)*2;
		console.log(pi);
		return pi;
	}
	/*La funcion predefinedNow retorna un número entero correspondiente al número de milisegundos transcurridos 
	desde un punto de referencia en el tiempo.*/
	predefinedNow() : number {
		var currentTimeInSeconds=Math.floor(Date.now()/1000);
		console.log(currentTimeInSeconds);
		return currentTimeInSeconds;
	}
	/*La funcion isVariable determina si la entrada de la VM es una variable o no, si lo es, muestra su valor en el REPL, si no retorna
	falso*/
  isVariable(input : string) : boolean {
  	var res = this.symbolTable.search(input);
  	var isVar = false;
  	if (res[0]!=false){
  		var val = res[1].value;
  		if (res[1].array != undefined){
  			console.log("OK: "+input+" ==> "+res[1].array);
  		}
  		else{
  			console.log("OK: "+input+" ==> "+res[1].number);
  		}
  		isVar = true;
  	}
  	return isVar;
  }
  /*La funcion validate llama a la funcion de validacion y evaluacion para verificar si se han detectado errores al momento de verificar
  los tipos de las expresiones. Si no hay errores, se retorna una tupla con la expresion en forma de string y la evaluacion de la
  expresion gracias al algoritmo de evaluacion dentro del arbol.
  Si hay errores se retorna un string vacio y la evaluacion de la expresion.*/
  validate(AST : any) : [string,Array<any>] {
  	//funcion que llama a los validadores de la libreria
  	var get = validateAndEvaluate(AST,this.symbolTable);
  	this.symbolTable = get[2]; //tabla de simbolos
  	var resultado = get[3]; //evaluacion
  	if (get[0].length == 0){
  		return [get[1],resultado];
  	}
  	else{
  		console.log("ERROR: "+get[0][0]);
  	}
  	return ["",resultado];
  }
  /*La funcion execute se encarga de ejecutar las declaraciones y asignaciones de variables o arreglos.*/
  execute(input : string,arr : Array<any>){
  	console.log("ACK: "+input);
  }
  /*La funcion eval se encarga de evaluar una expresion dada y muestra el valor obtenido en el REPL.*/
  eval(input : string,arr : Array<any>){
  	console.log("OK : "+input+" ==> "+arr[0].toString());
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
  	this.parse(entrada,0);
  }
  /*La funcion parse recibe una entrada desde el REPL y llama a la funcion del lexer que otorga los tokens, luego se realiza un nuevo
  parseo de estos tokens y llama a la funcion ast2str que imprime el AST como string.*/
  parse(entrada : string,val : number) : any {
  	var tokens : Array<string> = this.lextest(entrada,2);
  	tokens[tokens.length-1] = tokens[tokens.length-1].concat(" ");
  	var entradaModificada = tokens.join(" ");
  	var parseo = this.parser2(entradaModificada);
  	if (val == 0){
  		try{
	  		this.ast2str(parseo,entrada,val);
	  	}
	  	catch(parseo){
	  		if (parseo.ast == null){
	  			console.log("ERROR : '"+entrada+"' no es parte de la sintaxis de Stokhos.");
	  		}
	  	}
  	}
  	return parseo;
  }
  /*La funcion ast2str toma el AST y la entrada del REPL, luego llama a la funcion parsing, que retorna un arreglo de strings con el 
  orden inorder del arbol y luego se mapea este arreglo con una estructura map que pasa los tokens a valores reales del lenguaje y
  finalmente con getString se retorna un string basado en el arreglo de strings que puede ser mostrado en consola.*/
  ast2str(AST : any,input : string, val : number){
  	var stringToShow = parsing(AST);
  	if (val == 0){
  		console.log("'"+input+"'"+"=parse=> [[AST]] =ast2str => '"+stringToShow+"'");
  	}
  }
}