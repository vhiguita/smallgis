package com.smallgis.app.service;

import com.smallgis.app.domain.CostoCliente;
import com.smallgis.app.web.rest.dto.CostoClienteDTO;

import java.util.LinkedList;
import java.util.List;

/**
 * Service Interface for managing Mapa.
 */
public interface CostoClienteService {

    /**
     * Save a clientecosto.
     *
     * @param costoClienteDTO the entity to save
     * @return the persisted entity
     */
    CostoClienteDTO save(CostoClienteDTO costoClienteDTO);

    /**
     *  Get all the mapas.
     *
     *  @return the list of entities
     */
    //List<CostoClienteDTO> findAll();

    /**
     *  Get the "id" mapa.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    CostoClienteDTO findOne(String id);

    List<CostoClienteDTO> findCostosClienteFecha(String cliente,String fecha);

    void delete(String id);

    //List<MapaDTO> findMapaUsername(String username);
}
