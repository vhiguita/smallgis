package com.smallgis.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.smallgis.app.domain.Costo;
import com.smallgis.app.service.CostoService;
import com.smallgis.app.web.rest.util.HeaderUtil;
import com.smallgis.app.web.rest.dto.CostoDTO;
import com.smallgis.app.web.rest.mapper.CostoMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
/**
 * REST controller for managing the current user's account.
 */
@RestController
@RequestMapping("/api")
public class CostoResource {

    private final Logger log = LoggerFactory.getLogger(CostoResource.class);

    @Inject
    //private CostoRepository costoRepository;
    private CostoMapper costoMapper;

    @Inject
    private CostoService costoService;

    @RequestMapping(value = "/costos/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<CostoDTO> getCapa(@PathVariable String id) {
        log.debug("REST request to get Costo : {}", id);
        CostoDTO costoDTO = costoService.findOne(id);
        return Optional.ofNullable(costoDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * POST  /account : update the current user information.
     *
     * @param userDTO the current user information
     * @return the ResponseEntity with status 200 (OK), or status 400 (Bad Request) or 500 (Internal Server Error) if the user couldn't be updated
     */
     @RequestMapping(value = "/costos",
         method = RequestMethod.POST,
         produces = MediaType.APPLICATION_JSON_VALUE)
     @Timed
     public ResponseEntity<CostoDTO> createCosto(@RequestBody CostoDTO costoDTO) throws URISyntaxException {
         log.debug("REST request to save cost : {}", costoDTO);
         if (costoDTO.getId() != null) {
             return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("cost", "idexists", "A new costo cannot already have an ID")).body(null);
         }
         CostoDTO result = costoService.save(costoDTO);
         return ResponseEntity.created(new URI("/api/costos/" + result.getId()))
             .headers(HeaderUtil.createEntityCreationAlert("costo", result.getId().toString()))
             .body(result);
     }

     @RequestMapping(value = "/costos",
         method = RequestMethod.PUT,
         produces = MediaType.APPLICATION_JSON_VALUE)
     @Timed
     public ResponseEntity<CostoDTO> updateCosto(@RequestBody CostoDTO costoDTO) throws URISyntaxException {
         log.debug("REST request to update Cost : {}", costoDTO);
         if (costoDTO.getId() == null) {
             return createCosto(costoDTO);
         }
         CostoDTO result = costoService.save(costoDTO);
         return ResponseEntity.ok()
             .headers(HeaderUtil.createEntityUpdateAlert("cost", costoDTO.getId().toString()))
             .body(result);
     }
     @RequestMapping(value = "/costos/getCostos/{businessCode}",
         method = RequestMethod.GET,
         produces = MediaType.APPLICATION_JSON_VALUE)
     @Timed
     public ResponseEntity<CostoDTO> getCostoBusinessCode(@PathVariable String businessCode) {
        // log.debug("REST request to get Capa : {}", username+" "+title);
         CostoDTO costoDTO = costoService.findCostoBusinessCode(businessCode);
         return Optional.ofNullable(costoDTO)
             .map(result -> new ResponseEntity<>(
                 result,
                 HttpStatus.OK))
             .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
     }
}
