import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { logger } from '../utils/logger';
import { showError, showSuccess } from '../utils/toast';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const { user, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get user-specific cart key
  const getCartKey = () => {
    return user ? `cart_${user.id}` : 'cart_guest';
  };

  // Load cart from localStorage on mount or when user changes
  useEffect(() => {
    if (!isAuthenticated) {
      // For non-authenticated users, show empty cart
      setCartItems([]);
      return;
    }

    const cartKey = getCartKey();
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        logger.error('Error loading cart from localStorage:', error);
        setCartItems([]);
        showError('Failed to load cart data');
      }
    } else {
      setCartItems([]);
    }
  }, [user, isAuthenticated]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isAuthenticated) return;

    try {
      const cartKey = getCartKey();
      localStorage.setItem(cartKey, JSON.stringify(cartItems));
    } catch (error) {
      logger.error('Error saving cart to localStorage:', error);
      showError('Failed to save cart data');
    }
  }, [cartItems, user, isAuthenticated]);

  const addToCart = (item) => {
    if (!isAuthenticated) {
      showError('Please login to add items to cart');
      return;
    }

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
    if (!isAuthenticated) {
      showError('Please login to manage cart');
      return;
    }

    setCartItems(prev => 
      prev.filter(item => 
        !(item.id === itemId && item.size === size && item.color === color)
      )
    );
    showSuccess('Item removed from cart');
  };

  const updateQuantity = (itemId, size, color, quantity) => {
    if (!isAuthenticated) {
      showError('Please login to manage cart');
      return;
    }

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
    if (!isAuthenticated) {
      showError('Please login to manage cart');
      return;
    }

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
    if (!isAuthenticated) {
      showError('Please login to manage cart');
      return;
    }

    setCartItems([]);
    showSuccess('Cart cleared');
  };

  const getCartTotal = () => {
    if (!isAuthenticated) return 0;
    
    return cartItems.reduce((total, item) => {
      const price = item.price || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };

  const getCartCount = () => {
    if (!isAuthenticated) return 0;
    
    return cartItems.reduce((count, item) => count + (item.quantity || 1), 0);
  };

  const createOrder = async (orderData) => {
    if (!isAuthenticated) {
      showError('Please login to create an order');
      throw new Error('Authentication required');
    }

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
      cartItems: isAuthenticated ? cartItems : [],
      addToCart,
      removeFromCart,
      updateQuantity,
      updateItemProperty,
      clearCart,
      getCartTotal,
      getCartCount,
      createOrder,
      loading,
      isAuthenticated
    }}>
      {children}
    </CartContext.Provider>
  );
} 