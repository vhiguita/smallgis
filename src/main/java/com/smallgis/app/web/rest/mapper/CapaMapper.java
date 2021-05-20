package com.smallgis.app.web.rest.mapper;

import com.smallgis.app.domain.*;
import com.smallgis.app.web.rest.dto.CapaDTO;
import com.smallgis.app.web.rest.dto.CapaADTO;

import org.mapstruct.*;
import java.util.List;

/**
 * Mapper for the entity Capa and its DTO CapaDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface CapaMapper {

    CapaDTO capaToCapaDTO(Capa capa);

    CapaADTO capaAToCapaADTO(CapaA capa);

    List<CapaDTO> capasToCapaDTOs(List<Capa> capas);

    List<CapaADTO> capasToCapaADTOs(List<CapaA> capas);

    Capa capaDTOToCapa(CapaDTO capaDTO);

    List<Capa> capaDTOsToCapas(List<CapaDTO> capaDTOs);
}
