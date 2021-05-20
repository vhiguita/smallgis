package com.smallgis.app.web.rest.dto;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;


/**
 * A DTO for the Track entity.
 */
public class AuxtrackDTO implements Serializable {

    private String id;

    @NotNull
    private String empresaid;

    @NotNull
    private String user;

    @NotNull
    private String features;

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getEmpresaid() {
        return empresaid;
    }
    public String getUser() {
        return user;
    }
    public void setUser(String user) {
        this.user = user;
    }
    public void setEmpresaid(String empresaid) {
        this.empresaid = empresaid;
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

        AuxtrackDTO auxtrackDTO = (AuxtrackDTO) o;

        if ( ! Objects.equals(id, auxtrackDTO.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
          return "AuxtrackDTO{" +
                "id=" + id +
                ", empresaid='" + empresaid + "'" +
                ", user='" + user + "'" +
                ", features='" + features + "'" +
                '}';
    }
}
