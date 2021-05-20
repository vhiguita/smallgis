package com.smallgis.app.domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A Capa.
 */

@Document(collection = "requirement")
public class Requirement implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("reqid")
    private String reqid;

    @NotNull
    @Field("companyid")
    private String companyid;

    @NotNull
    @Field("fecha")
    private String fecha;

    @NotNull
    @Field("features")
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
    public void setReqid(String reqid) {
        this.reqid = reqid;
    }
    public String getCompanyid() {
        return companyid;
    }
    public void setCompanyid(String companyid) {
        this.companyid = companyid;
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
        Requirement requirement = (Requirement) o;
        if(requirement.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, requirement.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
      return "Requirement{" +
            "id=" + id +
            ", reqid='" + reqid + "'" +
            ", companyid='" + companyid + "'" +
            ", fecha='" + fecha + "'" +
            ", features='" + features + "'" +
            '}';
    }
}
