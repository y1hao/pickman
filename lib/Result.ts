import Input from "./Input";

type FailedResult = {
    isSuccessful: false;
    message: string;
    remainder: Input;
}

type SuccessfulResult<T> = {
    isSuccessful: true;
    value: T;
    remainder: Input;
}

type Result<T> = FailedResult | SuccessfulResult<T>;

export function isSuccessful<T>(result: Result<T>): result is SuccessfulResult<T> {
    return result.isSuccessful
}

export default Result;