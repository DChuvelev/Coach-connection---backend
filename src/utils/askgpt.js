const GptApi = require('./GptApi');
const { apiPostRequestData, apiGetRequestData } = require('./constants');
const gptApi = new GptApi(apiPostRequestData, apiGetRequestData);
async function askGpt(req, res) {
    console.log('Ask GPT start. Request message:');
    console.log(req.body);
    let id = (await gptApi.postApiRequest(req.body)).id;
    console.log(`Server returned message id: ${id}`);
    let result = null;
    let counter = 0;
    while (!result && counter++ < 10) {
        try {
            console.log('waitig 1 sec...');
            console.log(`Trial #${counter}`);
            await new Promise((resolve, reject) => setTimeout(resolve, 1000));
            console.log('Request with id...');
            result = (await gptApi.getApiRequest(id));
        } catch(err) {
            console.log('No answer yet...')
        }
    }
    console.log(result);
    if (result) {
        res.send(result);
    } else {
        res.send('Server is busy. Try later');
    }
}
module.exports = { askGpt };