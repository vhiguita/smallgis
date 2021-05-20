package com.smallgis.app.service.impl;

import com.smallgis.app.service.CapaService;
import com.smallgis.app.domain.Capa;
import com.smallgis.app.domain.CapaA;
import com.smallgis.app.repository.CapaRepository;
import com.smallgis.app.web.rest.dto.CapaDTO;
import com.smallgis.app.web.rest.dto.CapaADTO;
import com.smallgis.app.web.rest.mapper.CapaMapper;
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
public class CapaServiceImpl implements CapaService{

    private final Logger log = LoggerFactory.getLogger(CapaServiceImpl.class);

    @Inject
    private CapaRepository capaRepository;

    @Inject
    private CapaMapper capaMapper;

    /**
     * Save a capa.
     *
     * @param capaDTO the entity to save
     * @return the persisted entity
     */
    public CapaDTO save(CapaDTO capaDTO) {
        log.debug("Request to save Capa : {}", capaDTO);
        Capa capa = capaMapper.capaDTOToCapa(capaDTO);
        capa = capaRepository.save(capa);
        CapaDTO result = capaMapper.capaToCapaDTO(capa);
        return result;
    }

    /**
     *  Get all the capas.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    public Page<Capa> findAll(Pageable pageable) {
        log.debug("Request to get all Capas");
        Page<Capa> result = capaRepository.findAll(pageable);
        return result;
    }

    /**
     *  Get one capa by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    public CapaDTO findOne(String id) {
        log.debug("Request to get Capa : {}", id);
        Capa capa = capaRepository.findOne(id);
        CapaDTO capaDTO = capaMapper.capaToCapaDTO(capa);
        return capaDTO;
    }
    /**
     *  Get one capa by username and name
     *
     *  @param id the username and name of the entity
     *  @return the entity
     */
    public CapaADTO findCapaUsername(String username, String name) {
        log.debug("Request to get Capa : {}", username+" "+name);
        CapaA capaA = capaRepository.findOneByUsuarioAndNombre(username,name);
        //Capa capa = capaRepository.findOneByUsuario(username);
        CapaADTO capaADTO = capaMapper.capaAToCapaADTO(capaA);
        return capaADTO;
    }

    /**
     *  Get one capa by username
     *
     *  @param id the username of the entity
     *  @return the entity
     */
    public List<CapaADTO> findCapasUser(String user) {
        log.debug("Request to get Capa : {}", user);
        List<CapaA> capas = capaRepository.findOneByUsuario(user);
        List<CapaADTO> result=capaMapper.capasToCapaADTOs(capas);
        //Capa capa = capaRepository.findOneByUsuario(username);
        //Page<Capa> capaDTO = capaMapper.capaToCapaDTO(capa);
        return result;
    }
    public Long getCountCapasUser(String username){
      Long countCapas=capaRepository.countByUsuario(username);
      return countCapas;
    }

    /**
     *  Delete the  capa by id.
     *
     *  @param id the id of the entity
     */
    public void delete(String id) {
        log.debug("Request to delete Capa : {}", id);
        capaRepository.delete(id);
    }
}
