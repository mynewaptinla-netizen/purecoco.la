import fs from 'fs';
const src = fs.readFileSync('src/App.tsx', 'utf8');
if (src.includes('clearCart={')) {
    console.log("has clearCart");
} else {
    console.log("no clearCart");
}
