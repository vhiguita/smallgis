package com.smallgis.app.service.impl;

import com.smallgis.app.service.CostoService;
import com.smallgis.app.domain.Costo;
import com.smallgis.app.repository.CostoRepository;
import com.smallgis.app.web.rest.dto.CostoDTO;
import com.smallgis.app.web.rest.mapper.CostoMapper;
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
public class CostoServiceImpl implements CostoService{

    private final Logger log = LoggerFactory.getLogger(CostoServiceImpl.class);

    @Inject
    private CostoRepository costoRepository;

    @Inject
    private CostoMapper costoMapper;

    /**
     * Save a mapa.
     *
     * @param costoDTO the entity to save
     * @return the persisted entity
     */
    public CostoDTO save(CostoDTO costoDTO) {
        log.debug("Request to save Costo : {}", costoDTO);
        Costo costo = costoMapper.costoDTOToCosto(costoDTO);
        costo = costoRepository.save(costo);
        CostoDTO result = costoMapper.costoToCostoDTO(costo);
        return result;
    }

    /**
     *  Get all the mapas.
     *
     *  @return the list of entities
     */
    public List<CostoDTO> findAll() {
        log.debug("Request to get all costos");
        List<CostoDTO> result = costoRepository.findAll().stream()
            .map(costoMapper::costoToCostoDTO)
            .collect(Collectors.toCollection(LinkedList::new));
        return result;
    }

    /**
     *  Get one mapa by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    public CostoDTO findOne(String id) {
        Costo costo = costoRepository.findOne(id);
        CostoDTO costoDTO = costoMapper.costoToCostoDTO(costo);
        return costoDTO;
    }

    public CostoDTO findCostoBusinessCode(String nit) {
        //log.debug("Request to get Mapa : {}", id);
        Costo costo = costoRepository. findOneByBusinessCode(nit);
        CostoDTO costoDTO = costoMapper.costoToCostoDTO(costo);
        return costoDTO;
    }
}
