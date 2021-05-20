package com.smallgis.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.smallgis.app.domain.CostoCliente;
import com.smallgis.app.service.CostoClienteService;
import com.smallgis.app.web.rest.util.HeaderUtil;
import com.smallgis.app.web.rest.dto.CostoClienteDTO;
import com.smallgis.app.web.rest.mapper.CostoClienteMapper;

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
public class CostoClienteResource {

    private final Logger log = LoggerFactory.getLogger(CostoClienteResource.class);

    @Inject
    //private CostoRepository costoRepository;
    private CostoClienteMapper costoClienteMapper;

    @Inject
    private CostoClienteService costoClienteService;

    @RequestMapping(value = "/costoscliente/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<CostoClienteDTO> getCostoCliente(@PathVariable String id) {
        log.debug("REST request to get Costo cliente : {}", id);
        CostoClienteDTO costoClienteDTO = costoClienteService.findOne(id);
        return Optional.ofNullable(costoClienteDTO)
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
     @RequestMapping(value = "/costoscliente",
         method = RequestMethod.POST,
         produces = MediaType.APPLICATION_JSON_VALUE)
     @Timed
     public ResponseEntity<CostoClienteDTO> createCostoCliente(@RequestBody CostoClienteDTO costoClienteDTO) throws URISyntaxException {
         log.debug("REST request to save cliente cost : {}", costoClienteDTO);
         if (costoClienteDTO.getId() != null) {
             return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("cost", "idexists", "A new costo cannot already have an ID")).body(null);
         }
         CostoClienteDTO result = costoClienteService.save(costoClienteDTO);
         return ResponseEntity.created(new URI("/api/costoscliente/" + result.getId()))
             .headers(HeaderUtil.createEntityCreationAlert("costo", result.getId().toString()))
             .body(result);
     }

     @RequestMapping(value = "/costoscliente",
         method = RequestMethod.PUT,
         produces = MediaType.APPLICATION_JSON_VALUE)
     @Timed
     public ResponseEntity<CostoClienteDTO> updateCostoCliente(@RequestBody CostoClienteDTO costoClienteDTO) throws URISyntaxException {
         log.debug("REST request to update Cost : {}", costoClienteDTO);
         if (costoClienteDTO.getId() == null) {
             return createCostoCliente(costoClienteDTO);
         }
         CostoClienteDTO result = costoClienteService.save(costoClienteDTO);
         return ResponseEntity.ok()
             .headers(HeaderUtil.createEntityUpdateAlert("cost", costoClienteDTO.getId().toString()))
             .body(result);
     }
     @RequestMapping(value = "/costoscliente/getCostos/{cliente}/{fecha}",
         method = RequestMethod.GET,
         produces = MediaType.APPLICATION_JSON_VALUE)
     @Timed
     public ResponseEntity<List<CostoClienteDTO>> getCostosClienteFecha(@PathVariable String cliente, @PathVariable String fecha) {
        // log.debug("REST request to get Capa : {}", username+" "+title);
         List<CostoClienteDTO> costosClienteDTO = costoClienteService.findCostosClienteFecha(cliente, fecha);
         return Optional.ofNullable(costosClienteDTO)
             .map(result -> new ResponseEntity<>(
                 result,
                 HttpStatus.OK))
             .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
     }
    @RequestMapping(value = "/costoscliente/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteCostoCliente(@PathVariable String id) {
        log.debug("REST request to delete Track : {}", id);
        costoClienteService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("auxtrack", id.toString())).build();
    }
}
