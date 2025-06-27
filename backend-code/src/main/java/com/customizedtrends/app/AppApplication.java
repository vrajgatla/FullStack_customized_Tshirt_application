package com.customizedtrends.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class AppApplication {
    public static void main(String[] args) {
        SpringApplication.run(AppApplication.class, args);
    }

    @Bean
    public WebServerFactoryCustomizer<TomcatServletWebServerFactory> tomcatCustomizer() {
        return factory -> factory.addConnectorCustomizers(connector -> {
            connector.setProperty("maxParameterCount", "10000");
            connector.setProperty("maxPostSize", "10485760"); // 10MB
            connector.setProperty("maxSwallowSize", "10485760"); // 10MB
            connector.setProperty("fileCount", "5"); // allow up to 5 files
        });
    }
} 