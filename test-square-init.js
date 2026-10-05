import { SquareClient, SquareEnvironment } from 'square';
const client = new SquareClient({
  environment: SquareEnvironment.Sandbox,
  token: 'my-token'
});
console.log(client);
