package com.smallgis.app.service;

import com.smallgis.app.domain.Track;
import com.smallgis.app.web.rest.dto.TrackDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.LinkedList;
import java.util.List;

/**
 * Service Interface for managing Capa.
 */
public interface TrackService {

    /**
     *  Get the "empresaid" track.
     *
     *  @param empresaid the empresaid of the entity
     *  @return the entity
     */
    TrackDTO  save(TrackDTO trackDTO);
    TrackDTO findOne(String empresaid);

}
