import Input from "./Input";
import { IParser} from "./Parser";
import Result, { isSuccessful } from "./Result";

interface IParserBuilder<TResult, TArgs extends any[]> {
    with<T>(parser: IParser<T>): IParserBuilder<TResult, [...TArgs, T]>;
    withMany<T>(parser: IParser<T>): IParserBuilder<TResult, [...TArgs, T[]]>;
    withOptional<T>(parsre: IParser<T>): IParserBuilder<TResult, [...TArgs, T | undefined]>;
    collect(collectFunc: (...args: TArgs) => TResult): IParser<TResult>;
}

class ParserBuilder<TResult, TArgs extends any[]> implements IParserBuilder<TResult, TArgs> {
    private children: IParser<any>[];
    
    constructor(children: IParser<any>[]) {
        this.children = children;
    }

    with<T>(parser: IParser<T>): IParserBuilder<TResult, [...TArgs, T]> {
        return new ParserBuilder([...this.children, parser]);
    }
    
    withMany<T>(parser: IParser<T>): IParserBuilder<TResult, [...TArgs, T[]]> {
        const manyParser = {
            parse(input: string) {
                return parser.parse.call(this, input);
            },
            _parseInternal(input: Input): Result<T[]> {
                const results: T[] = [];
                let remainder = input;
                let parsed = true;
                while (parsed) {
                    const result = parser._parseInternal(remainder);
                    parsed = result.isSuccessful;
                    remainder = result.remainder;
                    if (isSuccessful(result)) {
                        results.push(result.value);
                    }
                }
                return {
                    isSuccessful: true,
                    value: results,
                    remainder: remainder
                }
            }
        }
        return new ParserBuilder([...this.children, manyParser]);
    }

    withOptional<T>(parser: IParser<T>): IParserBuilder<TResult, [...TArgs, T | undefined]> {
        const optionalParser = {
            parse(input: string) {
                return parser.parse.call(this, input);
            },
            _parseInternal(input: Input): Result<T | undefined> {
                const result = parser._parseInternal(input);
                if (isSuccessful(result)) {
                    return result;
                }
                return {
                    isSuccessful: true,
                    value: undefined,
                    remainder: result.remainder
                }
            }
        }
        return new ParserBuilder([...this.children, optionalParser]);
    }

    collect(collectFunc: (...args: TArgs) => TResult): IParser<TResult> {
        const children = this.children;
        return  {
            parse(input: string) {
                const result = this._parseInternal(new Input(input, 0))
                if (result.isSuccessful) {
                    return result.value;
                }
                throw new Error(result.message);
            },
            
            _parseInternal(input: Input): Result<TResult> {
                const results: Result<any>[] = [];
                let remainder = input;
                for (const parser of children) {
                    const result = parser._parseInternal(remainder);
                    remainder = result.remainder;
                    results.push(result);
                }

                for (const r of results) {
                    if (!r.isSuccessful) {
                        return r
                    }
                }

                return {
                    isSuccessful: true,
                    value: collectFunc(...results.filter(isSuccessful).map(a => a.value) as TArgs),
                    remainder: remainder
                };
            }
        }
    }
}

const DefaultParserBuilder = {
    of<T>() {
        return new ParserBuilder<T, []>([] as []);
    }
}

export default DefaultParserBuilder;
