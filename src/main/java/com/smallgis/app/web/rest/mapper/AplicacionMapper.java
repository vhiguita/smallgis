package com.smallgis.app.web.rest.mapper;

import com.smallgis.app.domain.*;
import com.smallgis.app.web.rest.dto.AplicacionDTO;

import org.mapstruct.*;
import java.util.List;

/**
 * Mapper for the entity Aplicacion and its DTO AplicacionDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface AplicacionMapper {

    AplicacionDTO aplicacionToAplicacionDTO(Aplicacion aplicacion);

    List<AplicacionDTO> aplicacionsToAplicacionDTOs(List<Aplicacion> aplicacions);

    Aplicacion aplicacionDTOToAplicacion(AplicacionDTO aplicacionDTO);

    List<Aplicacion> aplicacionDTOsToAplicacions(List<AplicacionDTO> aplicacionDTOs);
}
