package com.smallgis.app.web.rest.mapper;

import com.smallgis.app.domain.*;
import com.smallgis.app.web.rest.dto.AuxtrackDTO;

import org.mapstruct.*;
import java.util.List;

@Mapper(componentModel = "spring", uses = {})
public interface AuxtrackMapper {

    AuxtrackDTO auxtrackToAuxtrackDTO(Auxtrack auxtrack);
    Auxtrack auxtrackDTOToAuxtrack(AuxtrackDTO auxtrackDTO);
    List<AuxtrackDTO> auxtracksToAuxtrackDTOs(List<Auxtrack> auxtracks);
}
