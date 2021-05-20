package com.smallgis.app.web.rest.dto;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;


/**
 * A DTO for the Mapa entity.
 */
public class CostoClienteDTO implements Serializable {

    private String id;

    @NotNull
    private String client;

    @NotNull
    private String device;

    @NotNull
    private String fecha;

    private double costoTotal=0;

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getClient() {
        return client;
    }
    public void setClient(String client){
      this.client=client;
    }
    public String getDevice() {
        return device;
    }
    public void setDevice(String device){
      this.device=device;
    }
    public String getFecha() {
        return fecha;
    }
    public void setFecha(String fecha) {
        this.fecha = fecha;
    }
    public double getCostoTotal(){
        return costoTotal;
    }
    public void setCostoTotal(double costoTotal){
      this.costoTotal=costoTotal;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        CostoClienteDTO costoClienteDTO = (CostoClienteDTO) o;

        if ( ! Objects.equals(id, costoClienteDTO.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "CostoClienteDTO{" +
            "id=" + id +
            ", client='" + client + "'" +
            ", device='" + device + "'" +
            ", fecha='" + fecha + "'" +
            ", costoTotal=" + costoTotal +
            '}';
    }
}
