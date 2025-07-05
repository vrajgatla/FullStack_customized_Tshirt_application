package com.customizedtrends.app.repository;

import com.customizedtrends.app.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    // Find order items by design ID
    @Query("SELECT oi FROM OrderItem oi WHERE oi.design.id = :designId")
    List<OrderItem> findByDesignId(@Param("designId") Long designId);
} 