import Input from "./Input";
import Result from "./Result";

export interface IParser<T> {
    parse(input: string): T;

    /** @internal */
    _parseInternal(input: Input): Result<T>;
}