import {VM} from "./VM";

export class REPL {
  errores : Array<Array<string>>;
  readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  VM_ : VM;
  constructor(VM_ : VM) {
    this.errores = [];
    this.VM_ = VM_;
  }
 
  newLine() {
    this.readline.question('<Stokhos> ', entrada => {
    var re = /.lex/gi;
    var re1 = /.load/gi;
    var re2 = /.failed/gi;
    var re3 = /.reset/gi;
    if (entrada == " " || entrada == ""){
      this.newLine();
    }
    if (entrada == "."){
      this.readline.input.destroy();
    }
    if (entrada.search(re) == 0){
      var instruccion = entrada.replace(re,"");
      var retorna1 : string = this.VM_.lextest(instruccion,0);
      if (retorna1 == "newLine"){
        this.newLine();
      }
    }
    if (entrada.search(re1) == 0){
      var name = entrada.replace(re1,"");
      var fileName = name.replace(" ","");
      var retorna : [string, Array<Array<string>>] = this.VM_.leerArchivo(fileName,0);
      if (retorna[0] == "newLine"){
        this.errores = this.errores.concat(retorna[1]);
        this.newLine();
      }
      else{
        this.errores = this.errores.concat(retorna[1]);
      }
    }
    if (entrada.search(re2) == 0){
      this.imprimirErrores();
    }
    if (entrada.search(re3) == 0){
      this.eliminarErrores();
    }
    else{
      var a = entrada.search(re);
      var b = entrada.search(re1);
      var c = entrada.search(re2);
      var d = entrada.search(re3);
      if (entrada != "." && entrada != "" && entrada != " " && a != 0 && b != 0 && c != 0 && d != 0){
        if (a > 0 || b > 0 || c > 0 || d > 0){
          this.printInvalid(a,entrada); 
          this.printInvalid(b,entrada);
          this.printInvalid(c,entrada);
          this.printInvalid(d,entrada);
        }
        else{
          console.log("ERROR: Interpretacion no implementada");
        }
        this.newLine();
      }
    }
    });
  }

  printInvalid(a : number,entrada : string){
    if (a>0){
      console.log("ERROR: Caracter invalido ('" + entrada.substr(0,a) + "') en la entrada");
    }
  }

  imprimirErrores(){
    console.log(this.errores);
    this.newLine();
  }

  eliminarErrores(){
    this.errores = [];
    this.newLine();
  }
}