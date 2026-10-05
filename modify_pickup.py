import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "const PickupCheckoutForm = () => {",
    "const PickupCheckoutForm = ({ cart, updateQuantity, removeFromCart }: { cart: CartItemType[], updateQuantity: (name: string, d: number) => void, removeFromCart: (name: string) => void }) => {"
)

with open('src/App.tsx', 'w') as f:
    f.write(content)
