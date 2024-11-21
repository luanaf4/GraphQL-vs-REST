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
A análise dos tempos de resposta revela padrões interessantes no comportamento de ambas as APIs. O GraphQL demonstrou uma vantagem significativa no tempo médio de resposta (413.13ms vs 505.77ms do REST), representando uma melhoria de 18.32%.

##### Analisando por nível de complexidade:

**Consultas Básicas:** A diferença é moderada mas consistente, com o GraphQL sendo 8.20% mais rápido em média. Por exemplo, no repositório freeCodeCamp/freeCodeCamp, o GraphQL (310.66ms) superou o REST (351.00ms) por 11.49%. Esta diferença menor em consultas simples é esperada, já que ambas as APIs precisam fazer apenas uma única requisição.

**Consultas Médias:** Interessantemente, este nível mostrou os resultados mais variados. Enquanto alguns repositórios mostraram melhorias significativas com GraphQL (19.23% mais rápido para sindresorhus/awesome), outros apresentaram performance inferior (-18.07% para codecrafters-io/build-your-own-x). Esta variabilidade sugere que outros fatores, como a estrutura específica dos dados ou padrões de acesso, podem ter maior influência neste nível de complexidade.

**Consultas Complexas:** A diferença mais dramática foi observada nas consultas complexas, onde o GraphQL mostrou uma melhoria média de 31.46%. O caso mais notável foi no repositório sindresorhus/awesome, onde o GraphQL (383.67ms) foi 47.11% mais rápido que REST (725.39ms). Esta diferença substancial pode ser atribuída à capacidade do GraphQL de recuperar dados relacionados em uma única requisição, enquanto o REST necessita de múltiplas chamadas.

### Análise do Tamanho das Respostas (RQ2)
A análise do tamanho das respostas revela uma diferença ainda maior entre as duas abordagens. O GraphQL demonstrou uma redução média de 97.89% no tamanho das respostas (6,615.33 bytes vs 313,655.07 bytes do REST).

**Consultas Básicas:** 

**REST:** média de 6,983 bytes (freeCodeCamp)
**GraphQL:** média de 176 bytes
Redução de 97.48%
Esta diferença significativa mesmo em consultas básicas sugere que o REST está enviando dados desnecessários mesmo em operações simples.

**Consultas Médias:** 

**REST:** varia de 91,129 a 341,385 bytes
**GraphQL:** varia de 1,460 a 11,659 bytes
Redução média de 94.83%
O aumento da diferença em consultas médias reflete a capacidade do GraphQL de selecionar precisamente os dados necessários.

**Consultas Complexas:** A maior diferença foi observada em consultas complexas:

**REST:** até 1,110,250 bytes 
**GraphQL:** máximo de 20,764 bytes
Redução de até 99.64%


### Análise Estatística

**Consistência das Respostas:**

REST: desvio padrão de 202.15ms
GraphQL: desvio padrão de 114.96ms
O menor desvio padrão do GraphQL (43.13% menor) indica uma performance mais previsível e estável.

## Discussão

A análise dos resultados obtidos neste experimento permitiu rejeitar ambas as hipóteses nulas, fornecendo evidências robustas para as vantagens do GraphQL sobre o REST em cenários específicos.

**RQ1 (Tempo de Resposta):** A hipótese nula (H0) de que não há diferença significativa no tempo de resposta entre GraphQL e REST foi rejeitada. Os resultados demonstram uma melhoria consistente de 18.32% no tempo médio de resposta com GraphQL. Essa diferença é ainda mais acentuada em consultas complexas, chegando a 31.46%. A capacidade do GraphQL de buscar dados específicos de múltiplas fontes em uma única requisição explica essa vantagem, eliminando o overhead de múltiplas chamadas inerente ao REST. A menor variabilidade nos tempos de resposta do GraphQL (desvio padrão de 114.96ms contra 202.15ms do REST) também reforça sua performance mais estável e previsível, crucial para aplicações sensíveis. Entretanto, é importante notar que em consultas médias, alguns casos apresentaram o REST com performance superior, sugerindo que a estrutura dos dados e o volume de informações requisitadas podem influenciar o desempenho.

**RQ2 (Tamanho das Respostas):** A hipótese nula (H0) de que não há diferença significativa no tamanho das respostas também foi rejeitada. O GraphQL apresentou uma redução de 97.89% no tamanho médio das respostas. Essa redução drástica, consistente em todos os níveis de complexidade, demonstra a eficiência do GraphQL em retornar apenas os dados solicitados, eliminando o overfetching característico do REST. A capacidade de especificar os campos desejados na consulta permite ao cliente receber apenas a informação necessária, minimizando o tráfego de dados e melhorando a performance.

----------------------

## Conclusão

Este experimento comparou quantitativamente o desempenho de APIs GraphQL e REST, focando no tempo de resposta e tamanho das respostas. Os resultados demonstram que o GraphQL oferece vantagens significativas, especialmente em cenários de consultas complexas, onde a redução no tempo de resposta e no tamanho dos dados transferidos é mais expressiva.

**Principais conclusões:**

**- GraphQL é mais rápido:** Em média 18.32% mais rápido que REST, com ganhos ainda maiores em consultas complexas.

**- GraphQL é mais eficiente:** Reduz o tamanho das respostas em 97.89%, otimizando a transferência de dados.

**- GraphQL é mais consistente:** Apresenta menor variabilidade nos tempos de resposta, indicando maior previsibilidade.
