# GraphQL vs REST - Um experimento controlado

Este repositório contém o código e os resultados de um experimento controlado que compara o desempenho das APIs GraphQL e REST. O experimento foi conduzido utilizando a API pública do GitHub como fonte de dados, realizando consultas de diferentes complexidades e medindo o tempo de resposta e o tamanho das respostas.

## Objetivo

O objetivo deste experimento é responder às seguintes perguntas de pesquisa:

1. **RQ1:** As respostas às consultas GraphQL são mais rápidas que as respostas às consultas REST?
2. **RQ2:** As respostas às consultas GraphQL têm tamanho menor que as respostas às consultas REST?

## Metodologia

O experimento utiliza um design fatorial 2x3 (2 tipos de API x 3 níveis de complexidade de consulta) com 30 repetições por tratamento. As métricas coletadas incluem tempo de execução (ms) e tamanho da resposta (bytes). Cinco repositórios populares do GitHub foram selecionados como objetos de estudo, e as consultas foram projetadas para simular cenários de uso realistas.

## Instruções

1. **Clone o repositório:**

```bash
git clone https://github.com/luanaf4/GraphQL-vs-REST.git
```

2. **Instale as dependências:**
```bash   
npm install
```
3. **Crie um arquivo .env na raiz do projeto e adicione seu token de acesso pessoal do GitHub:**
```bash
GITHUB_TOKEN=seu_token_aqui
```

4. **Execute o experimento:**
```bash
npm start
```

5. **Calcule as estatísticas:**
```bash
node statistics.js
```

Os resultados serão salvos nos arquivos experiment_results.csv e experiment_statistics.csv.

## Resultados

Os resultados do experimento podem ser encontrados no arquivo experiment_statistics.csv. Um resumo das estatísticas também é impresso no console após a execução do script statistics.js.

## Relatório Final

O relatório final completo do experimento, incluindo uma análise detalhada dos resultados e as conclusões, pode ser encontrado [aqui](https://github.com/luanaf4/GraphQL-vs-REST/blob/main/relatorio/RelatorioFinal.md#relat%C3%B3rio-final---graphql-vs-rest-um-experimento-controlado)
