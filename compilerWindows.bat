cmd /c tspeg gramatica.peg parser.ts
cmd /c tsc -t ES2021 -m commonjs parser.ts
cmd /c tspeg parserGrammar.peg parser2.ts
cmd /c tsc -t ES2021 -m commonjs parser2.ts
cmd /c tsc getString.ts
cmd /c tsc getTypes.ts
cmd /c tsc getEvaluation.ts
cmd /c tsc searchType.ts
cmd /c tsc changeAST.ts
cmd /c tsc VM.ts
cmd /c tsc REPL.ts
cmd /c tsc main.ts
PAUSE
