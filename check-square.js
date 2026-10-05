import { SquareClient, SquareEnvironment } from 'square';
const token = process.env.SQUARE_ACCESS_TOKEN;
const client = new SquareClient({
  environment: SquareEnvironment.Sandbox,
  token: token
});
client.locations.list().then(res => console.log('Sandbox:', res)).catch(e => console.log('Sandbox Error', e.message));

const clientProd = new SquareClient({
  environment: SquareEnvironment.Production,
  token: token
});
clientProd.locations.list().then(res => console.log('Prod:', res)).catch(e => console.log('Prod Error', e.message));
