# Projeto-interdisciplinar-6Sem
Repositório dedicado ao projeto interdisciplinar do sexto semestre de desenvolvimento de software multiplataforma.


## REQUISITOS FUNCIONAIS

Esses são o que o sistema deve fazer.

### Cadastro e usuário
RF01: O sistema deve permitir o cadastro de usuários
RF02: O sistema deve permitir login/autenticação
RF03: O usuário deve poder editar seus dados pessoais
### Entrada de dados
RF04: O sistema deve permitir o registro manual de dados de sono
RF05: O usuário deve inserir dados diários (sono, estresse, atividade, etc.)
RF06: O sistema deve permitir atualização/edição dos registros
### Análise de Machine Learning
RF07: O sistema deve processar os dados do usuário utilizando modelos de machine learning
RF08: O sistema deve classificar a qualidade do sono do usuário
RF09: O sistema deve identificar possíveis distúrbios do sono
RF10: O sistema deve agrupar usuários com perfis semelhantes (clustering)
### Resultados e visualização
RF11: O sistema deve apresentar um score de qualidade do sono
RF12: O sistema deve exibir gráficos de evolução do sono
RF13: O sistema deve mostrar padrões identificados (ex: sono irregular)
RF14: O sistema deve fornecer insights personalizados
### Recomendações
RF15: O sistema deve sugerir melhorias (ex: reduzir uso de tela)
RF16: O sistema pode gerar alertas de risco (ex: possível insônia)
Interface
RF17: O sistema deve funcionar em ambiente web e mobile
RF18: O sistema deve permitir navegação intuitiva entre telas

## REQUISITOS NÃO FUNCIONAIS

Esses definem como o sistema deve se comportar.

### Desempenho
RNF01: O sistema deve processar análises em até X segundos (ex: 3s)
RNF02: O sistema deve suportar múltiplos usuários simultaneamente
### Segurança
RNF03: Os dados do usuário devem ser armazenados de forma segura
RNF04: O sistema deve utilizar autenticação segura (ex: JWT)
RNF05: Dados sensíveis devem ser criptografados
### Qualidade dos dados
RNF06: O sistema deve validar entradas (ex: valores de 1–10)
RNF07: O sistema deve tratar dados inconsistentes
### Usabilidade
RNF08: Interface deve ser simples e intuitiva
RNF09: O usuário deve conseguir inserir dados em menos de X minutos
### Escalabilidade
RNF10: O sistema deve permitir expansão futura (ex: integração com wearables)
### Manutenibilidade
RNF11: O código deve ser modular
RNF12: O modelo de ML deve permitir re-treinamento
### Disponibilidade
RNF13: O sistema deve ter disponibilidade mínima (ex: 99%)
### Precisão do modelo
RNF14: O modelo deve atingir métricas mínimas (ex: >75% acurácia)
RNF15: O sistema deve permitir avaliação contínua do modelo

## Arquitetura

Flutter (Mobile)
        ↓
React (Web Dashboard)
        ↓
Backend (C# - EF)
        ↓
Mensageria (Fila / Broker)
        ↓
Machine Learning / Data mining
        ↓
Banco de Dados (MySql)