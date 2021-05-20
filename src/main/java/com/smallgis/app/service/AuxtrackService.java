package com.smallgis.app.service;

import com.smallgis.app.domain.Auxtrack;
import com.smallgis.app.web.rest.dto.AuxtrackDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.LinkedList;
import java.util.List;

/**
 * Service Interface for managing Capa.
 */
public interface AuxtrackService {

    /**
     *  Get the "empresaid" track.
     *
     *  @param empresaid the empresaid of the entity
     *  @return the entity
     */
    AuxtrackDTO  save(AuxtrackDTO auxtrackDTO);
    AuxtrackDTO findOne(String user);
    List<AuxtrackDTO> findTrackCompany(String empresaid);
    void delete(String id);

}
