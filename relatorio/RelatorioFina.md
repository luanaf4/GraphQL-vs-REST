# Relatório Final - GraphQL vs REST: Um Experimento Controlado

## Introdução

Este experimento visa comparar quantitativamente o desempenho entre APIs GraphQL e REST, focando em duas métricas principais: tempo de resposta e tamanho das respostas. O estudo busca responder às seguintes questões de pesquisa:

**-** **RQ1: Respostas às consultas GraphQL são mais rápidas que respostas às consultas REST?**

**- RQ2: Respostas às consultas GraphQL tem tamanho menor que respostas às consultas REST?**


## Hipóteses de Pesquisa
#### RQ1. Respostas às consultas GraphQL são mais rápidas que respostas às consultas REST?

  - H0: Não há diferença significativa no tempo de resposta entre GraphQL e REST
  - H1: GraphQL apresenta tempo de resposta menor que REST
    
#### RQ2. Respostas às consultas GraphQL tem tamanho menor que respostas às consultas REST?

  - H0: Não há diferença significativa no tamanho das respostas entre GraphQL e REST
  - H1: GraphQL apresenta respostas de tamanho menor que REST

## Metodologia

### Desenho do Experimento

#### Variáveis

- Dependentes:
  - Tempo de resposta (ms)
  - Tamanho da resposta (bytes)
    
- Independentes:
  - Tipo de API (GraphQL/REST)
  - Complexidade das consultas
  - Repositório consultado
  
#### Tratamentos

  **- Consultas via REST API:**

    - Consultas básicas (single endpoint)
    - Consultas médias (2-3 endpoints)
    - Consultas complexas (4+ endpoints)
   
  **- Consultas via GraphQL API:**

    - Consultas básicas (dados simples)
    - Consultas médias (dados relacionados)
    - Consultas complexas (múltiplas relações)
   
  **- Dados coletados**
  
      - Consultas básicas:
      
        - Nome do repositório
        - Descrição
        - Número de stars
        - Número de forks
        - Linguagem principal
        
      - Consultas médias:
      
        - Informações básicas do repositório
        - Lista de issues abertas
        - Lista de pull requests abertos
        - Status de cada item
        - Autores das issues/PRs
        
      - Consultas Complexas:
      
        - Todas as informações das consultas médias
        - Lista de contribuidores
        - Estatísticas de contribuição
        - Distribuição de linguagens


> [!NOTE]
> Enquanto o REST baseia-se em endpoints predefinidos, o GraphQL permite consultas flexíveis através de schemas.

   
#### Objetos Experimentais
  - API do GitHub (v3 para REST, v4 para GraphQL)
  - 5 repositórios mais populares do GitHub
    
    - Dados coletados:
      - Informações básicas do repositório
      - Issues e Pull Requests
      - Contribuidores e linguagens
      
#### Projeto Experimental

  - Design fatorial 2×3 (2 APIs × 3 níveis de complexidade)
  - Between-subjects design
  - Randomização na ordem de execução
  - Contrabalanceamento para evitar efeitos de ordem

#### Quantidade de Medições

  - 30 execuções por combinação de tratamento
  - 5 repositórios × 3 níveis de complexidade × 2 APIs
  - Total: 450 medições (90 por repositório)

------------------------

#### Ambiente Experimental

  - Configuração de Hardware:

    - Processador: Apple M2
    - Memória RAM: 8 GB
    - Sistema Operacional: macOS
   
#### Procedimento de Execução

--------------

## Ameaças à Validade

  - Validade Interna:

    - Variação do desempenho da rede
    - Latência da API do GitHub
    - Cache do sistema
    - Limite de taxa da API
   
  - Validade Externa:

    - Limitação a uma única plataforma (GitHub)
    - Amostra limitada de repositórios
    - Complexidade artificial das consultas
    
  - Validade de Construto:

    - Métricas podem não representar completamente o desempenho
    - Simplificação das consultas reais
      
------------------

## Resultados

### Análise do Tempo de Resposta (RQ1)
[Aguardando execução do experimento]

### Análise do Tamanho das Respostas (RQ2)
[Aguardando execução do experimento]

### Análise Estatística
[Aguardando execução do experimento]

## Discussão

----------------------

## Conclusão

----------------------
