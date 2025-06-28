import React, { createContext, useContext, useState, useEffect } from 'react';
import { logger } from '../utils/logger';
import { showError, showSuccess } from '../utils/toast';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        logger.error('Error loading cart from localStorage:', error);
        setCartItems([]);
        showError('Failed to load cart data');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } catch (error) {
      logger.error('Error saving cart to localStorage:', error);
      showError('Failed to save cart data');
    }
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems(prev => {
      // Check if item already exists in cart
      const existingItemIndex = prev.findIndex(cartItem => 
        cartItem.id === item.id && 
        cartItem.size === item.size &&
        cartItem.color === item.color
      );

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedCart = [...prev];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: (updatedCart[existingItemIndex].quantity || 1) + 1
        };
        showSuccess('Item quantity updated in cart');
        return updatedCart;
      } else {
        // Add new item with quantity 1
        showSuccess('Item added to cart');
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId, size, color) => {
    setCartItems(prev => 
      prev.filter(item => 
        !(item.id === itemId && item.size === size && item.color === color)
      )
    );
    showSuccess('Item removed from cart');
  };

  const updateQuantity = (itemId, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId, size, color);
      return;
    }

    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const updateItemProperty = (itemId, oldSize, color, property, newValue) => {
    setCartItems(prev => {
      const itemIndex = prev.findIndex(item => 
        item.id === itemId && item.size === oldSize && item.color === color
      );
      
      if (itemIndex === -1) return prev;
      
      const updatedCart = [...prev];
      const updatedItem = { ...updatedCart[itemIndex], [property]: newValue };
      
      // If updating size, we need to check if the new size already exists
      if (property === 'size') {
        const existingItemIndex = prev.findIndex(item => 
          item.id === itemId && item.size === newValue && item.color === color
        );
        
        if (existingItemIndex >= 0 && existingItemIndex !== itemIndex) {
          // Merge quantities if the new size already exists
          const existingItem = updatedCart[existingItemIndex];
          const oldQuantity = updatedCart[itemIndex].quantity || 1;
          existingItem.quantity = (existingItem.quantity || 1) + oldQuantity;
          // Remove the old item
          updatedCart.splice(itemIndex, 1);
          
          logger.log(`Merged ${oldQuantity} item(s) with existing ${newValue} size`);
          showSuccess(`Merged items with existing ${newValue} size`);
        } else {
          // Just update the size
          updatedCart[itemIndex] = updatedItem;
        }
      } else {
        // For other properties, just update
        updatedCart[itemIndex] = updatedItem;
      }
      
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    showSuccess('Cart cleared');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  const createOrder = async (orderData) => {
    setLoading(true);
    try {
      const orderPayload = {
        ...orderData,
        items: cartItems.map(item => ({
          tshirtId: item.id,
          quantity: item.quantity || 1,
          size: item.size,
          color: item.color,
          designId: item.designId,
          price: item.price
        })),
        total: getCartTotal()
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const order = await response.json();
      clearCart(); // Clear cart after successful order
      showSuccess('Order created successfully!');
      return order;
    } catch (error) {
      logger.error('Error creating order:', error);
      showError('Failed to create order. Please try again.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateItemProperty,
      clearCart,
      getCartTotal,
      getCartCount,
      createOrder,
      loading
    }}>
      {children}
    </CartContext.Provider>
  );
} 