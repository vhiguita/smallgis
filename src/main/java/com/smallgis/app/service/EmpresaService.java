package com.smallgis.app.service;

import com.smallgis.app.domain.Empresa;
import com.smallgis.app.web.rest.dto.EmpresaDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.LinkedList;
import java.util.List;

/**
 * Service Interface for managing Capa.
 */
public interface EmpresaService {

    /**
     * Save a capa.
     *
     * @param capaDTO the entity to save
     * @return the persisted entity
     */
    EmpresaDTO save(EmpresaDTO empresaDTO);

    /**
     *  Get all the capas.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    //Page<Capa> findAll(Pageable pageable);

    /**
     *  Get the "id" capa.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    EmpresaDTO findOne(String id);
    /**
     *  Get the "Username", "name" capa.
     *
     *  @param username the usuario and name the nombre of the entity
     *  @return the entity
     */
    EmpresaDTO findEmpresaNitCode(String empresanit, String empresacode);

    EmpresaDTO findEmpresaNit(String empresanit);
    EmpresaDTO findEmpresaCode(String empresacode);

}
