import { IParser } from "./Parser";
import Input from "./Input";
import Result, { isSuccessful } from "./Result";

class CharParser implements IParser<string> {
    private predicate: (c: string) => boolean;
    private message: string;

    constructor(predicate: (c: string) => boolean, message: string) {
        this.predicate = predicate;
        this.message = message;
    }

    parse(input: string) {
        const r = this._parseInternal(new Input(input, 0));
        if (isSuccessful(r)) {
            return r.value;
        }
        throw new Error(r.message);
    }

    _parseInternal(input: Input): Result<string> {
        if (input.isAtEnd) {
            return {
                isSuccessful: false,
                message: 'Unexpected end of input',
                remainder: input
            }
        }
        if (this.predicate(input.current[0])) {
            return {
                isSuccessful: true,
                value: input.current[0],
                remainder: input.advance(1)
            }
        } 
        return {
            isSuccessful: false,
            message: this.message,
            remainder: input
        }
    }
}

const AnyChar = new CharParser(() => true, "");
const Letter = new CharParser((c) => /^[a-z]$/i.test(c), "Letter expected");
const Digit = new CharParser((c) => /^\d$/i.test(c), "Digit expected");
const Alnum = new CharParser((c) => /^\w$/i.test(c), "Alnum expected");
const Space = new CharParser((c) => /^\s$/i.test(c), "Space expected");

const Char = (c: string) => new CharParser((s) => s === c, `'${c}' expected`);
const Not = (c: string) => new CharParser((s) => s !== c, `Letters other than ${c} expected`);

export { AnyChar, Letter, Digit, Alnum, Space, Char, Not };