import { add, PI } from './math'
import { multiply as mult } from './math'
import * as math from './math'

import Logger from './logger'

console.log(add(2, 3));
console.log(PI);

console.log(mult(4, 5));

console.log(math.add(1, 2));


const logger = new Logger();
logger.log('Hello world');