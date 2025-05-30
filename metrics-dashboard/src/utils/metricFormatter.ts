export const formatMetric = (metricName) => {
    switch (metricName) {
        case 'cpu_usage_percent':
            return `CPU Usage`;
        case 'ram_usage_percent':
            return `RAM Usage`;
        case 'mongo_connection_pool_size':
            return `Mongo Connection Pool Size`;
        case 'mongo_active_connections':
            return `Mongo Active Connections`;
        case 'mongo_available_connections':
            return `Mongo Available Connections`;
        case 'mongo_query_time_seconds':
            return `Mongo Query Time`;
        case 'mongo_memory_usage_bytes':
            return 'Mongo Memory Usage';
        case 'http_requests_total':
            return 'HTTP Requests Total';
        case 'http_request_duration_seconds':
            return 'HTTP Requests Duration';
        default:
            return metricName;
    }
};
