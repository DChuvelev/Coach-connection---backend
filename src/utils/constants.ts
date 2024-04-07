const ApiKey = 'Api-Key AQVNx-1FDM8u5Lkpswzf6eRpLk6aff3XgaIbr72t';
const ApiModelUri = 'gpt://b1gu33no7s7tc1g4hp39/yandexgpt-lite';
const ApiPostRequestUrl = 'https://llm.api.cloud.yandex.net/foundationModels/v1/completionAsync';
const ApiGetResponseUrl = 'https://operation.api.cloud.yandex.net/operations';
module.exports.apiPostRequestData = {
    baseUrl: ApiPostRequestUrl,
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": ApiKey,
    },
    body: {
        "modelUri": ApiModelUri,
        "completionOptions": {
            "stream": false,
            "temperature": 0.1,
            "maxTokens": "2000"
        }
    }
}

module.exports.apiGetRequestData = {
    baseUrl: ApiGetResponseUrl,
    method: "GET",
    headers: {
        "Content-Type": "application/json",
        "Authorization": ApiKey,
    }
}