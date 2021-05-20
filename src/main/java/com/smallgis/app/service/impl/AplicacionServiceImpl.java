package com.smallgis.app.service.impl;

import com.smallgis.app.service.AplicacionService;
import com.smallgis.app.domain.Aplicacion;
import com.smallgis.app.repository.AplicacionRepository;
import com.smallgis.app.web.rest.dto.AplicacionDTO;
import com.smallgis.app.web.rest.mapper.AplicacionMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing Aplicacion.
 */
@Service
public class AplicacionServiceImpl implements AplicacionService{

    private final Logger log = LoggerFactory.getLogger(AplicacionServiceImpl.class);

    @Inject
    private AplicacionRepository aplicacionRepository;

    @Inject
    private AplicacionMapper aplicacionMapper;

    /**
     * Save a aplicacion.
     *
     * @param aplicacionDTO the entity to save
     * @return the persisted entity
     */
    public AplicacionDTO save(AplicacionDTO aplicacionDTO) {
        log.debug("Request to save Aplicacion : {}", aplicacionDTO);
        Aplicacion aplicacion = aplicacionMapper.aplicacionDTOToAplicacion(aplicacionDTO);
        aplicacion = aplicacionRepository.save(aplicacion);
        AplicacionDTO result = aplicacionMapper.aplicacionToAplicacionDTO(aplicacion);
        return result;
    }

    /**
     *  Get all the aplicacions.
     *
     *  @return the list of entities
     */
    public List<AplicacionDTO> findAll() {
        log.debug("Request to get all Aplicacions");
        List<AplicacionDTO> result = aplicacionRepository.findAll().stream()
            .map(aplicacionMapper::aplicacionToAplicacionDTO)
            .collect(Collectors.toCollection(LinkedList::new));
        return result;
    }

    /**
     *  Get one aplicacion by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    public AplicacionDTO findOne(String id) {
        log.debug("Request to get Aplicacion : {}", id);
        Aplicacion aplicacion = aplicacionRepository.findOne(id);
        AplicacionDTO aplicacionDTO = aplicacionMapper.aplicacionToAplicacionDTO(aplicacion);
        return aplicacionDTO;
    }

    public AplicacionDTO findAppUsernameTitle(String username, String title) {
        Aplicacion aplicacion = aplicacionRepository.findOneByUsuarioAndTitulo(username,title);
        AplicacionDTO aplicacionDTO = aplicacionMapper.aplicacionToAplicacionDTO(aplicacion);
        return aplicacionDTO;
    }

    public List<AplicacionDTO> findAppsUser(String username) {
        List<Aplicacion> apps = aplicacionRepository.findOneByUsuario(username);
        List<AplicacionDTO> result=aplicacionMapper.aplicacionsToAplicacionDTOs(apps);
        return result;
    }
    public Long getCountAppsUser(String username){
      Long countApps=aplicacionRepository.countByUsuario(username);
      return countApps;
    }

    /**
     *  Delete the  aplicacion by id.
     *
     *  @param id the id of the entity
     */
    public void delete(String id) {
        log.debug("Request to delete Aplicacion : {}", id);
        aplicacionRepository.delete(id);
    }
}
