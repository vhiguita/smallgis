package com.smallgis.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.smallgis.app.domain.Capa;
import com.smallgis.app.service.EmpresaService;
import com.smallgis.app.web.rest.util.HeaderUtil;
import com.smallgis.app.web.rest.util.PaginationUtil;
import com.smallgis.app.web.rest.dto.EmpresaDTO;
import com.smallgis.app.web.rest.mapper.EmpresaMapper;
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
public class EmpresaResource {

    private final Logger log = LoggerFactory.getLogger(CapaResource.class);

    @Inject
    private EmpresaService empresaService;

    @Inject
    private EmpresaMapper empresaMapper;

    //NOTE: empresacode, the same payment code that acquiresa company for some plan

    /**
     * POST  /capas : Create a new capa.
     *
     * @param capaDTO the capaDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new capaDTO, or with status 400 (Bad Request) if the capa has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/empresas",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<EmpresaDTO> createEmpresa(@Valid @RequestBody EmpresaDTO empresaDTO) throws URISyntaxException {
        log.debug("REST request to save Empresa : {}", empresaDTO);
        if (empresaDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("empresa", "idexists", "A new capa cannot already have an ID")).body(null);
        }
        EmpresaDTO result = empresaService.save(empresaDTO);
        return ResponseEntity.created(new URI("/api/empresas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("empresa", result.getId().toString()))
            .body(result);
    }


    /**
     * PUT  /capas : Updates an existing capa.
     *
     * @param empresaDTO the capaDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated capaDTO,
     * or with status 400 (Bad Request) if the capaDTO is not valid,
     * or with status 500 (Internal Server Error) if the capaDTO couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/empresas",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<EmpresaDTO> updateEmpresa(@Valid @RequestBody EmpresaDTO empresaDTO) throws URISyntaxException {
        log.debug("REST request to update Empresa : {}", empresaDTO);
        if (empresaDTO.getId() == null) {
            return createEmpresa(empresaDTO);
        }
        EmpresaDTO result = empresaService.save(empresaDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("empresa", empresaDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /empresas/:empresanit get stored companies by company identification.
     *
     * @param 
     * @return the ResponseEntity with status 200 (OK)
     */

    @RequestMapping(value = "/empresas/{empresanit}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<EmpresaDTO> getEmpresaNit(@PathVariable String empresanit) {
        EmpresaDTO empresaDTO = empresaService.findEmpresaNit(empresanit);
        return Optional.ofNullable(empresaDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }


    /**
     * GET  /empresas/:empresanit/:empresacode: get stored companies by company identification and code.
     *
     * @param 
     * @return the ResponseEntity with status 200 (OK)
     */

    @RequestMapping(value = "/empresas/{empresanit}/{empresacode}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<EmpresaDTO> getEmpresaNitCode(@PathVariable String empresanit,@PathVariable String empresacode ) {
        //log.debug("REST request to get Capa : {}", username+" "+name);
        EmpresaDTO empresaDTO = empresaService.findEmpresaNitCode(empresanit,empresacode);
        return Optional.ofNullable(empresaDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    /**
     * GET  /empresas/getEmpresaCode/:empresacode get stored companies by company payment code.
     *
     * @param 
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/empresas/getEmpresaCode/{empresacode}",
    method = RequestMethod.GET,
    produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<EmpresaDTO> getEmpresaCode(@PathVariable String empresacode) {
        EmpresaDTO empresaDTO = empresaService.findEmpresaCode(empresacode);
        return Optional.ofNullable(empresaDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /capas/:id : delete the "id" capa.
     *
     * @param id the id of the capaDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    /*@RequestMapping(value = "/capas/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteCapa(@PathVariable String id) {
        log.debug("REST request to delete Capa : {}", id);
        capaService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("capa", id.toString())).build();
    }*/

}
