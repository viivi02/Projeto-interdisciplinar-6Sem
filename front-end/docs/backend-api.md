# Integracao com Backend

Este frontend centraliza as chamadas HTTP em `src/services/api.js` usando `fetch`, `async/await` e `try/catch` nas telas. A URL base vem de `VITE_API_BASE_URL`; se ela nao for definida, o frontend tenta `http://localhost:8000`.

## Envio do Diario

Ao salvar um registro em Diario, a tela monta um payload limpo e chama:

```js
saveSleepRecord(data)
```

Requisicao esperada:

```http
POST /sleep-records
Content-Type: application/json
```

Corpo:

```json
{
  "date": "2026-04-12",
  "sleepDuration": 440,
  "sleepQuality": 8,
  "stressLevel": 5,
  "mentalFatigue": 6,
  "physicalActivity": "medium",
  "steps": 7200,
  "heartRate": 72,
  "bloodPressure": {
    "systolic": 120,
    "diastolic": 80
  },
  "screenTime": 45,
  "caffeine": true,
  "alcohol": false
}
```

Resposta recomendada:

```json
{
  "id": 1,
  "date": "2026-04-12",
  "sleepDuration": 440,
  "sleepQuality": 8,
  "stressLevel": 5,
  "mentalFatigue": 6,
  "physicalActivity": "medium",
  "steps": 7200,
  "heartRate": 72,
  "bloodPressure": {
    "systolic": 120,
    "diastolic": 80
  },
  "screenTime": 45,
  "caffeine": true,
  "alcohol": false,
  "sleepScore": 78,
  "disorder": "Insonia leve"
}
```

## Historico

```http
GET /sleep-history
```

Resposta esperada:

```json
[
  {
    "id": 1,
    "date": "2026-04-12",
    "sleepDuration": 440,
    "sleepQuality": 8,
    "stressLevel": 5,
    "mentalFatigue": 6,
    "physicalActivity": "medium",
    "steps": 7200,
    "heartRate": 72,
    "bloodPressure": {
      "systolic": 120,
      "diastolic": 80
    },
    "screenTime": 45,
    "caffeine": true,
    "alcohol": false,
    "sleepScore": 78,
    "disorder": "Insonia leve"
  }
]
```

## Insights

```http
GET /insights
```

Resposta esperada:

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

## Perfil

```http
GET /user/profile
```

Resposta esperada:

```json
{
  "name": "Usuario",
  "birthDate": "1998-05-10",
  "weight": 70,
  "height": 170,
  "gender": "female",
  "sleepGoal": 8
}
```

## Integracao futura com FastAPI

No FastAPI, crie rotas equivalentes a `POST /sleep-records`, `GET /sleep-history`, `GET /insights` e `GET /user/profile`. Use modelos Pydantic com os mesmos nomes de campos esperados pelo frontend. Para desenvolvimento local, habilite CORS permitindo a origem do Vite, normalmente `http://localhost:5173`.

Exemplo de configuracao:

```py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Para apontar o frontend para a API real, crie um arquivo `.env` no frontend:

```env
VITE_API_BASE_URL=http://localhost:8000
```

