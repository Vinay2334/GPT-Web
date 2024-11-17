import request from 'request';

const options = {
  method: 'POST',
  url: 'https://chatgpt-gpt4-ai-chatbot.p.rapidapi.com/ask',
  headers: {
    'x-rapidapi-key': 'ded9e4ae26msh88178f15bf05d4ap18e66ejsnd5405a37d31a',
    'x-rapidapi-host': 'chatgpt-gpt4-ai-chatbot.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  body: {query: 'Hi'},
  json: true
};

request(options, function (error, response, body) {
	if (error) throw new Error(error);

	console.log(body);
});