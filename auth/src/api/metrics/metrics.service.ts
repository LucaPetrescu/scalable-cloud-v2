import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import * as client from 'prom-client';
import axios from 'axios';
import * as os from 'os';

@Injectable()
export class MetricsService implements OnModuleInit {
  //----------------------------------------------------------------------
  //Service Fields
  //----------------------------------------------------------------------

  //System metrics

  private readonly cpuUsageGauge: client.Gauge<string>;
  private readonly memoryUsageGauge: client.Gauge<string>;

  //----------------------------------------------------------------------
  //Constructor
  //----------------------------------------------------------------------

  constructor(
    @Inject('PROM_REGISTRY') private readonly registry: client.Registry,
  ) {
    this.registry = new client.Registry();

    this.cpuUsageGauge = new client.Gauge({
      name: 'cpu_usage_percent',
      help: 'CPU usage percentage',
      registers: [this.registry],
    });

    this.memoryUsageGauge = new client.Gauge({
      name: 'memory_usage_percent',
      help: 'Memory usage in bytes',
      registers: [this.registry],
    });
  }

  //----------------------------------------------------------------------
  //Collecting initialization methods
  //----------------------------------------------------------------------

  onModuleInit() {
    this.startMonitoring();
    this.sendSystemMetricsToCollector();
  }

  //----------------------------------------------------------------------
  //Nest Middleware
  //----------------------------------------------------------------------

  /********************************************************************************** */

  private startMonitoring() {
    setInterval(() => {
      const cpuUsage = this.getCpuUsage();
      const memoryUsage = this.getMemoryUsage();

      this.cpuUsageGauge.set(cpuUsage.cpuUsage);
      this.memoryUsageGauge.set(memoryUsage.memoryUsage);
    }, 5000);
  }

  /********************************************************************************** */

  private async sendSystemMetricsToCollector() {
    setInterval(async () => {
      const cpuMetrics = await this.getCpuMetrics();

      const ramMetrics = await this.getRamMetrics();

      try {
        await axios.post(
          'http://localhost:8080/auth/system-metrics/cpu-metrics',
          cpuMetrics,
          {
            headers: {
              'Content-Type': 'text/plain',
            },
          },
        );

        await axios.post(
          'http://localhost:8080/auth/system-metrics/ram-metrics',
          ramMetrics,
          {
            headers: {
              'Content-Type': 'text/plain',
            },
          },
        );
      } catch (error) {
        console.error('Error sending metrics', error);
      }
    }, 10000);
  }

  //----------------------------------------------------------------------
  //Collecting methods
  //----------------------------------------------------------------------

  private getCpuUsage(): any {
    const usage = process.cpuUsage();
    const cpuUsage =
      (usage.user + usage.system) / (os.cpus().length * 1000 * 1000);
    console.log(`cpuUsage: ${cpuUsage}`);
    return { cpuUsage: cpuUsage };
  }

  /********************************************************************************** */

  private getMemoryUsage(): any {
    const usage = process.memoryUsage();
    const memoryUsage = usage.heapUsed / usage.heapTotal;
    console.log(`memoryUsage: ${memoryUsage}`);
    return { memoryUsage: memoryUsage };
  }

  /********************************************************************************** */
  private async getMetrics(): Promise<string> {
    return await this.registry.metrics();
  }

  private async getCpuMetrics(): Promise<string> {
    return await this.registry.getSingleMetricAsString('cpu_usage_percent');
  }

  private async getRamMetrics(): Promise<string> {
    return await this.registry.getSingleMetricAsString('memory_usage_percent');
  }
}