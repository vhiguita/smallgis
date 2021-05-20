package com.smallgis.app.service;

import com.smallgis.app.domain.Costo;
import com.smallgis.app.web.rest.dto.CostoDTO;

import java.util.LinkedList;
import java.util.List;

/**
 * Service Interface for managing Mapa.
 */
public interface CostoService {

    /**
     * Save a mapa.
     *
     * @param mapaDTO the entity to save
     * @return the persisted entity
     */
    CostoDTO save(CostoDTO costoDTO);

    /**
     *  Get all the mapas.
     *
     *  @return the list of entities
     */
    List<CostoDTO> findAll();

    /**
     *  Get the "id" mapa.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    CostoDTO findOne(String id);

    CostoDTO findCostoBusinessCode(String nit);

    //List<MapaDTO> findMapaUsername(String username);
}
