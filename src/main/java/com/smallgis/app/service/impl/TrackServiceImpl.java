package com.smallgis.app.service.impl;

import com.smallgis.app.service.TrackService;
import com.smallgis.app.domain.Track;
import com.smallgis.app.repository.TrackRepository;
import com.smallgis.app.web.rest.dto.TrackDTO;
import com.smallgis.app.web.rest.mapper.TrackMapper;
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
public class TrackServiceImpl implements TrackService{

    private final Logger log = LoggerFactory.getLogger(TrackServiceImpl.class);

    @Inject
    private TrackRepository trackRepository;

    @Inject
    private TrackMapper trackMapper;


    /**
     *  Get one capa by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    public TrackDTO findOne(String empresaid) {
        log.debug("Request to get Track : {}", empresaid);
        Track track = trackRepository.findOneByEmpresaid(empresaid);
        TrackDTO trackDTO = trackMapper.trackToTrackDTO(track);
        return trackDTO;
    }
    public TrackDTO save(TrackDTO trackDTO) {
        //log.debug("Request to save Capa : {}", capaDTO);
        Track track = trackMapper.trackDTOToTrack(trackDTO);
        track = trackRepository.save(track);
        TrackDTO result = trackMapper.trackToTrackDTO(track);
        return result;
    }

}
