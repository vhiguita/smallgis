package com.smallgis.app.service;

import com.smallgis.app.domain.Capa;
import com.smallgis.app.domain.CapaA;
import com.smallgis.app.web.rest.dto.CapaDTO;
import com.smallgis.app.web.rest.dto.CapaADTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.LinkedList;
import java.util.List;

/**
 * Service Interface for managing Capa.
 */
public interface CapaService {

    /**
     * Save a capa.
     *
     * @param capaDTO the entity to save
     * @return the persisted entity
     */
    CapaDTO save(CapaDTO capaDTO);

    /**
     *  Get all the capas.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    Page<Capa> findAll(Pageable pageable);

    /**
     *  Get the "id" capa.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    CapaDTO findOne(String id);
    /**
     *  Get the "Username", "name" capa.
     *
     *  @param username the usuario and name the nombre of the entity
     *  @return the entity
     */
    CapaADTO findCapaUsername(String username, String name);
    /**
     *  Get the "Username" capa.
     *
     *  @param username the usuario of the entity
     *  @return the entity
     */
     List<CapaADTO> findCapasUser(String user);

     Long getCountCapasUser(String username);

    /**
     *  Delete the "id" capa.
     *
     *  @param id the id of the entity
     */
    void delete(String id);
}
