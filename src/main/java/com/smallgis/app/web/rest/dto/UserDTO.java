package com.smallgis.app.web.rest.dto;

import com.smallgis.app.config.Constants;

import com.smallgis.app.domain.Authority;
import com.smallgis.app.domain.User;

import org.hibernate.validator.constraints.Email;

import javax.validation.constraints.*;
import java.util.Set;
import java.util.stream.Collectors;
/**
 * A DTO representing a user, with his authorities.
 */
public class UserDTO {

    @NotNull
    @Pattern(regexp = Constants.LOGIN_REGEX)
    @Size(min = 1, max = 50)
    private String login;

    @Size(max = 50)
    private String firstName;

    @Size(max = 50)
    private String lastName;

    @Size(max = 50)
    private String businessType;

    @Size(max = 50)
    private String businessCode;

    @Size(max = 100)
    private String businessName;

    @Size(max = 2)
    private String countryCode;

    @Size(max = 20)
    private String userPlan;

    @Email
    @Size(min = 5, max = 100)
    private String email;

    private boolean activated = false;

    private boolean isAdmin = false;

    @Size(min = 2, max = 5)
    private String langKey;

    private Set<String> authorities;

    public UserDTO() {
    }

    public UserDTO(User user) {
        this(user.getLogin(),user.getFirstName(), user.getLastName(),
            user.getEmail(),user.getBusinessType(),user.getBusinessCode(),user.getBusinessName(),user.getCountryCode(),user.getUserPlan(),user.getActivated(),user.getIsAdmin(), user.getLangKey(),
            user.getAuthorities().stream().map(Authority::getName)
                .collect(Collectors.toSet()));
    }

    public UserDTO(String login, String firstName, String lastName,
        String email, String businessType, String businessCode, String businessName, String countryCode, String userPlan, boolean activated, boolean isAdmin, String langKey, Set<String> authorities) {

        this.login = login;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.businessType=businessType;
        this.businessCode=businessCode;
        this.businessName=businessName;
        this.countryCode=countryCode;
        this.userPlan=userPlan;
        this.activated = activated;
        this.isAdmin=isAdmin;
        this.langKey = langKey;
        this.authorities = authorities;
    }

    public String getLogin() {
        return login;
    }
    public String getFirstName() {
        return firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public String getEmail() {
        return email;
    }
    public String getBusinessType() {
        return businessType;
    }
    public String getBusinessCode() {
        return businessCode;
    }
    public String getBusinessName() {
        return businessName;
    }
    public String getCountryCode() {
        return countryCode;
    }
    public String getUserPlan() {
        return userPlan;
    }
    public boolean isActivated() {
        return activated;
    }
    public boolean getIsAdmin() {
        return isAdmin;
    }
    public String getLangKey() {
        return langKey;
    }
    public Set<String> getAuthorities() {
        return authorities;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
            "login='" + login + '\'' +
            ", firstName='" + firstName + '\'' +
            ", lastName='" + lastName + '\'' +
            ", email='" + email + '\'' +
            ", businessType='" + businessType + '\'' +
            ", businessCode='" + businessCode + '\'' +
            ", businessName='" + businessName + '\'' +
            ", countryCode='" + countryCode + '\'' +
            ", userPlan='" + userPlan + '\'' +
            ", activated=" + activated +
            ", isAdmin=" + isAdmin +
            ", langKey='" + langKey + '\'' +
            ", authorities=" + authorities +
            "}";
    }
}
