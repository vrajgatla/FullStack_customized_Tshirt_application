package com.customizedtrends.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorResponse {
    private String message;
    private String code;
    private Map<String, String> details;
    private long timestamp = System.currentTimeMillis();
    
    public ErrorResponse(String message, String code, Map<String, String> details) {
        this.message = message;
        this.code = code;
        this.details = details;
        this.timestamp = System.currentTimeMillis();
    }
} 