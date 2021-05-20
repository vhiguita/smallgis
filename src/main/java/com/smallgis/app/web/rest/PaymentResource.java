package com.smallgis.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.smallgis.app.domain.Payment;
import com.smallgis.app.service.PaymentService;
import com.smallgis.app.web.rest.util.HeaderUtil;
import com.smallgis.app.web.rest.util.PaginationUtil;
import com.smallgis.app.web.rest.dto.PaymentDTO;
import com.smallgis.app.web.rest.mapper.PaymentMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * REST controller for managing Capa.
 */
@RestController
@RequestMapping("/api")
public class PaymentResource {

    private final Logger log = LoggerFactory.getLogger(PaymentResource.class);

    @Inject
    private PaymentService paymentService;

    @Inject
    private PaymentMapper paymentMapper;

    /**
     * GET  /payments/:merchantid : get the "id" payment.
     *
     * @param id the id of the paymentDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the paymentDTO, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/payments/{merchantid}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<PaymentDTO> getPayment(@PathVariable String merchantid) {
        log.debug("REST request to get Payment : {}", merchantid);
        PaymentDTO paymentDTO = paymentService.findOne(merchantid);
        return Optional.ofNullable(paymentDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

}
