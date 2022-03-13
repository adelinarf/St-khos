var REPL = require("./REPL.js");
var VM = require("./VM.js");

function main(){
	let VM_ = new VM.VM();
	let REPL_ = new REPL.REPL(VM_);
	REPL_.newLine();
}
main();