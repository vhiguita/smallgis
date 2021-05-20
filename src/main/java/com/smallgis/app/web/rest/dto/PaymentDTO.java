package com.smallgis.app.web.rest.dto;

import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;


/**
 * A DTO for the Payment entity.
 */
public class PaymentDTO implements Serializable {

    private String id;

    @NotNull
    private String merchantId;

    @NotNull
    private String name;

    @NotNull
    private String apikey;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public String getMerchantId() {
        return merchantId;
    }

    public void setMerchantId(String merchantId) {
        this.merchantId = merchantId;
    }
    public String getApikey() {
        return apikey;
    }
    public void setApikey(String apikey) {
        this.apikey = apikey;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        PaymentDTO paymentDTO = (PaymentDTO) o;

        if ( ! Objects.equals(id, paymentDTO.id)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
          return "PaymentDTO{" +
                "id=" + id +
                ", merchantId='" + merchantId + "'" +
                ", name='" + name + "'" +
                ", apikey='" + apikey + "'" +
                '}';
    }
}
