package com.smallgis.app.repository;

import com.smallgis.app.domain.Payment;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data MongoDB repository for the Payment entity.
 */
@SuppressWarnings("unused")
public interface PaymentRepository extends MongoRepository<Payment,String> {
 Payment findOneByMerchantId(String merchantId);
}
