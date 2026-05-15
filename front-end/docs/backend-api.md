# Integracao Frontend ↔ Backend — Mapeamento de Endpoints

Este documento mapeia todos os endpoints que o frontend consome, comparando com o que o backend .NET realmente expoe. Serve como referencia para garantir que ambos os lados estejam alinhados.

**URL base:** `VITE_API_BASE_URL` (fallback: `http://localhost:8000`)
**Autenticacao:** Bearer Token via header `Authorization: Bearer <token>`
O token e armazenado em `localStorage` na chave `sleep-sanctuary-auth-token`.

---

## 1. Login

**Pagina:** `LoginPage.jsx`
**Funcao no frontend:** `loginUser()` (atualmente so localStorage)
**Controller:** `LoginController` → `POST /login`

### Requisicao

```http
POST /login
Content-Type: application/json
```

```json
{
  "email": "usuario@email.com",
  "password": "senha123"
}
```

### Resposta (200 OK)

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Resposta de erro (401 Unauthorized)

```json
{
  "errors": ["Credenciais invalidas."]
}
```

### Status no frontend

> **PENDENTE** — O frontend usa autenticacao local via `localStorage`. Para integrar, e necessario:
>
> 1. Chamar `POST /login` com email e senha.
> 2. Guardar o `accessToken` retornado em `localStorage` na chave `sleep-sanctuary-auth-token`.
> 3. Redirecionar para `/home` apos sucesso.

---

## 2. Cadastro de Usuario

**Pagina:** `RegisterPage.jsx`
**Funcao no frontend:** `registerUser()` (atualmente so localStorage)
**Controller:** `UserController` → `POST /user`

### Requisicao

```http
POST /user
Content-Type: application/json
```

```json
{
  "name": "Maria Silva",
  "birthDate": "1998-05-10T00:00:00",
  "password": "senha123",
  "email": "maria@email.com",
  "gender": "Feminino",
  "heightCm": 170.0,
  "weightKg": 65.5,
  "occupation": "Analista de Produto",
  "sleepDisorder": 0
}
```

| Campo            | Tipo      | Obrigatorio | Observacoes                                                              |
|------------------|-----------|-------------|--------------------------------------------------------------------------|
| `name`           | `string`  | Sim         |                                                                          |
| `birthDate`      | `DateTime`| Sim         | Formato ISO 8601 (ex: `1998-05-10T00:00:00`)                            |
| `password`       | `string`  | Sim         |                                                                          |
| `email`          | `string`  | Sim         |                                                                          |
| `gender`         | `string`  | Sim         | Backend aceita string; Entity usa campo string                           |
| `heightCm`       | `decimal` | Nao         | Altura em centimetros                                                    |
| `weightKg`       | `decimal` | Nao         | Peso em quilogramas                                                      |
| `occupation`     | `string`  | Sim         | Campo `profession` no frontend → `occupation` no backend                 |
| `sleepDisorder`  | `int`     | Nao         | Enum: `0` = None, `1` = Insomnia, `2` = SleepApnea                      |

### Resposta (201 Created)

```json
{
  "name": "Maria Silva",
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Divergencias frontend ↔ backend

| Frontend envia        | Backend espera      | Acao necessaria                                         |
|-----------------------|---------------------|---------------------------------------------------------|
| `birthDate` ("DD/MM/AAAA") | `birthDate` (ISO DateTime) | Converter para ISO 8601 antes de enviar          |
| `profession`          | `occupation`        | Renomear campo no payload                               |
| `sleepGoal`           | —                   | Backend nao tem esse campo; guardar so no localStorage   |
| `weight` (string)     | `weightKg` (decimal)| Converter para numero e renomear                        |
| `height` (string)     | `heightCm` (decimal)| Converter para numero e renomear                        |
| `gender` ("Feminino") | `gender` (string)   | Backend aceita string; considerar padronizar valores     |
| —                     | `sleepDisorder`     | Frontend nao envia; usar `0` (None) como padrao          |

---

## 3. Registro de Sono (Diario)

**Pagina:** `DiaryEntryPage.jsx`
**Funcao no api.js:** `saveSleepRecord(data)` → `POST /sleep-records`
**Controller:** `SleepController` → `POST /sleep`
**Requer autenticacao:** Sim (Bearer Token)

### Rota real do backend

> **ATENCAO:** O controller usa `[Route("[controller]")]`, entao a rota real e `/sleep`, e NAO `/sleep-records` como o frontend espera.

### Requisicao

```http
POST /sleep
Content-Type: application/json
Authorization: Bearer <token>
```

```json
{
  "sleepStart": "2026-04-12T22:30:00",
  "sleepEnd": "2026-04-13T06:30:00",
  "qualityOfSleep": 8,
  "stressLevel": 5,
  "physicalActivityMinutes": 45,
  "bmiCategory": 1,
  "bloodPressure": 120.0,
  "notes": "Atividade media com qualidade 8/10 e estresse 5/10.",
  "heartRate": 72,
  "dailySteps": 7200
}
```

| Campo                     | Tipo       | Obrigatorio | Observacoes                                                                                          |
|---------------------------|------------|-------------|------------------------------------------------------------------------------------------------------|
| `sleepStart`              | `DateTime` | Sim         | Horario que dormiu (data + hora em ISO 8601)                                                         |
| `sleepEnd`                | `DateTime` | Sim         | Horario que acordou (data + hora em ISO 8601)                                                        |
| `qualityOfSleep`          | `int`      | Sim         | 1 a 10                                                                                               |
| `stressLevel`             | `int`      | Sim         | 1 a 10                                                                                               |
| `physicalActivityMinutes` | `int`      | Sim         | Minutos de atividade fisica no dia                                                                   |
| `bmiCategory`             | `int`      | Sim         | Enum: `0`=Underweight, `1`=Healthy, `2`=Overweight, `3`=Obesity, `4`=Class1, `5`=Class2, `6`=Class3 |
| `bloodPressure`           | `decimal`  | Sim         | Pressao arterial (numero unico)                                                                      |
| `notes`                   | `string?`  | Nao         | Texto livre                                                                                          |
| `heartRate`               | `int`      | Sim         | Frequencia cardiaca em bpm                                                                           |
| `dailySteps`              | `int`      | Sim         | Passos diarios                                                                                       |

### Resposta (201 Created)

Sem corpo — o backend retorna `Created()` vazio.

### Divergencias frontend ↔ backend

| Frontend envia            | Backend espera                 | Acao necessaria                                                               |
|---------------------------|--------------------------------|-------------------------------------------------------------------------------|
| endpoint `/sleep-records` | rota `/sleep`                  | Alterar em `api.js` para `/sleep`                                             |
| `date` ("2026-04-12")     | —                              | Backend calcula a data a partir de `sleepStart`                               |
| `sleepDuration` (minutos) | —                              | Backend calcula via `sleepStart`/`sleepEnd`; nao enviar                        |
| `sleepQuality`            | `qualityOfSleep`               | Renomear campo                                                                |
| `physicalActivity` ("medium") | `physicalActivityMinutes` (int)| Converter de nivel textual para minutos                                       |
| `steps`                   | `dailySteps`                   | Renomear campo                                                                |
| `screenTime`              | —                              | Backend nao tem esse campo                                                    |
| `caffeine`                | —                              | Backend nao tem esse campo                                                    |
| `alcohol`                 | —                              | Backend nao tem esse campo                                                    |
| `mentalFatigue`           | —                              | Backend nao tem esse campo                                                    |
| —                         | `sleepStart` (DateTime)        | Frontend tem `sleepTime` ("22:30"); converter para DateTime com data completa |
| —                         | `sleepEnd` (DateTime)          | Frontend tem `wakeTime` ("06:30"); converter para DateTime com data completa  |
| —                         | `bmiCategory` (int)            | Frontend nao envia; calcular via peso/altura do perfil ou usar padrao         |

---

## 4. Historico de Sono

**Pagina:** `HistoryPage.jsx`
**Funcao no api.js:** `getSleepHistory()` → `GET /sleep-history`
**Controller:** `SleepController` → `GET /sleep`
**Requer autenticacao:** Sim (Bearer Token)

### Rota real do backend

> **ATENCAO:** A rota real e `GET /sleep` (com paginacao via query string), e NAO `/sleep-history`.

### Requisicao

```http
GET /sleep?pageNumber=1&pageSize=20&sleepStart=2026-04-01&sleepEnd=2026-04-30
Authorization: Bearer <token>
```

| Query param    | Tipo       | Obrigatorio | Padrao | Observacoes                    |
|----------------|------------|-------------|--------|--------------------------------|
| `pageNumber`   | `int`      | Nao         | `1`    | Pagina atual                   |
| `pageSize`     | `int`      | Nao         | `20`   | Itens por pagina               |
| `sleepStart`   | `DateOnly` | Nao         | —      | Filtro: data inicial           |
| `sleepEnd`     | `DateOnly` | Nao         | —      | Filtro: data final             |

### Resposta (200 OK)

O backend retorna uma resposta **paginada** com `ShortSleepRecord`:

```json
{
  "items": [
    {
      "recordDate": "2026-04-12",
      "durationInHours": 8
    }
  ],
  "page": 1,
  "pageSize": 20,
  "totalCount": 45,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

### Divergencias frontend ↔ backend

| Frontend espera            | Backend retorna            | Acao necessaria                                                        |
|----------------------------|----------------------------|------------------------------------------------------------------------|
| endpoint `/sleep-history`  | rota `GET /sleep`          | Alterar em `api.js` para `/sleep`                                      |
| array simples `[]`         | objeto paginado `{ items }` | Acessar `.items` do retorno                                           |
| `date`, `sleepDuration`, `sleepQuality`, `stressLevel`, etc. | Apenas `recordDate` e `durationInHours` | Backend retorna dados resumidos; frontend precisa de mais campos |
| `sleepScore`, `disorder`   | —                           | Backend nao retorna esses campos                                      |
| `caffeine`, `alcohol`, etc.| —                           | Backend nao retorna esses campos                                      |

---

## 5. Insights

**Pagina:** `InsightsPage.jsx`
**Funcao no api.js:** `getInsights()` → `GET /insights`
**Controller:** Nao existe no backend.

### Requisicao esperada pelo frontend

```http
GET /insights
Authorization: Bearer <token>
```

### Resposta esperada pelo frontend

```json
{
  "averageSleep": 7.2,
  "averageScore": 75,
  "patterns": [
    "Sono irregular",
    "Alto uso de telas"
  ],
  "recommendations": [
    "Reduzir uso de celular antes de dormir",
    "Manter horario fixo"
  ]
}
```

| Campo              | Tipo       | Observacoes                                       |
|--------------------|------------|---------------------------------------------------|
| `averageSleep`     | `number`   | Media de horas de sono (ex: 7.2)                  |
| `averageScore`     | `number`   | Pontuacao media (0-100)                           |
| `patterns`         | `string[]` | Lista de padroes identificados                    |
| `recommendations`  | `string[]` | Lista de recomendacoes personalizadas             |

### Status

> **ENDPOINT NAO EXISTE NO BACKEND** — O frontend usa dados de fallback locais quando a chamada falha. Este endpoint precisa ser criado no backend (possivelmente integrando com o modulo de data-mining-ai).

---

## 6. Perfil do Usuario

**Pagina:** `ProfilePage.jsx`
**Funcao no api.js:** `getUserProfile()` → `GET /user/profile`
**Controller:** Nao existe no backend (apenas `POST /user` para cadastro).
**Requer autenticacao:** Sim (Bearer Token)

### Requisicao

```http
GET /user
Authorization: Bearer <token>
```

> O backend identifica o usuario pelo token JWT — nao precisa de ID na URL.

### Contrato conciliado (resposta recomendada)

Baseado nos campos que o backend **ja tem** na entidade `User` e nos campos que o frontend **precisa**:

```json
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "birthDate": "1998-05-10",
  "gender": "Feminino",
  "weightKg": 65.5,
  "heightCm": 170,
  "occupation": "Analista de Produto",
  "sleepGoal": "8h 00m",
  "sleepDisorder": 0
}
```

| Campo           | Tipo      | Origem     | Observacoes                                                    |
|-----------------|-----------|------------|----------------------------------------------------------------|
| `name`          | `string`  | Backend ✅ | Ja existe na entidade `User`                                   |
| `email`         | `string`  | Backend ✅ | Ja existe; frontend usa para identificar dados no localStorage |
| `birthDate`     | `string`  | Backend ✅ | Ja existe como `DateTime`; retornar em ISO (`yyyy-MM-dd`)      |
| `gender`        | `string`  | Backend ✅ | Ja existe como string na entidade                              |
| `weightKg`      | `decimal` | Backend ✅ | Ja existe; frontend deve adaptar de `weight` → `weightKg`      |
| `heightCm`      | `decimal` | Backend ✅ | Ja existe; frontend deve adaptar de `height` → `heightCm`      |
| `occupation`    | `string`  | Backend ✅ | Ja existe; frontend deve adaptar de `profession` → `occupation`|
| `sleepDisorder` | `int`     | Backend ✅ | Ja existe; frontend pode exibir futuramente                    |
| `sleepGoal`     | `string`  | Frontend   | **NAO EXISTE no backend** — precisa ser adicionado na entidade |

### O que o backend precisa fazer

1. **Criar endpoint `GET /user`** no `UserController` (com `[AuthenticadedUser]`) que retorne os dados do usuario autenticado.
2. **Adicionar campo `sleepGoal`** na entidade `User` e na migration (sugestao: `sleep_goal` como `string`, nullable).
3. **Nunca retornar `password`** na resposta.

### O que o frontend precisa adaptar

O frontend (em `api.js` e `ProfilePage.jsx`) deve:

1. Alterar a rota de `/user/profile` para `/user`.
2. Adaptar os nomes dos campos recebidos:

| Frontend atual  | Backend retorna | Adaptacao                 |
|-----------------|-----------------|---------------------------|
| `weight`        | `weightKg`      | Renomear ao receber       |
| `height`        | `heightCm`      | Renomear ao receber       |
| `profession`    | `occupation`    | Renomear ao receber       |
| `birthDate`     | `birthDate`     | Nenhuma (ja ISO)          |

> Sugestao: criar uma funcao `mapApiProfile(data)` em `utils/` que converta os nomes do backend para os nomes usados no frontend, similar ao `mapApiRecord()` que ja existe no `HistoryPage.jsx`.

---

## Resumo dos Enums do Backend

### BMICategory

| Valor | Nome             |
|-------|------------------|
| `0`   | Underweight      |
| `1`   | Healthy_Weight   |
| `2`   | Overweight       |
| `3`   | Obesity          |
| `4`   | Obesity_Class_1  |
| `5`   | Obesity_Class_2  |
| `6`   | Obesity_Class_3  |

### SleepDisorder

| Valor | Nome        |
|-------|-------------|
| `0`   | None        |
| `1`   | Insomnia    |
| `2`   | SleepApnea  |

### Gender (Entity)

| Valor | Nome |
|-------|------|
| `0`   | F    |
| `1`   | M    |

---

## Resumo Geral de Divergencias

| # | Endpoint Frontend    | Rota Backend Real   | Status          | Problema Principal                            |
|---|----------------------|---------------------|-----------------|-----------------------------------------------|
| 1 | `POST /login`        | `POST /login`       | OK (rota)       | Frontend nao faz chamada HTTP ainda            |
| 2 | `POST /user`         | `POST /user`        | OK (rota)       | Frontend nao faz chamada HTTP; campos divergem |
| 3 | `POST /sleep-records`| `POST /sleep`       | ROTA ERRADA     | Rota e campos do payload divergem              |
| 4 | `GET /sleep-history` | `GET /sleep`        | ROTA ERRADA     | Rota errada + resposta paginada vs array       |
| 5 | `GET /insights`      | —                   | NAO EXISTE      | Endpoint precisa ser criado no backend         |
| 6 | `GET /user/profile`  | —                   | NAO EXISTE      | Endpoint precisa ser criado no backend         |

---

## Configuracao CORS

O backend atualmente **nao tem CORS configurado** no `Program.cs`. Para o frontend (Vite em `http://localhost:5173`) conseguir se comunicar, e necessario adicionar no backend:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// ... apos var app = builder.Build();
app.UseCors("AllowFrontend");
```

---

## Configuracao do Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5001
```

> A porta depende de como o backend esta configurado em `launchSettings.json`.
