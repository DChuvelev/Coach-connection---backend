module.exports = class GptApi {
    constructor(postRequest, getRequest) {
        this._apiPostRequest = postRequest;
        this._apiGetRequest = getRequest;
        console.log("GPT Api constructor");
    }

    postApiRequest = (messages) => {
        var request = {
            method: this._apiPostRequest.method,
            headers: this._apiPostRequest.headers,
            body: JSON.stringify({...this._apiPostRequest.body, messages: messages})
        }

        // console.log(`First request`, request);
    
        return fetch(this._apiPostRequest.baseUrl, request).then(res => {
            if (res.ok) {
                return res.json();
            } else {
                return Promise.reject(`Error number: ${res.status}`);
            }    
        })
    }

    getApiRequest = (id) => {
        const request = {
            method: this._apiGetRequest.method,
            headers: this._apiGetRequest.headers,
        }

        console.log(`Get request to: ${this._apiGetRequest.baseUrl}/${id}`);

        return fetch(`${this._apiGetRequest.baseUrl}/${id}`, request)
        .then(res => res.text())
        .then(result => {
            // console.log(result);
            return JSON.parse(result).response.alternatives;
        });
        // const myHeaders = new Headers();
        // myHeaders.append("Authorization", "Api-Key AQVNx-1FDM8u5Lkpswzf6eRpLk6aff3XgaIbr72t");

        // const requestOptions = {
        // method: "GET",
        // headers: myHeaders,
        // redirect: "follow"
        // };

        // fetch("https://operation.api.cloud.yandex.net/operations/d7q1j5o6a1h3hklg7v02", requestOptions)
        // .then((response) => response.text())
        // .then((result) => console.log(result))
        // .catch((error) => console.error(error));
    }
}