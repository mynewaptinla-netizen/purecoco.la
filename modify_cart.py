import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Change step state to include 'cart'
content = content.replace(
    "const [step, setStep] = useState<'details' | 'payment'>('details');",
    "const [step, setStep] = useState<'cart' | 'details' | 'payment'>('cart');\n  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);"
)

# In handleDetailsSubmit, remove quantity reading
content = content.replace(
    "    const quantity = parseInt(formData.get('quantity') as string) || 1;\n    const deliveryType = formData.get('deliveryType') as string;\n    const name = formData.get('name') as string || '';\n    const email = formData.get('email') as string || '';\n    const phone = formData.get('phone') as string || '';\n    \n    setOrderState({ quantity, deliveryType, name, email, phone });",
    "    const deliveryType = formData.get('deliveryType') as string;\n    const name = formData.get('name') as string || '';\n    const email = formData.get('email') as string || '';\n    const phone = formData.get('phone') as string || '';\n    \n    setOrderState({ ...orderState, deliveryType, name, email, phone });"
)

# In handlePaymentSubmit, change items to cart
content = content.replace(
    """          items: [
            {
              name: 'Fresh Coconut',
              price: 12, // $12 each
              quantity: orderState.quantity,
            }
          ],""",
    "          items: cart,"
)


# Add cart rendering before details
cart_render = """
      {step === 'cart' && (
        <motion.div 
          key="form-cart"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.3 }}
        >
          {cart.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-2xl text-coco-ink/50">Your cart is empty.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {cart.map((item) => (
                  <div key={item.name} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-coco-ink/5">
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                    <div className="flex-1">
                      <h4 className="font-bold text-lg">{item.name}</h4>
                      <p className="text-coco-green font-bold">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-coco-sand p-2 rounded-xl">
                      <button type="button" onClick={() => updateQuantity(item.name, -1)} className="p-2 hover:bg-white rounded-lg transition-colors text-coco-ink"><Minus size={16} /></button>
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.name, 1)} className="p-2 hover:bg-white rounded-lg transition-colors text-coco-ink"><Plus size={16} /></button>
                    </div>
                    <button type="button" onClick={() => removeFromCart(item.name)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl border border-coco-ink/5 shadow-sm">
                <span className="text-xl font-bold uppercase tracking-widest text-coco-ink/70">Total</span>
                <span className="text-3xl font-bold text-coco-green">${cartTotal.toFixed(2)}</span>
              </div>
              <button onClick={() => setStep('details')} className="w-full bg-coco-green text-coco-sand py-6 rounded-2xl font-bold uppercase text-xl tracking-widest hover:bg-coco-ink hover:-translate-y-1 transition-all duration-300 shadow-2xl shadow-coco-green/30">
                Proceed to Checkout
              </button>
            </>
          )}
        </motion.div>
      )}
"""

content = content.replace(
    "{step === 'details' && (",
    cart_render + "\n      {step === 'details' && ("
)


# replace the grid containing quantity
content = content.replace(
    """          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-widest text-coco-ink/70 pl-2">Phone Number</label>
              <input required name="phone" defaultValue={orderState.phone} type="tel" placeholder="Your Phone Number" className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg placeholder:text-coco-ink/30 shadow-sm" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-widest text-coco-ink/70 pl-2">Quantity</label>
              <input name="quantity" defaultValue={orderState.quantity} required type="number" min="1" placeholder="How many coconuts? ($12 ea)" className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg placeholder:text-coco-ink/30 shadow-sm" />
            </div>
          </div>""",
    """          <div className="grid md:grid-cols-1 gap-8 mb-8">
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-widest text-coco-ink/70 pl-2">Phone Number</label>
              <input required name="phone" defaultValue={orderState.phone} type="tel" placeholder="Your Phone Number" className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg placeholder:text-coco-ink/30 shadow-sm" />
            </div>
          </div>"""
)

# update quantity initial state
content = content.replace(
    "const [orderState, setOrderState] = useState({ quantity: 1, deliveryType: 'pickup', name: '', email: '', phone: '' });",
    "const [orderState, setOrderState] = useState({ deliveryType: 'pickup', name: '', email: '', phone: '' });"
)

# update amount shown in payment form details summary
content = content.replace(
    """                <p className="text-3xl font-bold text-coco-green mt-2">${(orderState.quantity * 12).toFixed(2)}</p>""",
    """                <p className="text-3xl font-bold text-coco-green mt-2">${(cartTotal).toFixed(2)}</p>"""
)
content = content.replace(
    """                <p className="text-coco-ink/60 uppercase text-sm tracking-widest font-bold">Total ({orderState.quantity} items)</p>""",
    """                <p className="text-coco-ink/60 uppercase text-sm tracking-widest font-bold">Total ({cart.reduce((s,i)=>s+i.quantity,0)} items)</p>"""
)


with open('src/App.tsx', 'w') as f:
    f.write(content)
