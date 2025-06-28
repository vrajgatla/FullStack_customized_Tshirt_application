package com.customizedtrends.app.controller;

import com.customizedtrends.app.model.Order;
import com.customizedtrends.app.model.User;
import com.customizedtrends.app.service.OrderService;
import com.customizedtrends.app.service.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private static final String JWT_SECRET = "your_jwt_secret_key"; // Use env var in production
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private UserService userService;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Invalid authorization header");
            }
            
            String token = authHeader.substring(7);
            Claims claims = Jwts.parser()
                    .setSigningKey(JWT_SECRET)
                    .parseClaimsJws(token)
                    .getBody();
            
            Long userId = Long.parseLong(claims.getSubject());
            Optional<User> userOpt = userService.findById(userId);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(404).body("User not found");
            }
            
            List<Order> userOrders = orderService.getOrdersByUserId(userId);
            return ResponseEntity.ok(userOrders);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid token");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order order) {
        try {
            return ResponseEntity.ok(orderService.updateOrder(id, order));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
