package com.smallgis.app.service.impl;

import com.smallgis.app.service.MapaService;
import com.smallgis.app.domain.Mapa;
import com.smallgis.app.repository.MapaRepository;
import com.smallgis.app.web.rest.dto.MapaDTO;
import com.smallgis.app.web.rest.mapper.MapaMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import javax.inject.Inject;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing Mapa.
 */
@Service
public class MapaServiceImpl implements MapaService{

    private final Logger log = LoggerFactory.getLogger(MapaServiceImpl.class);

    @Inject
    private MapaRepository mapaRepository;

    @Inject
    private MapaMapper mapaMapper;

    /**
     * Save a mapa.
     *
     * @param mapaDTO the entity to save
     * @return the persisted entity
     */
    public MapaDTO save(MapaDTO mapaDTO) {
        log.debug("Request to save Mapa : {}", mapaDTO);
        Mapa mapa = mapaMapper.mapaDTOToMapa(mapaDTO);
        mapa = mapaRepository.save(mapa);
        MapaDTO result = mapaMapper.mapaToMapaDTO(mapa);
        return result;
    }

    /**
     *  Get all the mapas.
     *
     *  @return the list of entities
     */
    public List<MapaDTO> findAll() {
        log.debug("Request to get all Mapas");
        List<MapaDTO> result = mapaRepository.findAll().stream()
            .map(mapaMapper::mapaToMapaDTO)
            .collect(Collectors.toCollection(LinkedList::new));
        return result;
    }

    /**
     *  Get one mapa by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    public MapaDTO findOne(String id) {
        log.debug("Request to get Mapa : {}", id);
        Mapa mapa = mapaRepository.findOne(id);
        MapaDTO mapaDTO = mapaMapper.mapaToMapaDTO(mapa);
        return mapaDTO;
    }

    public MapaDTO findMapaUsernameTitle(String username, String title) {
        //log.debug("Request to get Mapa : {}", id);
        Mapa mapa = mapaRepository.findOneByUsuarioAndTitulo(username,title);
        MapaDTO mapaDTO = mapaMapper.mapaToMapaDTO(mapa);
        return mapaDTO;
    }

    public List<MapaDTO> findMapaUsername(String user) {
        log.debug("Request to get Capa : {}", user);
        List<Mapa> mapas = mapaRepository.findOneByUsuario(user);
        List<MapaDTO> result=mapaMapper.mapasToMapaDTOs(mapas);
        return result;
    }
    public Long getCountMapasUser(String username){
      Long countMapas=mapaRepository.countByUsuario(username);
      return countMapas;
    }

    /**
     *  Delete the  mapa by id.
     *
     *  @param id the id of the entity
     */
    public void delete(String id) {
        log.debug("Request to delete Mapa : {}", id);
        mapaRepository.delete(id);
    }
}
