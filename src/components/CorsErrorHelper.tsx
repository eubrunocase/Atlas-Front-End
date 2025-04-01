
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Code } from 'lucide-react';

const CorsErrorHelper = () => {
  return (
    <Card className="w-full max-w-3xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Erro de CORS Detectado</CardTitle>
        <CardDescription>
          A aplicação front-end não consegue se comunicar com o servidor backend devido a restrições de CORS
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Code className="h-4 w-4" />
          <AlertTitle>Como resolver o problema de CORS</AlertTitle>
          <AlertDescription>
            Para resolver este problema, você precisa configurar o servidor Spring Boot para aceitar requisições CORS
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <h3 className="font-medium">Adicione a seguinte classe de configuração ao seu projeto Spring Boot:</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>{`package com.seu.pacote.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Permite credenciais
        config.setAllowCredentials(true);
        
        // Origens permitidas
        config.addAllowedOrigin("http://localhost:8081");
        
        // Headers permitidos
        config.addAllowedHeader("*");
        
        // Métodos HTTP permitidos
        config.addAllowedMethod("*");
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}`}</code>
          </pre>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-medium">E ajuste sua configuração de segurança:</h3>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto">
            <code>{`@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http
        // Desabilitar CSRF para APIs REST
        .csrf(csrf -> csrf.disable())
        
        // Importante: permitir CORS antes de outras regras de segurança
        .cors(Customizer.withDefaults())
        
        // Resto da configuração...
        .build();
}`}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default CorsErrorHelper;
