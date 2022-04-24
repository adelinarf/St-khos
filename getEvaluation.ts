import { e1,e2,e3,e4,e5,e6,e7,e8, exp, termino, e2_$0 , ASTKinds } from "./parser2";
import {HashTable, Symbol} from "./hashtable.js"
import { getType , getASTType} from "./getTypes.js"
import {stringOfE1 , getString, stringOfArray} from "./getString.js"
import {map, mapping} from "./mappingFunctions.js"

/*La funcion search se encarga de buscar los hijos a derecha del arbol que estamos generando. Se alojan los resultados de las evaluaciones
en un arreglo llamado string que retorna la funcion.*/
function search(array : Array<any>,nombre : Function) : Array<any> {
	var string = [];
    if (array != undefined && array.length>0){
        for (var i = 0; i < array.length; i++) {
            var entrada = array[i].next;
            string.push(array[i].op.kind);
            string.push(nombre(entrada));
        }
    }
    return string;
}

/*La funcion operateBinary se encarga de operar el operando izquierdo con un operador binario que se encuentra en el arreglo de entrada
operations.*/
function operateBinary(leftOp : any, operations : Array<any>) : any {
	var left = leftOp;
  	var operators = ["TkMult","TkDiv","TkPower","TkMod","TkPlus","TkMinus","TkAnd","TkOr","TkEQ","TkNE","TkLT","TkLE","TkGE","TkGT"];
	for (var i = 0; i < operations.length-1; i++) {
		if (operations[i]=="TkPlus"){
			left = left + operations[i+1];
		}
		if (operations[i]=="TkMinus"){
			left = left - operations[i+1];
		}
		if (operations[i]=="TkMod"){
			left = left % operations[i+1];
		}
		if (operations[i]=="TkLE"){
			left = left <= operations[i+1];
		}
		if (operations[i]=="TkNE"){
			left = left != operations[i+1];
		}
		if (operations[i]=="TkLT"){
			left = left < operations[i+1];
		}
		if (operations[i]=="TkGT"){
			left = left > operations[i+1];
		}
		if (operations[i]=="TkGE"){
			left = left >= operations[i+1];
		}
		if (operations[i]=="TkEQ"){
			left = left == operations[i+1];
		}
		if (operations[i]=="TkOr"){
			left = left || operations[i+1];
		}
		if (operations[i]=="TkAnd"){
			left = left && operations[i+1];
		}
		if (operations[i]=="TkPower"){
			left = Math.pow(left,operations[i+1]);
		}
		if (operations[i]=="TkDiv"){
			left = left / operations[i+1];
		}
		if (operations[i]=="TkMult"){
			left = left * operations[i+1];
		}
		if (operators.indexOf(operations[i]) <= -1){
			continue;
		}
	}
	return left;
}


/*La funciones parseEi se encargan de visitar los nodos del arbol AST generados por el parser. Ademas se generan nodos en cada
una de las funciones. Se llama a la funcion search que se encarga de visitar el atributo a que contiene los hijos de la operacion
en el arbol, por lo que si es undefined, no contiene hijos y esa regla en particular no ha sido aplicada.
En cada funcion parseEi se llama a la funcion parseEi+1 de manera recursiva y se retornan los resultados de las evaluaciones
para que puedan realizarse las operaciones dependiendo de su precedencia.*/

/*La funcion parseE1 maneja la regla 1 de la gramatica.*/
function parseE1(expr : e1) : any {
	var leftVar : any = parseE2(expr.e);
	var now : Array<any> = search(expr.a,parseE2);
    var salida : any;
	if (now.length != 0){
		salida = operateBinary(leftVar,now);
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE2 maneja la regla 2 de la gramatica.*/
function parseE2(expr : e2) : any {
	var leftVar : any = parseE3(expr.e);
	var now : Array<any> = search(expr.a,parseE3);
    var salida : any;
	if (now.length != 0){
		salida = operateBinary(leftVar,now);
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE3 maneja la regla 3 de la gramatica.*/
function parseE3(expr : e3) : any {
	var leftVar : any = parseE4(expr.e);
	var now : Array<any> = search(expr.a,parseE4);
    var salida : any;
	if (now.length != 0){
		salida = operateBinary(leftVar,now);
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE4 maneja la regla 4 de la gramatica.*/
function parseE4(expr : e4) : any {
	var leftVar : any = parseE5(expr.e);
	var now : Array<any> = search(expr.a,parseE5);
    var salida : any;
	if (now.length != 0){
		salida = operateBinary(leftVar,now);
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE5 maneja la regla 5 de la gramatica.*/
function parseE5(expr : e5) : any {
	var leftVar : any = parseE6(expr.e);
	var now : Array<any> = search(expr.a,parseE6);
    var salida : any;
	if (now.length != 0){
		salida = operateBinary(leftVar,now);
	}
	else{
		salida = leftVar;
	}
    return salida;
}
/*La funcion operateUnary opera el operando izquierdo con las operaciones unarias requeridas.*/
function operateUnary(leftOp : any , operations : Array<any>) : any {
	var left = leftOp;
  	var operators = ["TkPlus","TkMinus","TkNot"];
	for (var i = 0; i <= operations.length-1; i++) {
		if (operations[i]=="TkPlus"){
			left = + left;
		}
		if (operations[i]=="TkMinus"){
			left = - left;
		}
		if (operations[i]=="TkNot"){
			left = ! left;
		}
		if (operators.indexOf(operations[i]) <= -1){
			continue;
		}
	}
	return left;
}

/*La funcion parseE6 maneja la regla 6 de la gramatica. Esta regla considera unicamente los operadores unarios, por lo que no se
hace un llamado a la funcion search, ya que, no existe este atributo.*/
function parseE6(expr : e6) : any {
	var leftVar : any = parseE7(expr.e);
	var operations = [];
    if (expr.uop != undefined && expr.uop.length > 0){
    	operations.push(expr.uop[0].kind);
        for (var i = 1; i < expr.uop.length; i++) {
    	    operations.push(expr.uop[i].kind);
        }
    }
    var salida : any;
	if (operations.length != 0){
		salida = operateUnary(leftVar,operations); //Se realizan las operaciones de unarios en caso de existir
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE7 maneja la regla 7 de la gramatica*/
function parseE7(expr : e7) : any {
	var leftVar = parseE8(expr.e);
	var now : Array<any> = search(expr.a,parseE8);
	var salida : any;
	if (now.length != 0){
		salida = operateBinary(leftVar,now);
	}
	else{
		salida = leftVar;
	}
    return salida;
}

/*La funcion parseE8 maneja la regla 8 de la gramatica. Es la ultima de las reglas y por esto, se encarga de manejar las llamadas a 
variables y las busquedas de valores dentro de la tabla de simbolos en caso de ser necesario.*/
function parseE8(expr : e8) : any {
	var salida : any;
	if (expr.kind == "e8_1" || expr.kind == "e8_3"){ 
        salida = parseE1(expr.value.e as e1);
    }
    if (expr.kind == "e8_4"){
    	salida = parseE1(expr.value.e as e1);
    }
    if (expr.kind == "e8_2"){ //esta salida es la de un arreglo
    	salida = parseArray(expr.value);
    }
    if (expr.kind != "e8_1" && expr.kind != "e8_2" && expr.kind != "e8_3" && expr.kind != "e8_4"){
    	if (expr.kind == "terms_3"){
            if (expr.a != undefined){ //esta salida es la posicion del arreglo
            	salida = parseE1(expr.a.next.e as e1);
                var getSearch = symbol.search(map(expr.value.value));
                if (getSearch[0]!=false){
                	if (computedCyles != getSearch[1].cycle){ //Si el ciclo de computo actual es diferente al de la variable
        				var f = getSearch[1].AST.ast.start.e.e.e.e.e.e.e.e.e;
                		var pos = salida;
                		if (salida == 0 && f.value.e.e.e.e.e.e.e.e.e.kind == "e8_4"){
                			salida = parseE1(f.value.e.e);
                		}
                		if (salida != 0 && f.value.b[salida-1].e.e.e.e.e.e.e.e.e.kind == "e8_4"){
                			salida = parseE1(f.value.b[salida-1].e.e);
                		}
                		else{ //Se actualiza unicamente si tiene comillas simples, si no se busca el valor rvalue guardado.
                			salida = getSearch[1].array[salida];
                		}
                		getSearch[1].array[pos] = salida; 
    					getSearch[1].arrayCycle[pos] = computedCyles;
				  	}
				  	else{
				  		salida = getSearch[1].array[salida];
				  	}
                }
            }
            if (expr.b != undefined){ //esta salida es la de las funciones
            	if (expr.b.next!=undefined){
            		salida = parseFunctionWithArguments(expr.b.next,map(expr.value.value));
            	}
            	else{
            		salida = parseFunctionEmptyArguments(map(expr.value.value));
            	}
            }
            if (expr.a == undefined && expr.b == undefined){ //esta salida es el valor de la variable
            	salida = map(expr.value.value);
            	var getV = symbol.search(map(expr.value.value));
            	if (getV[0]!=false){
            		var t = getV[1].AST.ast.start.kind;
            		if (t == "declaration" || t == "assign"){ //Si el ciclo de computo actual es diferente al de la variable
            			if (computedCyles != getV[1].cycle && getV[1].AST.ast.start.e.e.e.e.e.e.e.e.e.kind == "e8_4"){  
					  		salida = parseE1(getV[1].AST.ast.start.e.e); //Y la variable tiene comillas simples se actualiza
        					getV[1].value = salida;
        					getV[1].cycle = computedCyles;
					  	}
					  	else{
					  		salida = getV[1].value; //Si no tiene comillas simples, se toma su rvalue alojado en la tabla de simbolos.
					  	}
            		}
            		if (t == "array"){
            			if (computedCyles != getV[1].cycle){  //Si el ciclo de computo actual es diferente al de la variable, se evalua
					  		salida = parseE1(getV[1].AST.ast.start.e.e);
            				getV[1].array = salida;
        					getV[1].cycle = computedCyles;
					  	}
					  	else{
					  		salida = getV[1].array;
					  	}
            		}
            	}
            }
        }
        else{
        	if (expr.kind == "TkNumber"){
            	salida = parseFloat(map(expr.value));
            }
            if (expr.kind == "TkFalse" || expr.kind == "TkTrue"){
            	salida = map(expr.value);
            }
        }
    }
    return salida;
}
/*La funcion parseFunctionWithArguments llama a las funciones que requieren argumentos y retorna los valores resultantes.*/
function parseFunctionWithArguments(expr : termino, name : string) : any {
	var salida : any;
	if (name == "if"){
		salida = ifFun(expr);
	}
	if (name == "type"){
		salida = typeFun(expr);
	}
	if (name == "ltype"){
		salida = ltypeFun(expr);
	}
	if (name == "floor"){
		salida = floorFun(expr);
	}
	if (name == "length"){
		salida = lengthFun(expr);
	}
	if (name == "sum"){
		salida = sumFun(expr);
	}
	if (name == "avg"){
		salida = avgFun(expr);
	}
	if (name == "ln"){
		salida = lnFun(expr);
	}
	if (name == "exp"){
		salida = expFun(expr);
	}
	if (name == "sin"){
		salida = sinFun(expr);
	}
	if (name == "cos"){
		salida = cosFun(expr);
	}
	if (name == "formula"){
		salida = formulaFun(expr);
	}
	if (name == "array"){
		salida = arrayFun(expr);
	}
	if (name == "histogram"){
		salida = histogramFun(expr);
	}
	if (name == "sqrt"){
		salida = sqrtFun(expr);
	}
	return salida;
}
/*La funcion parseFunctionEmptyArguments llama a las funciones que no requieren argumentos y retorna los valores resultantes.*/
function parseFunctionEmptyArguments(name : string) : any {
	var salida : any;
	if (name == "reset"){
		salida = resetFun();
	}
	if (name == "uniform"){
		salida = uniformFun();
	}
	if (name == "pi"){
		salida = piFun();
	}
	if (name == "now"){
		salida = nowFun();
	}
	if (name == "tick"){
		salida = tickFun();
	}
	return salida;
}

/*La funcion tick aumenta el ciclo de computo de la VM.*/
function tickFun() : number {
	computedCyles += 1;
	return computedCyles;
}
/*La funcion ln retorna el logaritmo natural de una expresion.*/
function lnFun(expr : termino) : number {
	var f = parseE1(expr.e.e);
	return Math.log(f);
}
/*La funcion sqrt retorna la raiz cuadrada de una expresion.*/
function sqrtFun(expr : termino) : number{
	var f = parseE1(expr.e.e);
	return Math.sqrt(f);
}
/*La funcion exp retorna el valor de la constante e elevada a una expresion.*/
function expFun(expr : termino) : number {
	var f = parseE1(expr.e.e);
	var e = Math.E;
	return Math.pow(e,f);
}
/*La funcion sin retorna el seno de una expresion.*/
function sinFun(expr : termino) : number {
	var f = parseE1(expr.e.e);
	return Math.sin(f);
}
/*La funcion cos retorna el coseno de una expresion.*/
function cosFun(expr : termino) : number {
	var f = parseE1(expr.e.e);
	return Math.cos(f);
}
/*La funcion formula retorna el cvalue de una expresion.*/
function formulaFun(expr : termino) : any {
	var f = stringOfE1(expr.e.e);
	var out : string;
	var openbracket = /\[/gi;
	var closebracket = /\]/gi;
	if (f.search(openbracket) != -1 && f.search(closebracket) != -1){
		var separated = f.split("[");
		var search = symbol.search(separated[0]);
		var pos = parseFloat(separated[1].replace("]",""));
		if (search[0]!=false){
			var termino = search[1].AST.ast.start.e;
			if (pos==0){ //en caso de que sea una posicion de un arreglo se utiliza la funcion stringOfE1 para encontrar su valor
				var ast = search[1].AST.ast.start.e.e.e.e.e.e.e.e.e.value.e.e;
				out = stringOfE1(ast);
			}
			else{
				var ast = search[1].AST.ast.start.e.e.e.e.e.e.e.e.e.value.b[pos-1].e.e;
				out = stringOfE1(ast);
			}
		}
	}
	else{
		var search = symbol.search(f);
		if (search[0]!=false){
			var ast = search[1].AST;
			out = getString(ast,2);
		}
	}
	return out;
}
/*La funcion arrayFun genera un arreglo nuevo a partir de la evaluacion de la entrada init y retorna este arreglo seguido de 
un objeto del AST y el string "arrayFun".*/
function arrayFun(expr : termino) : Array<any> {
	var size = parseE1(expr.e.e);
	var newArray = [];
	for (var i = 0; i < size; i++) {
		newArray.push(parseE1(expr.b[0].e.e));
	}
	newArray.push(expr.b[0].e.e,"arrayFun");
	return newArray;
}

/*La funcion histogram toma una expresion y la evalua por nsamples veces para luego generar un arreglo que se divide en nbuckets +2
donde se registra la frecuencia de cada uno de los valores dentro de los rangos de cada bucket del arreglo. Luego, se genera parte
de un AST que luego se unira al AST que llama a la funcion y se imprime en la consola el histograma que genera el arreglo de tamano
nbuckets+2.*/
function histogramFun(expr : termino) : Array<any> {
	var nsamples = parseE1(expr.b[0].e.e);
	var nbuckets = parseE1(expr.b[1].e.e);
	var lowerBound = parseE1(expr.b[2].e.e);
	var upperBound = parseE1(expr.b[3].e.e);
	var count = 0;
	var results = [...Array(nbuckets+2)].map(x => 0);
	var values = [...Array(nbuckets+2)].map(x => 0);
	while (count < nsamples){
		var exp = parseE1(expr.e.e);
		if (exp <= lowerBound){
			results[0]+=1;
			values.push(exp);
		}
		if (exp >= upperBound){
			results[results.length-1] += 1;
			values.push(exp); 
		}
		if (exp > lowerBound && exp < upperBound){
			results[positionInResults(lowerBound,upperBound,nbuckets,exp)] += 1; //la posicion en results depende del valor, cantidad
			values.push(exp);                                                    //de buckets y los rangos introducidos por el usuario
		}
		count += 1;
		tickFun();
	}
	var spaces : string = (results.length).toString();
	var space : number = spaces.length;
	var sumOfResult = results.reduce((acc, cur) => acc + cur, 0);
	for (var i = 0; i<results.length;i++){
		var bars : string = getBars(percentageOfBars(results[i],sumOfResult)); //se busca el numero de barras que tendra este valor
		var numberStr : string = i.toString();
		var digitQuantity : number = numberStr.length; //Esta variable garantiza que todas las barras comiencen en la misma linea visual
		console.log(getSpaces(space-digitQuantity)+i.toString() + "  "+bars);
	}
	var pos0 : exp = object(results[0]);
	var b = [];
	var e8 : e8 = {kind : ASTKinds.e8_2 , value : {kind : ASTKinds.termino, e : pos0, b : []}};
	for (var x = 1; x<results.length;x++){
		e8.value.b.push({kind : ASTKinds.termino_$0, e : object(results[x])});
	}
	var output : Array<any> = [];
	output = output.concat(results);
	output.push(e8,"histogram");
	return output;
}
/*La funcion percentageOfBars calcula el porcentaje de barras que se deben agregar si el maximo que puede haber es 74.*/
function percentageOfBars(value : number, sum : number) : number {
	var quantityOfBars = (value*74)/sum;
	return quantityOfBars;
}
/*La funcion positionInResults toma el valor del rango, la cantidad de bucket y un valor calculado y retorna la posicion dentro
del histograma en el que este valor debe sumarse.*/
function positionInResults(lB : number, uB : number, nBuckets: number, value : number) : number {
	var quantity = uB - lB;
	var sizeOfBuckets = quantity/nBuckets;
	var pos = (value + Math.abs(lB))/sizeOfBuckets;
	return Math.ceil(pos);
}
/*La funcion object crea un objeto que representa a cada una de las posiciones del arreglo de histogram.*/
function object(val : number) : exp {
	var e8 : e8 = {kind : ASTKinds.TkNumber , value : "TkNumber("+val.toString()+") "};
	var e7 : e7 = {kind : ASTKinds.e7 , e : e8 , a: []};
	var e6 : e6 = {kind : ASTKinds.e6 , e : e7 ,uop : []};
	var e5 : e5 = {kind : ASTKinds.e5 , e : e6 , a: []};
	var e4 : e4 = {kind : ASTKinds.e4 , e : e5 , a: []};
	var e3 : e3 = {kind : ASTKinds.e3 , e : e4 , a: []};
	var e2 : e2 = {kind : ASTKinds.e2 , e : e3 , a: []};
	var e1 : e1 = {kind : ASTKinds.e1 , e : e2 , a: []};
	var exp : exp = {kind : ASTKinds.exp, e: e1 };
	return exp;
}
/*La funcion getSpaces repite un espacio en blanco val veces segun la entrada requerida.*/
function getSpaces(val : number) : string {
	var space = " ";
	return space.repeat(val);
}
/*La funcion getBars repite una barra val veces segun la entrada requerida.*/
function getBars(val : number) : string {
	var bar = "\u25A0";
	return bar.repeat(val);
}

/*La funcion if retorna la segunda entrada si la condicion se cumple, si no se cumple retorna la tercera entrada.*/
function ifFun(expr : termino) : any {
	var resultCondition = parseE1(expr.e.e);
    if (resultCondition == true){
    	return parseE1(expr.b[0].e.e); //se evalua la segunda entrada de la funcion
    }
    else{
    	return parseE1(expr.b[1].e.e); //se evalua la tercera entrada de la funcion
    }
}

/*La funcion typeFun retorna el tipo de cualquier expresion que sea introducida. Hace uso de las funciones getTypeOfArray y
getTypeOfExpression para conseguir cada uno de los tipos.*/
function typeFun(expr : termino) : string {
	var output : string;
	var resultOfEvaluating = parseE1(expr.e.e);
	if (Array.isArray(resultOfEvaluating)){
		output = getTypeOfArray(resultOfEvaluating);
		//revisar el tipo de cada variable del arreglo
	}
	else{
		output = getTypeOfExpression(resultOfEvaluating);
		//revisar el tipo y ver si es o no float,int o boolean
	}
	return output;
}

/*La funcion getTypeOfArray retorna el tipo de un arreglo, evaluando cada uno de los elementos de este arreglo y luego crea un
conjunto para verificar los tipos que se repiten y retornar el tipo del arreglo de acuerdo a estos resultados.*/
function getTypeOfArray(resultOfEvaluating : Array<any>) : string {
	var types = [];
	var output = "";
	for (var i = 0; i < resultOfEvaluating.length; i++) {
		types.push(getTypeOfExpression(resultOfEvaluating));
	}
	var set = new Set(types);
	if (set.size == 1){
		var m = set.values();
		var value = m.next().value;
		output = "["+value+"]";
	}
	else{
		if (set.has("int") && set.has("float")){
			output = "[float]";
		}
	}
	return output;
}

/*La funcino getTypeOfExpression verifica el tipo de una expresion para retornar si se trata de un boolean, int o float.*/
function getTypeOfExpression(resultOfEvaluating : any) : string {
	var output : string;
	if (resultOfEvaluating == true || resultOfEvaluating == false){
		output = "boolean";
	}
	else{
		var int = parseInt(resultOfEvaluating);
		var float = parseFloat(resultOfEvaluating);
		if (int == float){
			output = "int";
		}
		else{
			output = "float";
		}
	}
	return output;
}

/*La funcion ltype retorna el tipo de una expresion que contiene cvalue. Si es un arreglo, se busca su tipo con la funcion
getTypeOfArray, si no lo es se busca su tipo con la funcion getTypeOfExpression.*/
function ltypeFun(expr : termino) : any {
	var output : string;
	var resultOfEvaluating = parseE1(expr.e.e);
	if (Array.isArray(resultOfEvaluating)){
		output = getTypeOfArray(resultOfEvaluating);
	}
	else{
		output = getTypeOfExpression(resultOfEvaluating);
	}
	return output;
}

/*La funcion floor retorna el valor de la funcion piso para una entrada.*/
function floorFun(expr : termino) : number {
	var f = parseE1(expr.e.e);
	return Math.floor(f);
}

/*La funcion length retorna el tamano de un arreglo.*/
function lengthFun(expr : termino) : number {
	var array = parseE1(expr.e.e);
	return (array.length);
}

/*La funcion sum suma todos los valores de una arreglo y retorna esta suma.*/
function sumFun(expr : termino) : number {
	var array : Array<number> = parseE1(expr.e.e);
	var s = array.reduce((x, a) => x + a, 0);
	return s;
}

/*La funcion avg retorna el valor promedio de un arreglo, se basa en las funciones length y sum tambien definidas para Stokhos.*/
function avgFun(expr : termino) : number {
	var length = lengthFun(expr);
	var sum = sumFun(expr);
	return sum / length;
}
/*La funcion reset vuelve a la tabla de simbolos a su estado inicial y elimina todas las variables creadas por el usuario.*/
function resetFun() : boolean {
	symbol = new HashTable();
	return true;
}

/*La funcion uniform retorna un numero al azar en el rango [0,1)*/
function uniformFun() : number {
	var max = 1;
	var min = 0;
	var rad = Math.random() * (max - min) + min;
	return rad;
}

/*La funcion pi retorna el numero pi con doble precision.*/
function piFun() : number {
	var pi = Math.asin(1)*2;
	return pi;
}

/*La funcion now retorna el tiempo actual en milisegundos segun el metodo Date de Javascript.*/
function nowFun() : number {
	var currentTimeInMiliSeconds=Math.floor(Date.now());
	return currentTimeInMiliSeconds;
}

/*La funcion parseArray toma un subarbol del AST y lo evalua para obtener los valores de cada una de las posiciones de un arreglo.
Retorna un arreglo con las evaluaciones realizadas.*/
function parseArray(expr : termino) : Array<any> {
	var aSalir : Array<any>;
	if (expr!=null && expr.e != null && expr.e.e!=null){
	    var initNode = parseE1(expr.e.e);
	    aSalir = [initNode];
	    if (expr.b != undefined){
	    	for (var i = 0; i < expr.b.length; i++) {
	            var n = parseE1(expr.b[i].e.e);
	            aSalir.push(n);
	        }
	    }
	}
	else{
		aSalir = [];
	}
    return aSalir;
}

/*La funcion evaluate es una funcion ideal para poder realizar evaluaciones en otros modulos del programa sin necesidad de utilizar
la funcion getEvaluation.*/
export function evaluate(expr : e1) : any{
	return parseE1(expr);
}

/*La funcion getEvaluation toma el AST, la tabla de simbolos y el ciclo de computo y retorna el valor de la variable definida o la 
expresion evaluada, dependiendo de la entrada del AST, la tabla de simbolos y el ciclo de computo en el que se encuentra.
Esta funcion realiza tanto las definiciones de variables como su evaluacion y la evaluacion de expresiones. 
		DECLARACIONES:
En caso de ser una declaracion de una variable, se evalua su valor y luego se aloja la informacion de esta variable en la tabla de 
simbolos del lenguaje.
		ASIGNACIONES:
En caso de ser una asignacion, si es la posicion de un arreglo, se evalua el valor tanto de la posicion como lo que se desea modificar,
una vez obtenidos estos valores, se busca el Symbol de la variable dentro de la tabla de simbolos y se modifican sus valores con ayuda
de los metodos de la clase HashTable.
Si la variable a asignar no es la posicion de un arreglo. Si al realizar su evaluacion se obtiene un arreglo y proviene de la funcion
array o histogram, entonces se modifica el AST, esto debe realizarse para garantizar que al visitar en futuras ocasiones el AST, se 
obtendran los verdaderos valores que se encuentran en el arreglo.
Si es un arreglo que no se obtiene por medio de array o histogram o cualquier otro tipo de variable, unicamente se cambia con ayuda
del metodo de la clase HashTable.
		DECLARACIONES DE ARREGLOS:
En caso de ser la definicion de un arreglo, si el arreglo proviene de las funciones histogram o array, se modifica el AST para garantizar
que sus valores sean correctos y que pueda funcionar como cualquier arreglo, sin distinciones de aquellos escritos de la forma []. 
Finalmente, el arreglo se agrega a la tabla de simbolos.
		EXPRESIONES (que no son definiciones ni asignaciones de variables):
En caso de ser una expresion, se evalua con las funciones de este modulo y si es un arreglo de histogram o array, se eliminan las 2
ultimas posiciones del arreglo, que contienen informacion irrelevante para la impresion del arreglo como string en la consola.
*/
var symbol : HashTable;
var computedCyles : number;

export function getEvaluation(ASTtree : any, symbolTable : HashTable,computeCycle : number) : [any,HashTable,number] {
    var type = ASTtree.ast.start.kind; 
    symbol = symbolTable;
    computedCyles = computeCycle;
    let valor = ASTtree.ast.start.e as e1;
    var arbol : any;
    if (type == "declaration"){
        valor = ASTtree.ast.start.e.e as e1;
        var declarationType = ASTtree.ast.start.type.kind;
        var declarationID = ASTtree.ast.start.id.value;
        arbol = parseE1(valor);
        var t = getASTType(getType(ASTtree,symbolTable,0),type);
        symbolTable.insert(new Symbol(map(declarationID),arbol,t[0],ASTtree,computedCyles));
        //guardar variable
    }
    if (type == "assign"){ //se debe buscar el tipo en la tabla de simbolos si no existe se lanza un error
    	var assignId = ASTtree.ast.start.id.value;
    	valor = ASTtree.ast.start.e.e as e1;
    	if (ASTtree.ast.start.a != undefined){ //Se esta asignando una posicion de un arreglo
    		arbol = parseE1(valor); //valor a cambiar
    		var pos = parseE1(ASTtree.ast.start.a.next.e);  //valor de la posicion
    		var obtain = symbol.search(map(assignId));
    		if (obtain[0]!=false){
    			symbolTable.modifyArray(map(assignId),pos,arbol,valor,computedCyles);
    		}
    	}
    	else{
    		arbol = parseE1(valor);  //guardar variable
    		var getS = symbol.search(map(assignId));
    		if (getS[0]!=false){
    		    if (Array.isArray(arbol)){
    		    	var originalAST = getS[1].AST;
	    		    if (arbol[arbol.length-1] == "histogram"){
		        		originalAST.ast.start.e.e.e.e.e.e.e.e.e = arbol[arbol.length-2];
		        		var arbolMod1 = arbol.slice(0,arbol.length-2);
		        		arbol = arbolMod1;
		        	}
		        	if (arbol[arbol.length-1] == "arrayFun"){
		        		var arbolM1 = arbol.slice(0,arbol.length-2);
		        		var e : e8 = {kind : ASTKinds.e8_2 , value : {kind : ASTKinds.termino, e : {kind : ASTKinds.exp, e: arbol[arbol.length-2] }, b : []}};
		        		originalAST.ast.start.e.e.e.e.e.e.e.e.e = e;
		        		for (var i = 0 ; i < arbolM1.length-1 ; i++){
		        			originalAST.ast.start.e.e.e.e.e.e.e.e.e.value.b.push({kind : ASTKinds.termino, e : {kind : ASTKinds.exp, e: arbol[arbol.length-2] }});
		        		}
		        		arbol = arbolM1;
		        	}
		        	symbolTable.modify(map(assignId),"",getS[1].type,arbol,originalAST,computedCyles);
	    		}
	    		else{
	    			symbolTable.modify(map(assignId),arbol,getS[1].type,[],ASTtree,computedCyles);
	    		}	
    		}
    	}
    }
    if (type == "array"){
        var valor2 = ASTtree.ast.start.e.e as e1;
        var arrayType = ASTtree.ast.start.type.kind;  //guardar arreglo
        var arrayName = ASTtree.ast.start.id.value;
        if (ASTtree.ast.start.e != null){
        	arbol = parseE1(valor2);
        	if (arbol[arbol.length-1] == "histogram"){
        		ASTtree.ast.start.e.e.e.e.e.e.e.e.e = arbol[arbol.length-2];
        		var arbolMod = arbol.slice(0,arbol.length-2);
        		arbol = arbolMod;
        	}
        	if (arbol[arbol.length-1] == "arrayFun"){
        		var arbolM = arbol.slice(0,arbol.length-2);
        		var e : e8 = {kind : ASTKinds.e8_2 , value : {kind : ASTKinds.termino, e : {kind : ASTKinds.exp, e: arbol[arbol.length-2] }, b : []}};
        		ASTtree.ast.start.e.e.e.e.e.e.e.e.e = e;
        		for (var i = 0 ; i < arbolM.length-1 ; i++){
        			ASTtree.ast.start.e.e.e.e.e.e.e.e.e.value.b.push({kind : ASTKinds.termino, e : {kind : ASTKinds.exp, e: arbol[arbol.length-2] }});
        		}
        		arbol = arbolM;
        	}
        	var symbols = new Symbol(map(arrayName),"",map(arrayType),ASTtree,computedCyles);
        	symbols.array = arbol;
        	symbols.arrayCycle = [...Array(arbol.length)].map(x => computedCyles);
        	symbolTable.insert(symbols);
        }
        else{
        	arbol = [];
        } 
    }
    if (type == "exp"){
    	arbol = parseE1(valor);
    	if (Array.isArray(arbol)){
    		if (arbol[arbol.length-1]=="arrayFun" || arbol[arbol.length-1] == "histogram"){
    			var arbolModified = arbol.slice(0,arbol.length-2);
        		arbol = arbolModified;
    		}
    	}
    }
    symbolTable = symbol; 
    return [arbol,symbol,computedCyles];
}