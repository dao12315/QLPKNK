package com.clinic.backend.infrastructure.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth

                        // CORS preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Auth public
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/refresh").permitAll()

                        // Auth protected
                        .requestMatchers(HttpMethod.GET, "/api/auth/me").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/auth/logout").authenticated()

                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/patients/create").permitAll()

                        // Users
                        .requestMatchers(HttpMethod.GET, "/api/users")
                        .hasAuthority("admin")
                        .requestMatchers("/api/users/**")
                        .hasAnyAuthority("admin")

                        // Patients
                        .requestMatchers(HttpMethod.GET, "/api/patients/**")
                        .hasAnyAuthority("admin", "dentist", "receptionist")
                        .requestMatchers("/api/patients/**")
                        .hasAnyAuthority("admin", "receptionist")

                        // Doctors
                        .requestMatchers(HttpMethod.GET, "/api/doctors/**")
                        .hasAnyAuthority("admin", "dentist", "receptionist")
                        .requestMatchers("/api/doctors/**")
                        .hasAuthority("admin")

                        // Appointments
                        .requestMatchers(HttpMethod.GET, "/api/appointments/**")
                        .hasAnyAuthority("admin", "receptionist", "dentist", "patient")
                        .requestMatchers("/api/appointments/**")
                        .hasAnyAuthority("admin", "receptionist", "patient")

                        // Schedules
                        .requestMatchers(HttpMethod.GET, "/api/doctor-schedules/**")
                        .hasAnyAuthority("admin", "receptionist")
                        .requestMatchers("/api/doctor-schedules/**")
                        .hasAuthority("admin")

                        // Treatments
                        .requestMatchers(HttpMethod.GET, "/api/treatments/**")
                        .hasAnyAuthority("admin", "receptionist", "dentist")
                        .requestMatchers("/api/treatments/**")
                        .hasAuthority("dentist")

                        // Prescriptions
                        .requestMatchers(HttpMethod.GET, "/api/prescriptions/**")
                        .hasAnyAuthority("admin", "receptionist", "dentist", "patient")
                        .requestMatchers("/api/prescriptions/**")
                        .hasAuthority("dentist")

                        // Services
                        .requestMatchers(HttpMethod.GET, "/api/services/**")
                        .authenticated()
                        .requestMatchers("/api/services/**")
                        .hasAuthority("admin")

                        // Medicines
                        .requestMatchers(HttpMethod.GET, "/api/medicines/**")
                        .hasAnyAuthority("admin", "dentist", "receptionist")
                        .requestMatchers("/api/medicines/**")
                        .hasAuthority("admin")

                        // Invoices
                        .requestMatchers(HttpMethod.GET, "/api/invoices/**")
                        .hasAnyAuthority("admin", "receptionist", "patient")
                        .requestMatchers("/api/invoices/**")
                        .hasAnyAuthority("admin", "receptionist")

                        // Reports
                        .requestMatchers("/api/reports/**")
                        .hasAuthority("admin")

                        .anyRequest().authenticated()
                )

                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((req, res, e) -> {
                            res.setStatus(401);
                            res.setContentType("application/json");
                            res.getWriter().write("{\"error\": \"Unauthorized\"}");
                        })
                        .accessDeniedHandler((req, res, e) -> {
                            res.setStatus(403);
                            res.setContentType("application/json");
                            res.getWriter().write("{\"error\": \"Forbidden\"}");
                        })
                )

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}