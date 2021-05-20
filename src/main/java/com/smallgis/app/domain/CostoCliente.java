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

@Document(collection = "costo_cliente")
public class CostoCliente implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("client")
    private String client;

    @NotNull
    @Field("device")
    private String device;

    @NotNull
    @Field("fecha")
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
        CostoCliente costoCliente = (CostoCliente) o;
        if(costoCliente.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, costoCliente.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
      return "CostoCliente{" +
          "id=" + id +
          ", client='" + client + "'" +
          ", device='" + device + "'" +
          ", fecha='" + fecha + "'" +
          ", costoTotal=" + costoTotal +
          '}';
    }
}
