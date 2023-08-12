const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// Open AI Configuration
const configuration = new Configuration({
    organization: "org-JIBgWdA4e1fYqfdkPXNyXFPa",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

// Express Configuration
const app = express()
const port = 3080

app.use(bodyParser.json())
app.use(cors())
app.use(require('morgan')('dev'))


// Routing 

// Primary Open AI Route
app.post('https://api.openai.com/v1/completions', async (req, res) => {
	const { message, currentModel, temperature } = req.body;
	const response = await openai.createCompletion({
		model: `${currentModel}`,// "text-davinci-003",
		prompt: `${message}`,
		max_tokens: 1000, 
		temperature,
	  });
	res.json({
		message: response.data.choices[0].text,
	})
});

// Get Models Route
app.get('https://api.openai.com/v1/models', async (req, res) => {
	const response = await openai.listEngines();
	res.json({
		models: response.data
	})
});

// Start the server
/* app.listen(port, () => {
	  console.log(`Example app listening at http://localhost:${port}`)
}); */
