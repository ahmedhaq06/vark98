import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

const CartContext = createContext(null);
const KEY = 'vark-cart-v1';

// item: { key, type: 'painting'|'cd', id, title, price, image, qty, max }
function reducer(items, action) {
  switch (action.type) {
    case 'add': {
      const existing = items.find((i) => i.key === action.item.key);
      if (existing) {
        return items.map((i) => (i.key === existing.key ? { ...i, qty: Math.min(i.qty + 1, i.max ?? 99) } : i));
      }
      return [...items, { ...action.item, qty: 1 }];
    }
    case 'setQty':
      return items
        .map((i) => (i.key === action.key ? { ...i, qty: Math.max(0, Math.min(action.qty, i.max ?? 99)) } : i))
        .filter((i) => i.qty > 0);
    case 'remove':
      return items.filter((i) => i.key !== action.key);
    case 'clear':
      return [];
    default:
      return items;
  }
}

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, undefined, load);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.qty * i.price, 0),
      has: (key) => items.some((i) => i.key === key),
      add: (item) => dispatch({ type: 'add', item }),
      setQty: (key, qty) => dispatch({ type: 'setQty', key, qty }),
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
