package com.smallgis.app.web.rest.dto;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;


/**
 * A DTO for the Capa entity.
 */
public class CapaADTO implements Serializable {

    private String id;

    @NotNull
    private String nombre;

    @NotNull
    private String empresa;

    @NotNull
    private String usuario;

    @NotNull
    private String type;

    @NotNull
    private String descripcion;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    public String getEmpresa() {
        return empresa;
    }

    public void setEmpresa(String empresa) {
        this.empresa = empresa;
    }
    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }
    public String getType() {
        return type;
    }
    public void setType(String type){
      this.type=type;
    }
    public String getDescripcion() {
        return descripcion;
    }
    public void setDescripcion(String descripcion){
      this.descripcion=descripcion;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        CapaADTO capaADTO = (CapaADTO) o;

        if ( ! Objects.equals(id, capaADTO.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {

          return "CapaADTO{" +
                "id=" + id +
                ", nombre='" + nombre + "'" +
                ", empresa='" + empresa + "'" +
                ", usuario='" + usuario + "'" +
                ", descripcion='" + descripcion + "'" +
                ", type='" + type + "'" +
                '}';
    }
}
