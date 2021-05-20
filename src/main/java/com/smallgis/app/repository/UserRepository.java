package com.smallgis.app.repository;

import com.smallgis.app.domain.User;

import java.time.ZonedDateTime;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data MongoDB repository for the User entity.
 */
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findOneByActivationKey(String activationKey);

    List<User> findAllByActivatedIsFalseAndCreatedDateBefore(ZonedDateTime dateTime);

    List<User> findAllByIsAdminIsFalseAndBusinessType(String companyCode);

    List<User> findAllByBusinessType(String companyCode);

    Optional<User> findOneByResetKey(String resetKey);

    Optional<User> findOneByEmail(String email);

    Optional<User> findOneByLogin(String login);

    Optional<User> findOneById(String userId);

    @Override
    void delete(User t);

}
