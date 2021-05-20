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

@Document(collection = "costo")
public class Costo implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("businessCode")
    private String businessCode;

    private double costoRecogida1=0;
    private double costoRecogida2=0;
    private double costoRecogida3=0;
    private double costoEntrega1=0;
    private double costoEntrega2=0;
    private double costoEntrega3=0;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    public String getBusinessCode() {
        return businessCode;
    }
    public void setBusinessCode(String businessCode){
      this.businessCode=businessCode;
    }
    public double getCostoRecogida1(){
        return costoRecogida1;
    }
    public double getCostoRecogida2(){
        return costoRecogida2;
    }
    public double getCostoRecogida3(){
        return costoRecogida3;
    }
    public void setCostoRecogida1(double costoRecogida1){
      this.costoRecogida1=costoRecogida1;
    }
    public void setCostoRecogida2(double costoRecogida2){
      this.costoRecogida2=costoRecogida2;
    }
    public void setCostoRecogida3(double costoRecogida3){
      this.costoRecogida3=costoRecogida3;
    }
    public double getCostoEntrega1(){
        return costoEntrega1;
    }
    public double getCostoEntrega2(){
        return costoEntrega2;
    }
    public double getCostoEntrega3(){
        return costoEntrega3;
    }
    public void setCostoEntrega1(double costoEntrega1){
      this.costoEntrega1=costoEntrega1;
    }
    public void setCostoEntrega2(double costoEntrega2){
      this.costoEntrega2=costoEntrega2;
    }
    public void setCostoEntrega3(double costoEntrega3){
      this.costoEntrega3=costoEntrega3;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Costo costo = (Costo) o;
        if(costo.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, costo.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
      return "Costo{" +
          "id=" + id +
          ", businessCode='" + businessCode + "'" +
          ", costoRecogida1=" + costoRecogida1 +
          ", costoRecogida2=" + costoRecogida2 +
          ", costoRecogida3=" + costoRecogida3 +
          ", costoEntrega1=" + costoEntrega1 +
          ", costoEntrega2=" + costoEntrega2 +
          ", costoEntrega3=" + costoEntrega3 +
          '}';
    }
}
