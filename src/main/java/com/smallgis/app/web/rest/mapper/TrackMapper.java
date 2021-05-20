package com.smallgis.app.web.rest.mapper;

import com.smallgis.app.domain.*;
import com.smallgis.app.web.rest.dto.TrackDTO;

import org.mapstruct.*;
import java.util.List;

/**
 * Mapper for the entity Capa and its DTO CapaDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface TrackMapper {

    TrackDTO trackToTrackDTO(Track track);
    Track trackDTOToTrack(TrackDTO trackDTO);
}
