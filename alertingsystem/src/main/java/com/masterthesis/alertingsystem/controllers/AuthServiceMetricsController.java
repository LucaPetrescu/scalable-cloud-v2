package com.masterthesis.alertingsystem.controllers;

import com.masterthesis.alertingsystem.dtos.MetricsResponseDto;
import com.masterthesis.alertingsystem.query.PrometheusQueryService;
import com.masterthesis.alertingsystem.rules.DroolsRuleService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping("/query-metrics")
public class AuthServiceMetricsController {

    private final DroolsRuleService droolsRuleService;
    public AuthServiceMetricsController(DroolsRuleService droolsRuleService) {
        this.droolsRuleService = droolsRuleService;
    }

    @GetMapping("/get-metric")
    public ResponseEntity<MetricsResponseDto> getMetric(@RequestParam(name = "metricName", required = true) String metricName) {
        MetricsResponseDto metricResponseDto = droolsRuleService.getMetric(metricName);
        return new ResponseEntity<>(metricResponseDto, HttpStatus.OK);
    }

    @GetMapping("/get-metrics")
    public ResponseEntity<ArrayList<MetricsResponseDto>> getMetrics() {
        ArrayList<MetricsResponseDto> metricsResponseDtoList = droolsRuleService.getAllMetrics();
        return new ResponseEntity<>(metricsResponseDtoList, HttpStatus.OK);
    }

}
