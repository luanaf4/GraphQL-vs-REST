import axios from 'axios';
import { GITHUB_TOKEN } from './config.js';

export class RestQueries {
    constructor() {
        this.client = axios.create({
            baseURL: 'https://api.github.com',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
    }

    async getBasicRepoInfo(owner, repo) {
        const startTime = performance.now();
        const response = await this.client.get(`/repos/${owner}/${repo}`);
        const endTime = performance.now();

        return {
            data: response.data,
            executionTime: endTime - startTime,
            responseSize: JSON.stringify(response.data).length
        };
    }

    async getRepoWithIssues(owner, repo) {
        const startTime = performance.now();
        const [repoResponse, issuesResponse] = await Promise.all([
            this.client.get(`/repos/${owner}/${repo}`),
            this.client.get(`/repos/${owner}/${repo}/issues`)
        ]);
        const endTime = performance.now();

        const combinedData = {
            repo: repoResponse.data,
            issues: issuesResponse.data
        };

        return {
            data: combinedData,
            executionTime: endTime - startTime,
            responseSize: JSON.stringify(combinedData).length
        };
    }

    async getRepoComplete(owner, repo) {
        const startTime = performance.now();
        const [
            repoResponse,
            issuesResponse,
            pullsResponse,
            contributorsResponse,
            languagesResponse
        ] = await Promise.all([
            this.client.get(`/repos/${owner}/${repo}`),
            this.client.get(`/repos/${owner}/${repo}/issues`),
            this.client.get(`/repos/${owner}/${repo}/pulls`),
            this.client.get(`/repos/${owner}/${repo}/contributors`),
            this.client.get(`/repos/${owner}/${repo}/languages`)
        ]);
        const endTime = performance.now();

        const combinedData = {
            repo: repoResponse.data,
            issues: issuesResponse.data,
            pulls: pullsResponse.data,
            contributors: contributorsResponse.data,
            languages: languagesResponse.data
        };

        return {
            data: combinedData,
            executionTime: endTime - startTime,
            responseSize: JSON.stringify(combinedData).length
        };
    }
}