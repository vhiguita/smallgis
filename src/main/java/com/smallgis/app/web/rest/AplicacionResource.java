package com.smallgis.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.smallgis.app.domain.Aplicacion;
import com.smallgis.app.service.AplicacionService;
import com.smallgis.app.web.rest.util.HeaderUtil;
import com.smallgis.app.web.rest.dto.AplicacionDTO;
import com.smallgis.app.web.rest.mapper.AplicacionMapper;
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
 * REST controller for managing Aplicacion.
 */
@RestController
@RequestMapping("/api")
public class AplicacionResource {

    private final Logger log = LoggerFactory.getLogger(AplicacionResource.class);

    @Inject
    private AplicacionService aplicacionService;

    @Inject
    private AplicacionMapper aplicacionMapper;

    /**
     * POST  /aplicacions : Create a new aplicacion.
     *
     * @param aplicacionDTO the aplicacionDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new aplicacionDTO, or with status 400 (Bad Request) if the aplicacion has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/aplicacions",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<AplicacionDTO> createAplicacion(@RequestBody AplicacionDTO aplicacionDTO) throws URISyntaxException {
        log.debug("REST request to save Aplicacion : {}", aplicacionDTO);
        if (aplicacionDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("aplicacion", "idexists", "A new aplicacion cannot already have an ID")).body(null);
        }
        AplicacionDTO result = aplicacionService.save(aplicacionDTO);
        return ResponseEntity.created(new URI("/api/aplicacions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("aplicacion", result.getId().toString()))
            .body(result);
    }

    @RequestMapping(value = "/getAppsCount",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Long> getCountAppsUser(@RequestParam(value = "username") String username) {

        Long countApps =aplicacionService.getCountAppsUser(username);
        return Optional.ofNullable(countApps)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * PUT  /aplicacions : Updates an existing aplicacion.
     *
     * @param aplicacionDTO the aplicacionDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated aplicacionDTO,
     * or with status 400 (Bad Request) if the aplicacionDTO is not valid,
     * or with status 500 (Internal Server Error) if the aplicacionDTO couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/aplicacions",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<AplicacionDTO> updateAplicacion(@RequestBody AplicacionDTO aplicacionDTO) throws URISyntaxException {
        log.debug("REST request to update Aplicacion : {}", aplicacionDTO);
        if (aplicacionDTO.getId() == null) {
            return createAplicacion(aplicacionDTO);
        }
        AplicacionDTO result = aplicacionService.save(aplicacionDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("aplicacion", aplicacionDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /aplicacions : get all the aplicacions.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of aplicacions in body
     */
    @RequestMapping(value = "/aplicacions",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public List<AplicacionDTO> getAllAplicacions() {
        log.debug("REST request to get all Aplicacions");
        return aplicacionService.findAll();
    }

    /**
     * GET  /aplicacions/:id : get the "id" aplicacion.
     *
     * @param id the id of the aplicacionDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the aplicacionDTO, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/aplicacions/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<AplicacionDTO> getAplicacion(@PathVariable String id) {
        log.debug("REST request to get Aplicacion : {}", id);
        AplicacionDTO aplicacionDTO = aplicacionService.findOne(id);
        return Optional.ofNullable(aplicacionDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @RequestMapping(value = "/aplicacions/{username}/{title}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<AplicacionDTO> getAppUsernameTitle(@PathVariable String username, @PathVariable String title ) {
        log.debug("REST request to get App : {}", username+" "+title);
        AplicacionDTO aplicacionDTO = aplicacionService.findAppUsernameTitle(username,title);
        return Optional.ofNullable(aplicacionDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @RequestMapping(value = "/aplicacions/getApps/{user}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<AplicacionDTO>> getAppsUser(@PathVariable String user) {
        log.debug("REST request to get App : {}", user);
        List<AplicacionDTO> appsDTO = aplicacionService.findAppsUser(user);
        return Optional.ofNullable(appsDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /aplicacions/:id : delete the "id" aplicacion.
     *
     * @param id the id of the aplicacionDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/aplicacions/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteAplicacion(@PathVariable String id) {
        log.debug("REST request to delete Aplicacion : {}", id);
        aplicacionService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("aplicacion", id.toString())).build();
    }

}
