package com.smallgis.app.web.rest.dto;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;


/**
 * A DTO for the Empresa entity.
 */
public class EmpresaDTO implements Serializable {

    private String id;

    @NotNull
    private String empresanit;

    @NotNull
    private String empresacode;

    @NotNull
    private String tipoPlan;

    @NotNull
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

        EmpresaDTO empresaDTO = (EmpresaDTO) o;

        if ( ! Objects.equals(id, empresaDTO.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
          return "EmpresaDTO{" +
                "id=" + id +
                ", empresanit='" + empresanit + "'" +
                ", empresacode='" + empresacode + "'" +
                ", tipo_plan='" + tipoPlan + "'" +
                ", fecha='" + fecha + "'" +
                '}';
    }
}
