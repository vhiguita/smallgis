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

@Document(collection = "empresa")
public class Empresa implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("empresanit")
    private String empresanit;

    @NotNull
    @Field("empresacode")
    private String empresacode;

    @Size(max = 50)
    @Field("tipo_plan")
    private String tipoPlan;

    @NotNull
    @Field("fecha")
    private String fecha;
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    public String getEmpresaNit() {
        return empresanit;
    }
    public void setEmpresaNit(String empresanit) {
        this.empresanit = empresanit;
    }
    public String getEmpresaCode() {
        return empresacode;
    }
    public void setEmpresaCode(String empresacode) {
        this.empresacode = empresacode;
    }
    public String getTipoPlan() {
        return tipoPlan;
    }
    public void setTipoPlan(String tipoPlan) {
        this.tipoPlan = tipoPlan;
    }
    public String getFecha() {
        return fecha;
    }
    public void setFecha(String fecha) {
        this.fecha = fecha;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Empresa empresa = (Empresa) o;
        if(empresa.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, empresa.id);
    }
    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
    @Override
    public String toString() {
      return "Empresa{" +
            "id=" + id +
            ", empresanit='" + empresanit + "'" +
            ", empresacode='" + empresacode + "'" +
            ", tipo_plan='" + tipoPlan + "'" +
            ", fecha='" + fecha + "'" +
            '}';
    }
}
