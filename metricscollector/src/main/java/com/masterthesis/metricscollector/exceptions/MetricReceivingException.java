package com.masterthesis.metricscollector.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class MetricReceivingException extends RuntimeException {

    public MetricReceivingException(String message) {
        super(message);
    }

}
