import { GraphQLClient } from 'graphql-request';
import { GITHUB_TOKEN } from './config.js';

export class GraphQLQueries {
    constructor() {
        this.client = new GraphQLClient('https://api.github.com/graphql', {
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`
            }
        });
    }

    async getBasicRepoInfo(owner, name) {
        const query = `
            query($owner: String!, $name: String!) {
                repository(owner: $owner, name: $name) {
                    name
                    description
                    stargazerCount
                    forkCount
                }
            }
        `;

        const startTime = performance.now();
        const response = await this.client.request(query, { owner, name });
        const endTime = performance.now();

        return {
            data: response,
            executionTime: endTime - startTime,
            responseSize: JSON.stringify(response).length
        };
    }

    async getRepoWithIssues(owner, name) {
        const query = `
            query($owner: String!, $name: String!) {
                repository(owner: $owner, name: $name) {
                    name
                    description
                    stargazerCount
                    issues(first: 100, states: OPEN) {
                        nodes {
                            title
                            state
                            createdAt
                        }
                    }
                }
            }
        `;

        const startTime = performance.now();
        const response = await this.client.request(query, { owner, name });
        const endTime = performance.now();

        return {
            data: response,
            executionTime: endTime - startTime,
            responseSize: JSON.stringify(response).length
        };
    }

    async getRepoComplete(owner, name) {
        const query = `
            query($owner: String!, $name: String!) {
                repository(owner: $owner, name: $name) {
                    name
                    description
                    stargazerCount
                    issues(first: 100, states: OPEN) {
                        nodes {
                            title
                            state
                            createdAt
                        }
                    }
                    pullRequests(first: 100, states: OPEN) {
                        nodes {
                            title
                            state
                            createdAt
                        }
                    }
                    languages(first: 10) {
                        nodes {
                            name
                        }
                    }
                }
            }
        `;

        const startTime = performance.now();
        const response = await this.client.request(query, { owner, name });
        const endTime = performance.now();

        return {
            data: response,
            executionTime: endTime - startTime,
            responseSize: JSON.stringify(response).length
        };
    }

    async getTopRepositories() {
        const query = `
            query {
                search(query: "stars:>50000", type: REPOSITORY, first: 5) {
                    edges {
                        node {
                            ... on Repository {
                                nameWithOwner
                                owner {
                                    login
                                }
                                name
                            }
                        }
                    }
                }
            }
        `;

        const response = await this.client.request(query);
        return response.search.edges.map(edge => ({
            owner: edge.node.owner.login,
            name: edge.node.name
        }));
    }
}