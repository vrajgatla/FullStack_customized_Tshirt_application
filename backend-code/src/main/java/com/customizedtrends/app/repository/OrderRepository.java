package com.customizedtrends.app.repository;

import com.customizedtrends.app.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
} 