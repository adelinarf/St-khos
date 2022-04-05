var REPL = require("./REPL.js");
var VM = require("./VM.js");

/*Esta funcion main genera una nueva VM de Stokhos y un nuevo REPL para que se pueda utilizar el lenguaje desde la consola.*/
function main(){
	let VM_ = new VM.VM();
	let REPL_ = new REPL.REPL(VM_);
	REPL_.newLine();
}
main();