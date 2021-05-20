package com.smallgis.app.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.smallgis.app.domain.Mapa;
import com.smallgis.app.service.MapaService;
import com.smallgis.app.web.rest.util.HeaderUtil;
import com.smallgis.app.web.rest.dto.MapaDTO;
import com.smallgis.app.web.rest.mapper.MapaMapper;
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
 * REST controller for managing Mapa.
 */
@RestController
@RequestMapping("/api")
public class MapaResource {

    private final Logger log = LoggerFactory.getLogger(MapaResource.class);

    @Inject
    private MapaService mapaService;

    @Inject
    private MapaMapper mapaMapper;

    /**
     * POST  /mapas : Create a new mapa.
     *
     * @param mapaDTO the mapaDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new mapaDTO, or with status 400 (Bad Request) if the mapa has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/mapas",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<MapaDTO> createMapa(@RequestBody MapaDTO mapaDTO) throws URISyntaxException {
        log.debug("REST request to save Mapa : {}", mapaDTO);
        if (mapaDTO.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("mapa", "idexists", "A new mapa cannot already have an ID")).body(null);
        }
        MapaDTO result = mapaService.save(mapaDTO);
        return ResponseEntity.created(new URI("/api/mapas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("mapa", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /mapas : Updates an existing mapa.
     *
     * @param mapaDTO the mapaDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated mapaDTO,
     * or with status 400 (Bad Request) if the mapaDTO is not valid,
     * or with status 500 (Internal Server Error) if the mapaDTO couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/mapas",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<MapaDTO> updateMapa(@RequestBody MapaDTO mapaDTO) throws URISyntaxException {
        log.debug("REST request to update Mapa : {}", mapaDTO);
        if (mapaDTO.getId() == null) {
            return createMapa(mapaDTO);
        }
        MapaDTO result = mapaService.save(mapaDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("mapa", mapaDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /mapas : get all the mapas.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of mapas in body
     */
    @RequestMapping(value = "/mapas",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    @Transactional(readOnly = true)
    public List<MapaDTO> getAllMapas() {
        log.debug("REST request to get all Mapas");
        return mapaService.findAll();
    }

    /**
     * GET  /mapas/:id : get the "id" mapa.
     *
     * @param id the id of the mapaDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the mapaDTO, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/mapas/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<MapaDTO> getMapa(@PathVariable String id) {
        log.debug("REST request to get Mapa : {}", id);
        MapaDTO mapaDTO = mapaService.findOne(id);
        return Optional.ofNullable(mapaDTO)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }
    /**
     * GET  /capas/getMapas/:user : get stored mapas by username.
     *
     * @param user the usuario of the mapaDTO to retrieve
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/mapas/getMapas/{user}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<List<MapaDTO>> getMapasUser(@PathVariable String user) {
        log.debug("REST request to get Capa : {}", user);

        List<MapaDTO> mapasDTO = mapaService.findMapaUsername(user);

        return Optional.ofNullable(mapasDTO)
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

      @RequestMapping(value = "/mapas/{username}/{title}",
          method = RequestMethod.GET,
          produces = MediaType.APPLICATION_JSON_VALUE)
      @Timed
      public ResponseEntity<MapaDTO> getMapaUsernameTitle(@PathVariable String username, @PathVariable String title ) {
          log.debug("REST request to get Capa : {}", username+" "+title);
          MapaDTO mapaDTO = mapaService.findMapaUsernameTitle(username,title);
          return Optional.ofNullable(mapaDTO)
              .map(result -> new ResponseEntity<>(
                  result,
                  HttpStatus.OK))
              .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
      }


      @RequestMapping(value = "/getMapasCount",
          method = RequestMethod.GET,
          produces = MediaType.APPLICATION_JSON_VALUE)
      @Timed
      public ResponseEntity<Long> getCountMapasUser(@RequestParam(value = "username") String username) {

          Long contMapas =mapaService.getCountMapasUser(username);
          return Optional.ofNullable(contMapas)
              .map(result -> new ResponseEntity<>(
                  result,
                  HttpStatus.OK))
              .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
      }
    /**
     * DELETE  /mapas/:id : delete the "id" mapa.
     *
     * @param id the id of the mapaDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/mapas/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteMapa(@PathVariable String id) {
        log.debug("REST request to delete Mapa : {}", id);
        mapaService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("mapa", id.toString())).build();
    }

}
