package com.smallgis.app.web.rest.mapper;

import com.smallgis.app.domain.*;
import com.smallgis.app.web.rest.dto.CostoClienteDTO;

import org.mapstruct.*;
import java.util.List;

/**
 * Mapper for the entity Mapa and its DTO MapaDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface CostoClienteMapper {

    CostoClienteDTO costoClienteToCostoClienteDTO(CostoCliente costoCliente);

    List<CostoClienteDTO> costosClienteToCostoClienteDTOs(List<CostoCliente> costosCliente);

    CostoCliente costoClienteDTOToCostoCliente(CostoClienteDTO costoClienteDTO);

    List<CostoCliente> costoClienteDTOsToCostosCliente(List<CostoClienteDTO> costosClienteDTOs);
}
