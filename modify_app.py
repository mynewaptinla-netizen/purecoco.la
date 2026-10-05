import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Imports
content = content.replace("Clock,\n  Upload\n} from 'lucide-react';", "Clock,\n  Upload,\n  ShoppingCart,\n  Plus,\n  Minus,\n  Trash2\n} from 'lucide-react';\n\nexport type CartItemType = {\n  name: string;\n  price: number;\n  image: string;\n  quantity: number;\n};\n")

# 2. Navbar
content = content.replace(
    "const Navbar = ({ onBookClick }: { onBookClick: () => void }) => {",
    "const Navbar = ({ cart, onCartClick }: { cart: CartItemType[], onCartClick: () => void }) => {\n  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);"
)

content = content.replace(
    """          <button 
            onClick={onBookClick}
            className="bg-coco-green text-coco-sand px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-coco-ink hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-coco-green/20"
          >
            Order Now
          </button>""",
    """          <button 
            onClick={onCartClick}
            className="flex items-center gap-2 bg-coco-green text-coco-sand px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-coco-ink hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-coco-green/20"
          >
            <ShoppingCart size={18} /> Cart {cartCount > 0 ? `(${cartCount})` : ''}
          </button>"""
)

content = content.replace(
    """                  onBookClick();
                }}
                className="bg-coco-green text-coco-sand py-4 rounded-xl text-center font-bold uppercase tracking-widest shadow-lg shadow-coco-green/20 w-full"
              >
                Order Now
              </motion.button>""",
    """                  onCartClick();
                }}
                className="flex items-center justify-center gap-2 bg-coco-green text-coco-sand py-4 rounded-xl text-center font-bold uppercase tracking-widest shadow-lg shadow-coco-green/20 w-full"
              >
                <ShoppingCart size={18} /> Cart {cartCount > 0 ? `(${cartCount})` : ''}
              </motion.button>"""
)

# 3. Products
content = content.replace(
    "const Products = ({ onBookClick }: { onBookClick: () => void }) => {",
    "const Products = ({ onAddToCart }: { onAddToCart: (item: any) => void }) => {"
)

content = content.replace(
    """                className="bg-white rounded-[2.5rem] overflow-hidden group border border-coco-ink/5 shadow-xl shadow-coco-ink/5 flex flex-col h-full cursor-pointer"
                onClick={onBookClick}
              >""",
    """                className="bg-white rounded-[2.5rem] overflow-hidden group border border-coco-ink/5 shadow-xl shadow-coco-ink/5 flex flex-col h-full cursor-pointer"
                onClick={() => onAddToCart(item)}
              >"""
)

content = content.replace(
    """                    <button onClick={(e) => { e.stopPropagation(); onBookClick(); }} className="bg-white text-coco-ink px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-xl hover:bg-coco-green hover:text-white transition-colors duration-300">
                      Add to Cart
                    </button>""",
    """                    <button onClick={(e) => { e.stopPropagation(); onAddToCart(item); }} className="bg-white text-coco-ink px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-xl hover:bg-coco-green hover:text-white transition-colors duration-300">
                      Add to Cart
                    </button>"""
)

content = content.replace(
    """                  <button onClick={(e) => { e.stopPropagation(); onBookClick(); }} className="w-full py-4 rounded-xl border-2 border-coco-ink text-coco-ink font-bold uppercase tracking-widest hover:bg-coco-ink hover:text-white transition-colors mt-auto">
                    Add to Cart
                  </button>""",
    """                  <button onClick={(e) => { e.stopPropagation(); onAddToCart(item); }} className="w-full py-4 rounded-xl border-2 border-coco-ink text-coco-ink font-bold uppercase tracking-widest hover:bg-coco-ink hover:text-white transition-colors mt-auto">
                    Add to Cart
                  </button>"""
)

# 4. BookingForm
content = content.replace(
    "const BookingForm = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {",
    "const BookingForm = ({ isOpen, onClose, mode, cart, updateQuantity, removeFromCart, clearCart }: { isOpen: boolean, onClose: () => void, mode: 'cart' | 'event', cart: CartItemType[], updateQuantity: (name: string, d: number) => void, removeFromCart: (name: string) => void, clearCart: () => void }) => {"
)

content = content.replace(
    "const [formType, setFormType] = useState<'event' | 'pickup'>('pickup');",
    "const [formType, setFormType] = useState<'event' | 'cart'>(mode);"
)

content = content.replace(
    """  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      setSubmitted(true);
      setFormType('pickup');
    }
    if (query.get('canceled')) {
      setFormType('pickup');
    }
  }, []);""",
    """  useEffect(() => {
    setFormType(mode);
  }, [mode, isOpen]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      setSubmitted(true);
      setFormType('cart');
      clearCart();
    }
    if (query.get('canceled')) {
      setFormType('cart');
    }
  }, []);"""
)

content = content.replace(
    "{formType === 'event' ? 'Get a Quote' : 'Order For Pickup.'}",
    "{formType === 'event' ? 'Get a Quote' : 'Your Cart'}"
)

content = content.replace(
    "{formType === 'event' \n                    ? 'Tell us about your event and we will get back within 24-48 hours.'\n                    : 'Private Events • Festivals • Office Drops • Local Pickups'}",
    "{formType === 'event' \n                    ? 'Large purchases, Private Events, Festivals, Office Drops'\n                    : 'Review your items and checkout.'}"
)

content = content.replace(
    """                <button 
                  onClick={() => setFormType('pickup')}
                  className={`px-6 md:px-8 py-3 md:py-4 rounded-full font-bold uppercase tracking-widest transition-all text-xs md:text-sm ${formType === 'pickup' ? 'bg-coco-green text-coco-sand shadow-lg' : 'bg-coco-sand text-coco-ink hover:bg-coco-ink/5'}`}
                >
                  Pickup & Delivery
                </button>""",
    """                <button 
                  onClick={() => setFormType('cart')}
                  className={`px-6 md:px-8 py-3 md:py-4 rounded-full font-bold uppercase tracking-widest transition-all text-xs md:text-sm ${formType === 'cart' ? 'bg-coco-green text-coco-sand shadow-lg' : 'bg-coco-sand text-coco-ink hover:bg-coco-ink/5'}`}
                >
                  Cart Checkout
                </button>"""
)

content = content.replace(
    """              ) : (
                <PickupCheckoutForm />
              )}""",
    """              ) : (
                <PickupCheckoutForm cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
              )}"""
)


with open('src/App.tsx', 'w') as f:
    f.write(content)
