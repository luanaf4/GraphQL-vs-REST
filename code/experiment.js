import { RestQueries } from './rest-queries.js';
import { GraphQLQueries } from './graphql-queries.js';
import { createObjectCsvWriter } from 'csv-writer';
import './config.js';

const SAMPLE_SIZE = 30;

const csvWriter = createObjectCsvWriter({
    path: 'experiment_results.csv',
    header: [
        { id: 'experiment_id', title: 'EXPERIMENT_ID' },
        { id: 'api_type', title: 'API_TYPE' },
        { id: 'query_type', title: 'QUERY_TYPE' },
        { id: 'repository', title: 'REPOSITORY' },
        { id: 'execution_time_ms', title: 'EXECUTION_TIME_MS' },
        { id: 'response_size_bytes', title: 'RESPONSE_SIZE_BYTES' },
        { id: 'timestamp', title: 'TIMESTAMP' }
    ]
});

async function runExperiment() {
    const rest = new RestQueries();
    const graphql = new GraphQLQueries();
    const results = [];
    let experimentId = 1;

    try {
        const repositories = await graphql.getTopRepositories();
        console.log('Repositórios selecionados:', repositories);

        for (const repo of repositories) {
            console.log(`\nTestando ${repo.owner}/${repo.name}`);

            const queryTypes = ['Basic', 'Medium', 'Complex'];
            
            for (const queryType of queryTypes) {
                for (let i = 0; i < SAMPLE_SIZE; i++) {
                    console.log(`Execução ${i + 1}/${SAMPLE_SIZE} para ${queryType}`);

                    // REST Query
                    try {
                        let restResult;
                        switch (queryType) {
                            case 'Basic':
                                restResult = await rest.getBasicRepoInfo(repo.owner, repo.name);
                                break;
                            case 'Medium':
                                restResult = await rest.getRepoWithIssues(repo.owner, repo.name);
                                break;
                            case 'Complex':
                                restResult = await rest.getRepoComplete(repo.owner, repo.name);
                                break;
                        }

                        results.push({
                            experiment_id: experimentId,
                            api_type: 'REST',
                            query_type: queryType,
                            repository: `${repo.owner}/${repo.name}`,
                            execution_time_ms: restResult.executionTime,
                            response_size_bytes: restResult.responseSize,
                            timestamp: new Date().toISOString()
                        });
                    } catch (error) {
                        console.error('Erro REST:', error.message);
                    }

                    // GraphQL Query
                    try {
                        let graphqlResult;
                        switch (queryType) {
                            case 'Basic':
                                graphqlResult = await graphql.getBasicRepoInfo(repo.owner, repo.name);
                                break;
                            case 'Medium':
                                graphqlResult = await graphql.getRepoWithIssues(repo.owner, repo.name);
                                break;
                            case 'Complex':
                                graphqlResult = await graphql.getRepoComplete(repo.owner, repo.name);
                                break;
                        }

                        results.push({
                            experiment_id: experimentId,
                            api_type: 'GRAPHQL',
                            query_type: queryType,
                            repository: `${repo.owner}/${repo.name}`,
                            execution_time_ms: graphqlResult.executionTime,
                            response_size_bytes: graphqlResult.responseSize,
                            timestamp: new Date().toISOString()
                        });
                    } catch (error) {
                        console.error('Erro GraphQL:', error.message);
                    }

                    experimentId++;
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        await csvWriter.writeRecords(results);
        console.log('Resultados salvos em experiment_results.csv');
    } catch (error) {
        console.error('Erro durante o experimento:', error);
    }
}

runExperiment().catch(console.error);