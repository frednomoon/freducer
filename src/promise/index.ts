import * as freducer from "../src"
import defaultFreducer from "../src"

const parts: [string, string, string] = ["PENDING", "REJECTED", "FULFILLED"]

export const asyncMethod = freducer.asyncMethod(parts)
export type LocationFunction = freducer.LocationFunction
export const asyncReducer = freducer.asyncReducer
export const reducer = freducer.reducer

export default defaultFreducer(parts)
