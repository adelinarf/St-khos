import {VM} from "./VM.js"
import {REPL} from "./REPL.js"


/*Esta funcion main genera una nueva VM de Stokhos y un nuevo REPL para que se pueda utilizar el lenguaje desde la consola.*/
function main(){
	let VM_ = new VM();
	let REPL_ = new REPL(VM_);
	REPL_.newLine();
}
main();