export class VM {
  parse = require("./parser.js").parse;
  constructor() {
  	this.parse = require("./parser.js").parse;
  }

  lextest(instruccion : String,number) : string {
	var token = this.saveTokens(instruccion);
	var empty = " ";
	var cadena = empty.repeat(instruccion.length);
	if (instruccion.replace(cadena,"") == ""){
		console.log('OK: lex("") ==> ' + '[ ]');
		return "newLine";
	}
	else{
		if (token.length < 1){
			var parseo = this.parse(instruccion);
			var pos = parseo.errs[0].pos.overallPos;
			console.log("ERROR: Caracter invalido ('" + instruccion.charAt(pos) + "') en la entrada");
		}
		else{
			var listaTokens = this.showTokens(token);
		    var imprimir = 'OK: lex("' + instruccion.substr(1,instruccion.length) + '") ==> ' + '[' + listaTokens + ']';
		    var sinEspacios = instruccion.replace(" ","");
		    console.log(imprimir);
		    return "newLine";
		}
	}
	if (number==0){
		return "newLine";
		//super.newLine();
	}
	return "noNewLine";
  }

  testParser(instruccion: string, readline) : string {
	var frase1 = instruccion+"=parse=>[[AST]]"
	var retornar = this.ast2str(frase1,readline);
	return retornar
  }

  ast2str(frase1: string, readline) : string{
	var frase2 = "=ast2str=>"
	var redundante1 = "("
	var redundante2 = ")"
	var imprimir =  frase1+frase2+redundante1
	console.log(imprimir);
	return "newLine");
 }
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
			this.leerArchivo(fileName,1);
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
  
  showTokens(array : Array<string>) : Array<string>{
	var arreglo : Array<string> = [];
	for (var i = 0; i < array.length-1; i++) {
		if (i%2==0){
			if (array[i] == "TkNumber" || array[i] == "TkId"){
				arreglo.push(" " + array[i] + "(" + array[i+1] + ")");
			}
			else{
				arreglo.push(array[i]);
			}
		}
	}
	return arreglo;
  }
  
  saveTokens(input) : Array<string> {
	var parseo = this.parse(input);
	var arreglo : Array<string> = [];
	if (parseo.ast != undefined || parseo.ast != null){
		this.saveInArray(parseo.ast.start,arreglo);
	}
	return arreglo;
  }

  saveInArray(siguiente, array : Array<string>) :  void {
    while(siguiente != undefined){
    	   array.push(siguiente.kind);
    	   array.push(siguiente.value);
    	   siguiente = siguiente.next[0];
    }
  }



}