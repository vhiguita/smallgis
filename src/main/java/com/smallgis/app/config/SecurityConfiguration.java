package com.smallgis.app.config;

import com.smallgis.app.security.*;
import com.smallgis.app.security.jwt.*;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.data.repository.query.SecurityEvaluationContextExtension;


import javax.inject.Inject;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Inject
    private Http401UnauthorizedEntryPoint authenticationEntryPoint;

    @Inject
    private UserDetailsService userDetailsService;

    @Inject
    private TokenProvider tokenProvider;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Inject
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
            .userDetailsService(userDetailsService)
                .passwordEncoder(passwordEncoder());
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring()
            .antMatchers(HttpMethod.OPTIONS, "/**")
            .antMatchers("/app/**/*.{js,html}")
            .antMatchers("/bower_components/**")
            .antMatchers("/i18n/**")
            .antMatchers("/content/**")
            .antMatchers("/swagger-ui/index.html")
            .antMatchers("/test/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .exceptionHandling()
            .authenticationEntryPoint(authenticationEntryPoint)
        .and()
            .csrf()
            .disable()
            .headers()
            .frameOptions()
            .disable()
        .and()
            .sessionManagement()
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        .and()
            .authorizeRequests()
            .antMatchers("/api/users/{companyCode}").permitAll()
            .antMatchers("/api/users/{login}/{state}").permitAll()
            .antMatchers("/api/register").permitAll()
            .antMatchers("/api/activate").permitAll()
            .antMatchers("/api/costos").permitAll()
            .antMatchers("/api/costos/{id}").permitAll()
            .antMatchers("/api/costos/getCostos/{businessCode}").permitAll()
            .antMatchers("/api/mapas/{id}").permitAll()
            .antMatchers("/api/mapas/{username}/{title}").permitAll()
            .antMatchers("/api/payments/{merchantid}").permitAll()
            .antMatchers("/api/getAppsCount").permitAll()
            .antMatchers("/api/getMapasCount").permitAll()
            .antMatchers("/api/getCapasCount").permitAll()
            .antMatchers("/api/empresas").permitAll()
            .antMatchers("/api/empresas/{empresanit}/{empresacode}").permitAll()
            .antMatchers("/api/empresas/{empresanit}").permitAll()
            .antMatchers("/api/aplicacions/{id}").permitAll()
            .antMatchers("/api/aplicacions").permitAll()
            .antMatchers("/api/aplicacions/{id}").permitAll()
            .antMatchers("/api/aplicacions/getApps/{user}").permitAll()
            .antMatchers("/api/aplicacions/{username}/{title}").permitAll()
            .antMatchers("/api/capas").permitAll()
            .antMatchers("/api/capas/getCapas/{user}").permitAll()
            .antMatchers("/api/capas/{username}/{name}").permitAll()
            .antMatchers("/api/capas/{id}").permitAll()
            .antMatchers("/api/requirements").permitAll()
            .antMatchers("/api/requirements/{reqid}").permitAll()
            .antMatchers("/api/requirements/getRequirement/{companyid}/{fecha}").permitAll()
            .antMatchers("/api/auxtracks").permitAll()
            .antMatchers("/api/auxtracks/getAuxtrackCompany/{companyid}").permitAll()
            .antMatchers("/api/auxtracks/getAuxtrackUser/{user}").permitAll()
            .antMatchers("/api/auxtracks/{id}").permitAll()
            .antMatchers("/api/costoscliente").permitAll()
            .antMatchers("/api/costoscliente/{id}").permitAll()
            .antMatchers("/api/costoscliente/getCostos/{cliente}/{fecha}").permitAll()

            .antMatchers("/api/tracks").permitAll()
            .antMatchers("/api/tracks/{companyid}").permitAll()
            .antMatchers("/api/authenticate").permitAll()
            .antMatchers("/api/account/reset_password/init").permitAll()
            .antMatchers("/api/account/reset_password/finish").permitAll()
            .antMatchers("/api/profile-info").permitAll()
            .antMatchers("/api/**").authenticated()
            .antMatchers(org.springframework.http.HttpMethod.OPTIONS, "/api/**").permitAll()
            .antMatchers("/site/**").permitAll() // <<<<< ADD THIS
            .antMatchers("/management/**").hasAuthority(AuthoritiesConstants.ADMIN)
            .antMatchers("/v2/api-docs/**").permitAll()
            .antMatchers("/configuration/ui").permitAll()
            .antMatchers("/swagger-ui/index.html").hasAuthority(AuthoritiesConstants.ADMIN)
        .and()
            .apply(securityConfigurerAdapter());

    }

    private JWTConfigurer securityConfigurerAdapter() {
        return new JWTConfigurer(tokenProvider);
    }

    @Bean
    public SecurityEvaluationContextExtension securityEvaluationContextExtension() {
        return new SecurityEvaluationContextExtension();
    }
}
