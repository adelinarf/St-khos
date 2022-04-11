# Gramática de STÓKHOS
Esta es la gramática utilizada en nuestra implementación del lenguaje Stókhos. Se asume que los operadores son asociativos a izquierda
y el símbolo * representa una regla de la gramática que puede ser utilizada 0 o más veces y el símbolo ? indica que la regla es opcional.

	<input>      -> <grammar>
	<grammar>    -> <definition> | <assign> | <array> | <exp>
	<definition> -> <space>* <type> <space>* <id> <space>* <assignSymbol> <space>* <exp> <space>* <semicolon> <space>*
	<assign>     -> <space>* <id> <space>* <position>? <space>* <assignSymbol> <space>* <exp> <space>* <semicolon> <space>*
	<array>      -> <space>* <OpenBracket> <space>* <type> <space>* <CloseBracket> <space>* <id> <space>* <assignSymbol> <space>* <OpenBracket> <space>* <termino>? <space>* <CloseBracket> <space>* <semicolon> <space>*

	<position> ->  <OpenBracket> <exp> <CloseBracket>

	<unary>    -> <plus> | <minus> | <not>
	<terms>    -> <number> | <boolean> | <id> <call1>? <call2>?

	<call1>    -> <OpenBracket> <exp> <CloseBracket>
	<call2>    -> <OpenPar> <termino>? <ClosePar>

	<exp>      -> <space>* <e1> <space>*
	<e1>       -> <e2> <space>* (<and>|<or>)*          | <e2>
	<e2>       -> <e3> <space>* (<eq> |<ne>)*          | <e3>
	<e3>       -> <e4> <space>* (<lt>|<le>|<ge>|<gt>)* | <e4>
	<e4>       -> <e5> <space>* (<plus>|<minus>)*      | <e5>
	<e5>       -> <e6> <space>* (<mult>|<div>|<mod>)*  | <e6>
	<e6>       -> <unary>* <space>* <e7>               | <e7>
	<e7>       -> <e8> <space>* (<power>)*             | <e8>  
	<e8>       -> <OpenPar> <space>* <exp> <space>* <ClosePar> | <OpenBracket> <space>* <termino>? <space>* <CloseBracket> | <OpenBrace> <space>* <exp> <space>* <CloseBrace> | <quote> <space>* <exp> <space>* <quote> | <terms>

	<termino>  -> <space>* <exp> <space>* <element>* <space>*
	<element>  -> <comma> <exp>

	<space>        -> ' ' | '\\t' | '\n' | '\r\n'
	<semicolon>    -> '\;'
	<assignSymbol> -> '\:='
	<type>         -> <num> | <bool>
	<num>          -> 'num'
	<bool>         -> 'bool'
	<id>           -> 'TkId\(\b([a-zA-Z_][^\s\W]*)\) '
	<OpenBracket>  -> '\['
	<CloseBracket> -> '\]'
	<OpenPar>      -> '\('
	<ClosePar>     -> '\)'
	<quote>        -> '\''
	<power>        -> '\^'
	<plus>         -> '\+'
	<minus>        -> '\-'
	<comma>        -> '\,'
	<not>          -> '\!'
	<number>       -> 'TkNumber\([0-9]+(?:\.[0-9]+)?\) '
	<boolean>      -> 'false' | 'true'
	<lambda>       -> ''
	<lt>           -> '\<'
	<le>           -> '\<='
	<ge>           -> '\>='
	<gt>           -> '\>'
	<mult>         -> '\*'
	<div>          -> '\/'
	<mod>          -> '\%'
	<and>          -> '\&&'
	<or>           -> '\||'
	<eq>           -> '\='
	<ne>           -> '\<>'