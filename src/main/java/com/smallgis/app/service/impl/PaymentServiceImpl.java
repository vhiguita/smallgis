package com.smallgis.app.service.impl;

import com.smallgis.app.service.PaymentService;
import com.smallgis.app.domain.Payment;
import com.smallgis.app.repository.PaymentRepository;
import com.smallgis.app.web.rest.dto.PaymentDTO;
import com.smallgis.app.web.rest.mapper.PaymentMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing Capa.
 */
@Service
public class PaymentServiceImpl implements PaymentService{

    private final Logger log = LoggerFactory.getLogger(PaymentServiceImpl.class);

    @Inject
    private PaymentRepository paymentRepository;

    @Inject
    private PaymentMapper paymentMapper;



    /**
     *  Get one capa by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    public PaymentDTO findOne(String merchantId) {
        log.debug("Request to get Capa : {}", merchantId);
        Payment payment = paymentRepository.findOneByMerchantId(merchantId);
        PaymentDTO paymentDTO = paymentMapper.paymentToPaymentDTO(payment);
        return paymentDTO;
    }

}
