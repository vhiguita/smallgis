package com.smallgis.app.service;

import com.smallgis.app.domain.Aplicacion;
import com.smallgis.app.web.rest.dto.AplicacionDTO;

import java.util.LinkedList;
import java.util.List;

/**
 * Service Interface for managing Aplicacion.
 */
public interface AplicacionService {

    /**
     * Save a aplicacion.
     *
     * @param aplicacionDTO the entity to save
     * @return the persisted entity
     */
    AplicacionDTO save(AplicacionDTO aplicacionDTO);

    /**
     *  Get all the aplicacions.
     *
     *  @return the list of entities
     */
    List<AplicacionDTO> findAll();

    /**
     *  Get the "id" aplicacion.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    AplicacionDTO findOne(String id);

    AplicacionDTO findAppUsernameTitle(String username, String title);

    List<AplicacionDTO> findAppsUser(String username);

    Long getCountAppsUser(String username);

    /**
     *  Delete the "id" aplicacion.
     *
     *  @param id the id of the entity
     */
    void delete(String id);
}
