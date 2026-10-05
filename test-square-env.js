import { SquareClient } from 'square';
const client = new SquareClient({ token: 'foo' });
console.log(client._options.environment);
