package com.smallgis.app.service;

import com.smallgis.app.domain.Payment;
import com.smallgis.app.web.rest.dto.PaymentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.LinkedList;
import java.util.List;

/**
 * Service Interface for managing Payment.
 */
public interface PaymentService {


    PaymentDTO findOne(String merchantId);

}
