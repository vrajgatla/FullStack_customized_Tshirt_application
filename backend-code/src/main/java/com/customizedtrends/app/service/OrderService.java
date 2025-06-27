package com.customizedtrends.app.service;

import com.customizedtrends.app.model.Order;
import com.customizedtrends.app.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order updateOrder(Long id, Order updatedOrder) {
        return orderRepository.findById(id)
            .map(order -> {
                order.setCustomerName(updatedOrder.getCustomerName());
                order.setAddress(updatedOrder.getAddress());
                order.setStatus(updatedOrder.getStatus());
                order.setCreatedAt(updatedOrder.getCreatedAt());
                order.setItems(updatedOrder.getItems());
                return orderRepository.save(order);
            })
            .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
} 