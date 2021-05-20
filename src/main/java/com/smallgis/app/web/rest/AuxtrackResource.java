package com.smallgis.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.smallgis.app.domain.Auxtrack;
import com.smallgis.app.service.AuxtrackService;
import com.smallgis.app.web.rest.util.HeaderUtil;
import com.smallgis.app.web.rest.util.PaginationUtil;
import com.smallgis.app.web.rest.dto.AuxtrackDTO;
import com.smallgis.app.web.rest.mapper.AuxtrackMapper;
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
public class AuxtrackResource {

    private final Logger log = LoggerFactory.getLogger(AuxtrackResource.class);

    @Inject
    private AuxtrackService auxtrackService;

    @Inject
    private AuxtrackMapper auxtrackMapper;

    /**
     * GET  /capas/:id : get the "id" capa.
     *
     * @param id the id of the capaDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the capaDTO, or with status 404 (Not Found)
     */
    /*@RequestMapping(value = "/auxtracks/{companyid}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<AuxtrackDTO> getTrack(@PathVariable String companyid) {
        //log.debug("REST request to get Capa : {}", id);
        AuxtrackDTO auxtrackDTO = auxtrackService.findOne(companyid);
        return Optional.ofNullable(auxtrackDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }*/
    @RequestMapping(value = "/auxtracks/getAuxtrackUser/{user}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<AuxtrackDTO> getAuxtrackUser(@PathVariable String user) {
        log.debug("REST request to get AUX TRACK USER : {}", user);
        AuxtrackDTO auxtrackDTO = auxtrackService.findOne(user);
        return Optional.ofNullable(auxtrackDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    @RequestMapping(value = "/auxtracks/getAuxtrackCompany/{companyid}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<AuxtrackDTO>> getAuxtrackCompany(@PathVariable String companyid) {
        //log.debug("REST request to get Capa : {}", id);
        List<AuxtrackDTO> auxtracksDTO = auxtrackService.findTrackCompany(companyid);
        return Optional.ofNullable(auxtracksDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @RequestMapping(value = "/auxtracks",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<AuxtrackDTO> createAuxtrack(@Valid @RequestBody AuxtrackDTO auxtrackDTO) throws URISyntaxException {
        log.debug("REST request to save Track : {}", auxtrackDTO);
        if (auxtrackDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("track", "idexists", "A new track cannot already have an ID")).body(null);
        }
        AuxtrackDTO result = auxtrackService.save(auxtrackDTO);
        return ResponseEntity.created(new URI("/api/auxtracks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("auxtrack", result.getId().toString()))
            .body(result);
    }
    @RequestMapping(value = "/auxtracks",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<AuxtrackDTO> updateAuxtrack(@Valid @RequestBody AuxtrackDTO auxtrackDTO) throws URISyntaxException {
        log.debug("REST request to update Track : {}", auxtrackDTO);
        if (auxtrackDTO.getId() == null) {
            return createAuxtrack(auxtrackDTO);
        }
        AuxtrackDTO result = auxtrackService.save(auxtrackDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("track", auxtrackDTO.getId().toString()))
            .body(result);
    }
    @RequestMapping(value = "/auxtracks/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteAuxtrack(@PathVariable String id) {
        log.debug("REST request to delete Track : {}", id);
        auxtrackService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("auxtrack", id.toString())).build();
    }

}
