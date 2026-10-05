import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

app_state = """
export default function App() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [bookingMode, setBookingMode] = useState<'cart' | 'event'>('cart');

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.name === product.name);
      if (existing) {
        return prev.map(item => item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item);
      }
      const priceNum = parseFloat(product.price.replace('$', ''));
      return [...prev, { name: product.name, price: priceNum, quantity: 1, image: product.image }];
    });
    setBookingMode('cart');
    setIsBookingOpen(true);
  };

  const updateQuantity = (name: string, delta: number) => {
    setCart(prev => prev.map(item => item.name === name ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter(item => item.quantity > 0));
  };

  const removeFromCart = (name: string) => {
    setCart(prev => prev.filter(item => item.name !== name));
  };

  const clearCart = () => setCart([]);

  const openCart = () => {
    setBookingMode('cart');
    setIsBookingOpen(true);
  };

  const openQuote = () => {
    setBookingMode('event');
    setIsBookingOpen(true);
  };
"""

content = content.replace(
    "export default function App() {\n  const [isBookingOpen, setIsBookingOpen] = useState(false);",
    app_state
)

content = content.replace(
    "<Navbar onBookClick={() => setIsBookingOpen(true)} />",
    "<Navbar cart={cart} onCartClick={openCart} />"
)

content = content.replace(
    "<Products onBookClick={() => setIsBookingOpen(true)} />",
    "<Products onAddToCart={addToCart} />"
)

content = content.replace(
    "<BookingForm isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />",
    "<BookingForm isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} mode={bookingMode} cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} clearCart={clearCart} />"
)

content = content.replace(
    "<Footer onBookClick={() => setIsBookingOpen(true)} />",
    "<Footer onCartClick={openCart} />"
)

content = content.replace(
    "const Footer = ({ onBookClick }: { onBookClick: () => void }) => {",
    "const Footer = ({ onCartClick }: { onCartClick: () => void }) => {"
)

content = content.replace(
    "              <li><button onClick={onBookClick} className=\"hover:text-coco-green transition-colors inline-block hover:translate-x-2 duration-300\">Order Pickup</button></li>",
    "              <li><button onClick={onCartClick} className=\"hover:text-coco-green transition-colors inline-block hover:translate-x-2 duration-300\">Checkout</button></li>"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
