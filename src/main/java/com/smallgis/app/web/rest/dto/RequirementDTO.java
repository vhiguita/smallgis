package com.smallgis.app.web.rest.dto;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;


/**
 * A DTO for the Requirement entity.
 */
public class RequirementDTO implements Serializable {

    private String id;

    @NotNull
    private String reqid;

    @NotNull
    private String companyid;

    @NotNull
    private String fecha;

    @NotNull
    private String features;

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getReqid() {
        return reqid;
    }
    public String getCompanyid() {
        return companyid;
    }
    public void setCompanyid(String companyid) {
        this.companyid = companyid;
    }
    public void setReqid(String reqid) {
        this.reqid = reqid;
    }
    public String getFecha() {
        return fecha;
    }
    public void setFecha(String fecha) {
        this.fecha = fecha;
    }
    public String getFeatures() {
        return features;
    }
    public void setFeatures(String features){
      this.features=features;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        RequirementDTO requirementDTO = (RequirementDTO) o;

        if ( ! Objects.equals(id, requirementDTO.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
          return "RequirementDTO{" +
                "id=" + id +
                ", reqid='" + reqid + "'" +
                ", companyid='" + companyid + "'" +
                ", fecha='" + fecha + "'" +
                ", features='" + features + "'" +
                '}';
    }
}
