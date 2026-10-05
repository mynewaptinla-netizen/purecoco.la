import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Update initial order state
content = content.replace(
    "const [orderState, setOrderState] = useState({ deliveryType: 'pickup', name: '', email: '', phone: '' });",
    "const [orderState, setOrderState] = useState({ deliveryType: 'pickup', name: '', email: '', phone: '', address: '' });\n  const [deliverySelection, setDeliverySelection] = useState('pickup');"
)

# Update form handler
content = content.replace(
    "const deliveryType = formData.get('deliveryType') as string;",
    "const deliveryType = formData.get('deliveryType') as string;\n    const address = formData.get('address') as string || '';"
)

content = content.replace(
    "setOrderState({ ...orderState, deliveryType, name, email, phone });",
    "setOrderState({ ...orderState, deliveryType, name, email, phone, address });"
)

# Update server.ts call in handlePaymentSubmit
content = content.replace(
    "buyerPhone: orderState.phone,",
    "buyerPhone: orderState.phone,\n          buyerAddress: orderState.address,"
)


# Add the address input inside the form
form_select = """
          <div className="grid md:grid-cols-1 gap-8 mb-8">
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-widest text-coco-ink/70 pl-2">Delivery Method</label>
              <select name="deliveryType" value={deliverySelection} onChange={(e) => setDeliverySelection(e.target.value)} className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg uppercase shadow-sm">
                <option value="pickup">Pickup (Free)</option>
                <option value="delivery_lb">Delivery - Long Beach (+$10)</option>
                <option value="delivery_la">Delivery - Los Angeles (+$20)</option>
              </select>
            </div>
            
            <AnimatePresence>
              {deliverySelection !== 'pickup' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 overflow-hidden"
                >
                  <label className="text-sm font-bold uppercase tracking-widest text-coco-ink/70 pl-2">Delivery Address</label>
                  <input required name="address" defaultValue={orderState.address} type="text" placeholder="123 Ocean Ave, Long Beach, CA" className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg placeholder:text-coco-ink/30 shadow-sm" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
"""

content = content.replace(
    """          <div className="grid md:grid-cols-1 gap-8 mb-8">
            <div className="space-y-3">
              <label className="text-sm font-bold uppercase tracking-widest text-coco-ink/70 pl-2">Delivery Method</label>
              <select name="deliveryType" defaultValue={orderState.deliveryType} className="w-full p-6 bg-white rounded-2xl border border-transparent focus:border-coco-green focus:ring-4 focus:ring-coco-green/10 outline-none transition-all font-medium text-lg uppercase shadow-sm">
                <option value="pickup">Pickup (Free)</option>
                <option value="delivery_lb">Delivery - Long Beach (+$10)</option>
                <option value="delivery_la">Delivery - Los Angeles (+$20)</option>
              </select>
            </div>
          </div>""",
    form_select
)

with open('src/App.tsx', 'w') as f:
    f.write(content)

