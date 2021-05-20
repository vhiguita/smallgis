package com.smallgis.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.smallgis.app.domain.Track;
import com.smallgis.app.service.TrackService;
import com.smallgis.app.web.rest.util.HeaderUtil;
import com.smallgis.app.web.rest.util.PaginationUtil;
import com.smallgis.app.web.rest.dto.TrackDTO;
import com.smallgis.app.web.rest.mapper.TrackMapper;
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
public class TrackResource {

    private final Logger log = LoggerFactory.getLogger(TrackResource.class);

    @Inject
    private TrackService trackService;

    @Inject
    private TrackMapper trackMapper;

    /**
     * GET  /capas/:id : get the "id" capa.
     *
     * @param id the id of the capaDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the capaDTO, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/tracks/{companyid}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<TrackDTO> getTrack(@PathVariable String companyid) {
        //log.debug("REST request to get Capa : {}", id);
        TrackDTO trackDTO = trackService.findOne(companyid);
        return Optional.ofNullable(trackDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @RequestMapping(value = "/tracks",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<TrackDTO> createTrack(@Valid @RequestBody TrackDTO trackDTO) throws URISyntaxException {
        log.debug("REST request to save Track : {}", trackDTO);
        if (trackDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("track", "idexists", "A new track cannot already have an ID")).body(null);
        }
        TrackDTO result = trackService.save(trackDTO);
        return ResponseEntity.created(new URI("/api/tracks/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("track", result.getId().toString()))
            .body(result);
    }
    @RequestMapping(value = "/tracks",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<TrackDTO> updateTrack(@Valid @RequestBody TrackDTO trackDTO) throws URISyntaxException {
        log.debug("REST request to update Track : {}", trackDTO);
        if (trackDTO.getId() == null) {
            return createTrack(trackDTO);
        }
        TrackDTO result = trackService.save(trackDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("track", trackDTO.getId().toString()))
            .body(result);
    }

}
