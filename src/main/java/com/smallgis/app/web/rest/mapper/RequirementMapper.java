package com.smallgis.app.web.rest.mapper;

import com.smallgis.app.domain.*;
import com.smallgis.app.web.rest.dto.RequirementDTO;

import org.mapstruct.*;
import java.util.List;

/**
 * Mapper for the entity Capa and its DTO CapaDTO.
 */
@Mapper(componentModel = "spring", uses = {})
public interface RequirementMapper {

    RequirementDTO requirementToRequirementDTO(Requirement requirement);
    Requirement requirementDTOToRequirement(RequirementDTO requirementDTO);
    List<RequirementDTO> requirementsToRequirementDTOs(List<Requirement> requirements);
}
