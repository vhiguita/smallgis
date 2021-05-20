package com.smallgis.app.service;

import com.smallgis.app.domain.Mapa;
import com.smallgis.app.web.rest.dto.MapaDTO;

import java.util.LinkedList;
import java.util.List;

/**
 * Service Interface for managing Mapa.
 */
public interface MapaService {

    /**
     * Save a mapa.
     *
     * @param mapaDTO the entity to save
     * @return the persisted entity
     */
    MapaDTO save(MapaDTO mapaDTO);

    /**
     *  Get all the mapas.
     *
     *  @return the list of entities
     */
    List<MapaDTO> findAll();

    /**
     *  Get the "id" mapa.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    MapaDTO findOne(String id);

    MapaDTO findMapaUsernameTitle(String username, String title);

    List<MapaDTO> findMapaUsername(String username);

    Long getCountMapasUser(String username);
    /**
     *  Delete the "id" mapa.
     *
     *  @param id the id of the entity
     */
    void delete(String id);
}
