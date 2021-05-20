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

@Document(collection = "capa")
public class CapaA implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("nombre")
    private String nombre;

    @NotNull
    @Field("empresa")
    private String empresa;

    @NotNull
    @Field("usuario")
    private String usuario;

    @NotNull
    @Field("descripcion")
    private String descripcion;

    @NotNull
    @Field("type")
    private String type;

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
        CapaA capa = (CapaA) o;
        if(capa.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, capa.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        /*return "Capa{" +
            "id=" + id +
            ", nombre='" + nombre + "'" +
            ", empresa='" + empresa + "'" +
            ", usuario='" + usuario + "'" +
            '}';*/
            return "Capa{" +
                  "id=" + id +
                  ", nombre='" + nombre + "'" +
                  ", empresa='" + empresa + "'" +
                  ", usuario='" + usuario + "'" +
                  ", descripcion='" + descripcion + "'" +
                  ", type='" + type + "'" +
                  '}';
    }
}
