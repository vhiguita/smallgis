package com.smallgis.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.smallgis.app.domain.Requirement;
import com.smallgis.app.service.RequirementService;
import com.smallgis.app.web.rest.util.HeaderUtil;
import com.smallgis.app.web.rest.util.PaginationUtil;
import com.smallgis.app.web.rest.dto.RequirementDTO;
import com.smallgis.app.web.rest.mapper.RequirementMapper;
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
public class RequirementResource {

    private final Logger log = LoggerFactory.getLogger(RequirementResource.class);

    @Inject
    private RequirementService requirementService;

    @Inject
    private RequirementMapper requirementMapper;

    /**
     * GET  /capas/:id : get the "id" capa.
     *
     * @param id the id of the capaDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the capaDTO, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/requirements/{reqid}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<RequirementDTO> getRequirement(@PathVariable String reqid) {
        //log.debug("REST request to get Capa : {}", id);
        RequirementDTO requirementDTO = requirementService.findOne(reqid);
        return Optional.ofNullable(requirementDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @RequestMapping(value = "/requirements",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<RequirementDTO> createRequirement(@Valid @RequestBody RequirementDTO requirementDTO) throws URISyntaxException {
        log.debug("REST request to save Requirement : {}", requirementDTO);
        if (requirementDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("requirement", "idexists", "A new requirement cannot already have an ID")).body(null);
        }
        RequirementDTO result = requirementService.save(requirementDTO);
        return ResponseEntity.created(new URI("/api/requirements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("requirement", result.getId().toString()))
            .body(result);
    }
    @RequestMapping(value = "/requirements",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<RequirementDTO> updateRequirement(@Valid @RequestBody RequirementDTO requirementDTO) throws URISyntaxException {
        log.debug("REST request to update Requirement : {}", requirementDTO);
        if (requirementDTO.getId() == null) {
            return createRequirement(requirementDTO);
        }
        RequirementDTO result = requirementService.save(requirementDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("requirement", requirementDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /requirements/getRequirement/:companyid/:fecha, get stored requirement layers by companyid and date.
     *
     * @param companyid and current date (fecha)
     * @return the ResponseEntity with status 200 (OK)
     */

    @RequestMapping(value = "/requirements/getRequirement/{companyid}/{fecha}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<RequirementDTO>> getRequirementCompany(@PathVariable String companyid,@PathVariable String fecha) {
 
        List<RequirementDTO> requirementDTO = requirementService.findRequirementCompanyidFecha(companyid,fecha);
  
        return Optional.ofNullable(requirementDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

}
