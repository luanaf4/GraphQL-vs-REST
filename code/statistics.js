import { createReadStream } from 'fs';
import csv from 'csv-parser';
import { createObjectCsvWriter } from 'csv-writer';

const results = [];

// Função para calcular estatísticas básicas
function calculateStats(numbers) {
    const n = numbers.length;
    if (n === 0) return { mean: 0, median: 0, stdDev: 0, sum: 0 };

    // Soma
    const sum = numbers.reduce((a, b) => a + b, 0);
    
    // Média
    const mean = sum / n;

    // Mediana
    const sorted = [...numbers].sort((a, b) => a - b);
    const median = n % 2 === 0 
        ? (sorted[n/2 - 1] + sorted[n/2]) / 2 
        : sorted[Math.floor(n/2)];

    // Desvio Padrão
    const stdDev = Math.sqrt(
        numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n
    );

    return { mean, median, stdDev, sum };
}

// Lê o arquivo CSV e processa os dados
createReadStream('experiment_results.csv')
    .pipe(csv())
    .on('data', (data) => {
        results.push({
            repository: data.REPOSITORY,
            query_type: data.QUERY_TYPE,
            api_type: data.API_TYPE,
            execution_time_ms: parseFloat(data.EXECUTION_TIME_MS),
            response_size_bytes: parseInt(data.RESPONSE_SIZE_BYTES)
        });
    })
    .on('end', () => {
        // Agrupa resultados por repositório e tipo de consulta
        const groupedResults = {};
        const globalStats = {
            rest: { times: [], sizes: [] },
            graphql: { times: [], sizes: [] }
        };

        results.forEach(result => {
            const key = `${result.repository}-${result.query_type}`;
            if (!groupedResults[key]) {
                groupedResults[key] = {
                    repository: result.repository,
                    query_type: result.query_type,
                    rest: { times: [], sizes: [] },
                    graphql: { times: [], sizes: [] }
                };
            }

            if (result.api_type === 'REST') {
                groupedResults[key].rest.times.push(result.execution_time_ms);
                groupedResults[key].rest.sizes.push(result.response_size_bytes);
                globalStats.rest.times.push(result.execution_time_ms);
                globalStats.rest.sizes.push(result.response_size_bytes);
            } else {
                groupedResults[key].graphql.times.push(result.execution_time_ms);
                groupedResults[key].graphql.sizes.push(result.response_size_bytes);
                globalStats.graphql.times.push(result.execution_time_ms);
                globalStats.graphql.sizes.push(result.response_size_bytes);
            }
        });

        // Calcula estatísticas para cada grupo
        const statistics = Object.values(groupedResults).map(group => {
            const restTimeStats = calculateStats(group.rest.times);
            const graphqlTimeStats = calculateStats(group.graphql.times);
            const restSizeStats = calculateStats(group.rest.sizes);
            const graphqlSizeStats = calculateStats(group.graphql.sizes);

            return {
                repository: group.repository,
                query_type: group.query_type,
                rest_time_mean: restTimeStats.mean.toFixed(2),
                rest_time_median: restTimeStats.median.toFixed(2),
                rest_time_stddev: restTimeStats.stdDev.toFixed(2),
                rest_time_sum: restTimeStats.sum.toFixed(2),
                graphql_time_mean: graphqlTimeStats.mean.toFixed(2),
                graphql_time_median: graphqlTimeStats.median.toFixed(2),
                graphql_time_stddev: graphqlTimeStats.stdDev.toFixed(2),
                graphql_time_sum: graphqlTimeStats.sum.toFixed(2),
                time_diff_percent: ((restTimeStats.mean - graphqlTimeStats.mean) / restTimeStats.mean * 100).toFixed(2),
                rest_size_mean: restSizeStats.mean.toFixed(2),
                rest_size_median: restSizeStats.median.toFixed(2),
                rest_size_stddev: restSizeStats.stdDev.toFixed(2),
                rest_size_sum: restSizeStats.sum.toFixed(2),
                graphql_size_mean: graphqlSizeStats.mean.toFixed(2),
                graphql_size_median: graphqlSizeStats.median.toFixed(2),
                graphql_size_stddev: graphqlSizeStats.stdDev.toFixed(2),
                graphql_size_sum: graphqlSizeStats.sum.toFixed(2),
                size_diff_percent: ((restSizeStats.mean - graphqlSizeStats.mean) / restSizeStats.mean * 100).toFixed(2)
            };
        });

        // Calcula estatísticas globais
        const globalTimeStats = {
            rest: calculateStats(globalStats.rest.times),
            graphql: calculateStats(globalStats.graphql.times)
        };

        const globalSizeStats = {
            rest: calculateStats(globalStats.rest.sizes),
            graphql: calculateStats(globalStats.graphql.sizes)
        };

        // Adiciona estatísticas globais ao array
        statistics.push({
            repository: 'TOTAL',
            query_type: 'ALL',
            rest_time_mean: globalTimeStats.rest.mean.toFixed(2),
            rest_time_median: globalTimeStats.rest.median.toFixed(2),
            rest_time_stddev: globalTimeStats.rest.stdDev.toFixed(2),
            rest_time_sum: globalTimeStats.rest.sum.toFixed(2),
            graphql_time_mean: globalTimeStats.graphql.mean.toFixed(2),
            graphql_time_median: globalTimeStats.graphql.median.toFixed(2),
            graphql_time_stddev: globalTimeStats.graphql.stdDev.toFixed(2),
            graphql_time_sum: globalTimeStats.graphql.sum.toFixed(2),
            time_diff_percent: ((globalTimeStats.rest.mean - globalTimeStats.graphql.mean) / globalTimeStats.rest.mean * 100).toFixed(2),
            rest_size_mean: globalSizeStats.rest.mean.toFixed(2),
            rest_size_median: globalSizeStats.rest.median.toFixed(2),
            rest_size_stddev: globalSizeStats.rest.stdDev.toFixed(2),
            rest_size_sum: globalSizeStats.rest.sum.toFixed(2),
            graphql_size_mean: globalSizeStats.graphql.mean.toFixed(2),
            graphql_size_median: globalSizeStats.graphql.median.toFixed(2),
            graphql_size_stddev: globalSizeStats.graphql.stdDev.toFixed(2),
            graphql_size_sum: globalSizeStats.graphql.sum.toFixed(2),
            size_diff_percent: ((globalSizeStats.rest.mean - globalSizeStats.graphql.mean) / globalSizeStats.rest.mean * 100).toFixed(2)
        });

        // Escreve as estatísticas em um novo arquivo CSV
        const csvWriter = createObjectCsvWriter({
            path: 'experiment_statistics.csv',
            header: [
                { id: 'repository', title: 'REPOSITORY' },
                { id: 'query_type', title: 'QUERY_TYPE' },
                { id: 'rest_time_mean', title: 'REST_TIME_MEAN_MS' },
                { id: 'rest_time_median', title: 'REST_TIME_MEDIAN_MS' },
                { id: 'rest_time_stddev', title: 'REST_TIME_STDDEV_MS' },
                { id: 'rest_time_sum', title: 'REST_TIME_TOTAL_MS' },
                { id: 'graphql_time_mean', title: 'GRAPHQL_TIME_MEAN_MS' },
                { id: 'graphql_time_median', title: 'GRAPHQL_TIME_MEDIAN_MS' },
                { id: 'graphql_time_stddev', title: 'GRAPHQL_TIME_STDDEV_MS' },
                { id: 'graphql_time_sum', title: 'GRAPHQL_TIME_TOTAL_MS' },
                { id: 'time_diff_percent', title: 'TIME_DIFF_PERCENT' },
                { id: 'rest_size_mean', title: 'REST_SIZE_MEAN_BYTES' },
                { id: 'rest_size_median', title: 'REST_SIZE_MEDIAN_BYTES' },
                { id: 'rest_size_stddev', title: 'REST_SIZE_STDDEV_BYTES' },
                { id: 'rest_size_sum', title: 'REST_SIZE_TOTAL_BYTES' },
                { id: 'graphql_size_mean', title: 'GRAPHQL_SIZE_MEAN_BYTES' },
                { id: 'graphql_size_median', title: 'GRAPHQL_SIZE_MEDIAN_BYTES' },
                { id: 'graphql_size_stddev', title: 'GRAPHQL_SIZE_STDDEV_BYTES' },
                { id: 'graphql_size_sum', title: 'GRAPHQL_SIZE_TOTAL_BYTES' },
                { id: 'size_diff_percent', title: 'SIZE_DIFF_PERCENT' }
            ]
        });

        csvWriter.writeRecords(statistics)
            .then(() => {
                console.log('Estatísticas calculadas e salvas em experiment_statistics.csv');
                
                // Imprime um resumo no console
                console.log('\nResumo das Estatísticas:');
                statistics.forEach(stat => {
                    console.log(`\n${stat.repository} - ${stat.query_type}`);
                    console.log(`Tempo de Resposta:`);
                    console.log(`  REST: ${stat.rest_time_mean}ms ± ${stat.rest_time_stddev}ms (Total: ${stat.rest_time_sum}ms)`);
                    console.log(`  GraphQL: ${stat.graphql_time_mean}ms ± ${stat.graphql_time_stddev}ms (Total: ${stat.graphql_time_sum}ms)`);
                    console.log(`  Diferença: ${stat.time_diff_percent}%`);
                    console.log(`Tamanho da Resposta:`);
                    console.log(`  REST: ${stat.rest_size_mean} ± ${stat.rest_size_stddev} bytes (Total: ${stat.rest_size_sum} bytes)`);
                    console.log(`  GraphQL: ${stat.graphql_size_mean} ± ${stat.graphql_size_stddev} bytes (Total: ${stat.graphql_size_sum} bytes)`);
                    console.log(`  Diferença: ${stat.size_diff_percent}%`);
                });

                // Imprime estatísticas globais em destaque
                const globalStats = statistics.find(stat => stat.repository === 'TOTAL');
                console.log('\n=== ESTATÍSTICAS GLOBAIS ===');
                console.log('\nTempo Total de Execução:');
                console.log(`REST: ${globalStats.rest_time_sum}ms`);
                console.log(`GraphQL: ${globalStats.graphql_time_sum}ms`);
                console.log(`Diferença: ${globalStats.time_diff_percent}%`);
                console.log('\nTamanho Total das Respostas:');
                console.log(`REST: ${globalStats.rest_size_sum} bytes`);
                console.log(`GraphQL: ${globalStats.graphql_size_sum} bytes`);
                console.log(`Diferença: ${globalStats.size_diff_percent}%`);
            });
    });