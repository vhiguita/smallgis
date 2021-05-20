package com.smallgis.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.smallgis.app.domain.Capa;
import com.smallgis.app.service.CapaService;
import com.smallgis.app.web.rest.util.HeaderUtil;
import com.smallgis.app.web.rest.util.PaginationUtil;
import com.smallgis.app.web.rest.dto.CapaDTO;
import com.smallgis.app.web.rest.dto.CapaADTO;
import com.smallgis.app.web.rest.mapper.CapaMapper;
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
public class CapaResource {

    private final Logger log = LoggerFactory.getLogger(CapaResource.class);

    @Inject
    private CapaService capaService;

    @Inject
    private CapaMapper capaMapper;

    /**
     * POST  /capas : Create a new capa.
     *
     * @param capaDTO the capaDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new capaDTO, or with status 400 (Bad Request) if the capa has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/capas",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<CapaDTO> createCapa(@Valid @RequestBody CapaDTO capaDTO) throws URISyntaxException {
        log.debug("REST request to save Capa : {}", capaDTO);
        if (capaDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("capa", "idexists", "A new capa cannot already have an ID")).body(null);
        }
        CapaDTO result = capaService.save(capaDTO);
        return ResponseEntity.created(new URI("/api/capas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("capa", result.getId().toString()))
            .body(result);
    }

    /*@RequestMapping(value = "/capas/newCapa",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<CapaDTO> createNewCapa(@Valid @RequestBody CapaDTO capaDTO) throws URISyntaxException {
        log.debug("REST request to save Capa : {}", capaDTO);
        if (capaDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("capa", "idexists", "A new capa cannot already have an ID")).body(null);
        }
        CapaDTO result = capaService.save(capaDTO);
        return ResponseEntity.created(new URI("/api/capas/newCapa" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("capa", result.getId().toString()))
            .body(result);
    }*/

    /**
     * PUT  /capas : Updates an existing capa.
     *
     * @param capaDTO the capaDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated capaDTO,
     * or with status 400 (Bad Request) if the capaDTO is not valid,
     * or with status 500 (Internal Server Error) if the capaDTO couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/capas",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<CapaDTO> updateCapa(@Valid @RequestBody CapaDTO capaDTO) throws URISyntaxException {
        log.debug("REST request to update Capa : {}", capaDTO);
        if (capaDTO.getId() == null) {
            return createCapa(capaDTO);
        }
        CapaDTO result = capaService.save(capaDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("capa", capaDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /capas : get all the capas.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of capas in body
     * @throws URISyntaxException if there is an error to generate the pagination HTTP headers
     */
    @RequestMapping(value = "/capas",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public ResponseEntity<List<CapaDTO>> getAllCapas(Pageable pageable)
        throws URISyntaxException {
        log.debug("REST request to get a page of Capas");
        Page<Capa> page = capaService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/capas");
        return new ResponseEntity<>(capaMapper.capasToCapaDTOs(page.getContent()), headers, HttpStatus.OK);
    }

    /**
     * GET  /capas/:id : get the "id" capa.
     *
     * @param id the id of the capaDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the capaDTO, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/capas/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<CapaDTO> getCapa(@PathVariable String id) {
        log.debug("REST request to get Capa : {}", id);
        CapaDTO capaDTO = capaService.findOne(id);
        return Optional.ofNullable(capaDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * GET  /capas/:username/:name : get stored layers by username.
     *
     * @param username the usuario of the capaADTO, name the nombre of the capaADTO to retrieve
     * @return the ResponseEntity with status 200 (OK)
     */

    @RequestMapping(value = "/capas/{username}/{name}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<CapaADTO> getCapaUsername(@PathVariable String username,@PathVariable String name ) {
        log.debug("REST request to get Capa : {}", username+" "+name);
        CapaADTO capaADTO = capaService.findCapaUsername(username,name);
        return Optional.ofNullable(capaADTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * GET  /capas/getCapas/:user : get stored layers by username.
     *
     * @param user the usuario of the capaADTO to retrieve
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/capas/getCapas/{user}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<CapaADTO>> getCapasUser(@PathVariable String user) {
        log.debug("REST request to get Capa : {}", user);
        //List<CapaDTO> capaDTO = capaService.findCapasUser(user);
        List<CapaADTO> capasDTO = capaService.findCapasUser(user);
        /*HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/capas/getCapas/{user}");
        return new ResponseEntity<>(capaMapper.capasToCapaDTOs(page.getContent()), headers, HttpStatus.OK);*/
        return Optional.ofNullable(capasDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @RequestMapping(value = "/getCapasCount",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Long> getCountCapasUser(@RequestParam(value = "username") String username) {

        Long contCapas =capaService.getCountCapasUser(username);
        return Optional.ofNullable(contCapas)
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
    @RequestMapping(value = "/capas/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteCapa(@PathVariable String id) {
        log.debug("REST request to delete Capa : {}", id);
        capaService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("capa", id.toString())).build();
    }

}
