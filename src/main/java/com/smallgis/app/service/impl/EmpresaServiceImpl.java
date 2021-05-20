package com.smallgis.app.service.impl;

import com.smallgis.app.service.EmpresaService;
import com.smallgis.app.domain.Empresa;
import com.smallgis.app.repository.EmpresaRepository;
import com.smallgis.app.web.rest.dto.EmpresaDTO;
import com.smallgis.app.web.rest.mapper.EmpresaMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing Capa.
 */
@Service
public class EmpresaServiceImpl implements EmpresaService{

    private final Logger log = LoggerFactory.getLogger(EmpresaServiceImpl.class);

    @Inject
    private EmpresaRepository empresaRepository;

    @Inject
    private EmpresaMapper empresaMapper;

    /**
     * Save a empresa when a user gets a plan.
     *
     * @param empresaDTO the entity to save
     * @return the persisted entity
    */
    public EmpresaDTO save(EmpresaDTO empresaDTO) {
        log.debug("Request to save Empresa : {}", empresaDTO);
        Empresa empresa = empresaMapper.empresaDTOToEmpresa(empresaDTO);
        empresa = empresaRepository.save(empresa);
        EmpresaDTO result = empresaMapper.empresaToEmpresaDTO(empresa);
        return result;
    }

    /**
     *  Get all the capas.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    /*public Page<Capa> findAll(Pageable pageable) {
        log.debug("Request to get all Capas");
        Page<Capa> result = capaRepository.findAll(pageable);
        return result;
    }*/

    public EmpresaDTO findOne(String id) {
        log.debug("Request to get Empresa : {}", id);
        Empresa empresa = empresaRepository.findOne(id);
        EmpresaDTO empresaDTO = empresaMapper.empresaToEmpresaDTO(empresa);
        return empresaDTO;
    }
    /**
     *  Get one empresa by empresanit and empresacode
     *
     *  @param 
     *  @return the entity
     */
    public EmpresaDTO findEmpresaNitCode(String empresanit, String empresacode) {
        log.debug("Request to get Empresa : {}", empresanit+" "+empresacode);
        Empresa empresa = empresaRepository.findOneByEmpresanitAndEmpresacode(empresanit,empresacode);
        EmpresaDTO empresaDTO = empresaMapper.empresaToEmpresaDTO(empresa);
        return empresaDTO;
    }
    /**
     *  Get one empresa by empresanit
     *
     *  @param 
     *  @return the entity
    */
    public EmpresaDTO findEmpresaNit(String empresanit) {
    
        Empresa empresa = empresaRepository.findOneByEmpresanit(empresanit);
        //Capa capa = capaRepository.findOneByUsuario(username);
        EmpresaDTO empresaDTO = empresaMapper.empresaToEmpresaDTO(empresa);
        return empresaDTO;
    }
    public EmpresaDTO findEmpresaCode(String empresacode) {
    
        Empresa empresa = empresaRepository.findOneByEmpresacode(empresacode);
        //Capa capa = capaRepository.findOneByUsuario(username);
        EmpresaDTO empresaDTO = empresaMapper.empresaToEmpresaDTO(empresa);
        return empresaDTO;
    }

}
