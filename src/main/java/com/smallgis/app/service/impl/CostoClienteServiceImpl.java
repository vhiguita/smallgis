package com.smallgis.app.service.impl;

import com.smallgis.app.service.CostoClienteService;
import com.smallgis.app.domain.CostoCliente;
import com.smallgis.app.repository.CostoClienteRepository;
import com.smallgis.app.web.rest.dto.CostoClienteDTO;
import com.smallgis.app.web.rest.mapper.CostoClienteMapper;
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
public class CostoClienteServiceImpl implements CostoClienteService{

    private final Logger log = LoggerFactory.getLogger(CostoClienteServiceImpl.class);

    @Inject
    private CostoClienteRepository costoClienteRepository;

    @Inject
    private CostoClienteMapper costoClienteMapper;

    /**
     * Save a mapa.
     *
     * @param costoDTO the entity to save
     * @return the persisted entity
     */
    public CostoClienteDTO save(CostoClienteDTO costoClienteDTO) {
        log.debug("Request to save Costo : {}", costoClienteDTO);
        CostoCliente costoCliente = costoClienteMapper.costoClienteDTOToCostoCliente(costoClienteDTO);
        costoCliente = costoClienteRepository.save(costoCliente);
        CostoClienteDTO result = costoClienteMapper.costoClienteToCostoClienteDTO(costoCliente);
        return result;
    }

    /**
     *  Get one mapa by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    public CostoClienteDTO findOne(String id) {
        CostoCliente costoCliente = costoClienteRepository.findOne(id);
        CostoClienteDTO costoClienteDTO = costoClienteMapper.costoClienteToCostoClienteDTO(costoCliente);
        return costoClienteDTO;
    }

    public List<CostoClienteDTO> findCostosClienteFecha(String cliente, String fecha) {
        List<CostoCliente> costosCliente = costoClienteRepository.findOneByClientAndFecha(cliente,fecha);
        List<CostoClienteDTO> result=costoClienteMapper.costosClienteToCostoClienteDTOs(costosCliente);
        return result;
    }
    public void delete(String id) {
        costoClienteRepository.delete(id);
    }
}
