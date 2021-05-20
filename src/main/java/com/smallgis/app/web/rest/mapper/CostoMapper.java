package com.smallgis.app.web.rest.mapper;

import com.smallgis.app.domain.*;
import com.smallgis.app.web.rest.dto.CostoDTO;

import org.mapstruct.*;
import java.util.List;

/**
 * Mapper for the entity Mapa and its DTO MapaDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface CostoMapper {

    CostoDTO costoToCostoDTO(Costo costo);

    List<CostoDTO> costosToCostoDTOs(List<Costo> costos);

    Costo costoDTOToCosto(CostoDTO costoDTO);

    List<Costo> costoDTOsToCostos(List<CostoDTO> costoDTOs);
}
