cmd /c tspeg gramatica.peg parser.ts
cmd /c tsc -t ES2021 -m commonjs parser.ts
cmd /c tspeg parserGrammar.peg parser2.ts
cmd /c tsc -t ES2021 -m commonjs parser2.ts
cmd /c tsc Tree.ts
cmd /c tsc parsingFunctions.ts
cmd /c tsc validateLibrary.ts
cmd /c tsc VM.ts
cmd /c tsc REPL.ts
cmd /c tsc main.ts
PAUSE