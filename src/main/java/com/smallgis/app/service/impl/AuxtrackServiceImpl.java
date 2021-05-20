package com.smallgis.app.service.impl;

import com.smallgis.app.service.AuxtrackService;
import com.smallgis.app.domain.Auxtrack;
import com.smallgis.app.repository.AuxtrackRepository;
import com.smallgis.app.web.rest.dto.AuxtrackDTO;
import com.smallgis.app.web.rest.mapper.AuxtrackMapper;
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
 * Service Implementation for managing Track.
 */
@Service
public class AuxtrackServiceImpl implements AuxtrackService{

    private final Logger log = LoggerFactory.getLogger(AuxtrackServiceImpl.class);

    @Inject
    private AuxtrackRepository auxtrackRepository;

    @Inject
    private AuxtrackMapper auxtrackMapper;


    /**
     *  Get one capa by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    public AuxtrackDTO findOne(String user) {
        log.debug("Request to get auxTrack : {}", user);
        Auxtrack auxtrack = auxtrackRepository.findOneByUser(user);
        AuxtrackDTO auxtrackDTO = auxtrackMapper.auxtrackToAuxtrackDTO(auxtrack);
        return auxtrackDTO;
    }
    //Find all the last current tracks by company
    public List<AuxtrackDTO> findTrackCompany(String empresaid) {
        List<Auxtrack> auxtracks = auxtrackRepository.findOneByEmpresaid(empresaid);
        List<AuxtrackDTO> result=auxtrackMapper.auxtracksToAuxtrackDTOs(auxtracks);
        return result;
    }
    public AuxtrackDTO save(AuxtrackDTO auxtrackDTO) {
        //log.debug("Request to save Capa : {}", capaDTO);
        Auxtrack auxtrack = auxtrackMapper.auxtrackDTOToAuxtrack(auxtrackDTO);
        auxtrack = auxtrackRepository.save(auxtrack);
        AuxtrackDTO result = auxtrackMapper.auxtrackToAuxtrackDTO(auxtrack);
        return result;
    }
    public void delete(String id) {
        auxtrackRepository.delete(id);
    }
}
