const axios = require('axios');
const getLanguageId = (language) => {
    const languages = {
        "c++" : 54,
        python : 71,
        javascript : 102
    }
    return languages[language]
}
const status_codes = [
  { id: 3, description: "Accepted" },
  { id: 4, description: "Wrong Answer" },
  { id: 5, description: "Time Limit Exceeded" },
  { id: 6, description: "Compilation Error" },
  { id: 7, description: "Runtime Error (SIGSEGV)" },
  { id: 8, description: "Runtime Error (SIGXFSZ)" },
  { id: 9, description: "Runtime Error (SIGFPE)" },
  { id: 10, description: "Runtime Error (SIGABRT)" },
  { id: 11, description: "Runtime Error (NZEC)" },
  { id: 12, description: "Runtime Error (Other)" },
  { id: 13, description: "Internal Error" },
  { id: 14, description: "Exec Format Error" },
  { id: 1, description: "In Queue" },
  { id: 2, description: "Processing" }
];

const getStatus = (statusCode) => {
  const res = status_codes.find((status) => status.id === statusCode);
  if (res) return res.description;
  return `Unknown (status_id: ${statusCode})`;
};


const submitBatch = async(submissions) =>{

const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key': '35bf6ab23emsh0fc9d389957b920p1a3ec4jsn32947c9c2d51',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  data: {
    submissions: submissions
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
        return response.data;

	
	} catch (error) {
		console.error(error);
	}
}

return await fetchData();

}

const waiting = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms));


const submitTokens = async(tokens) => {

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: tokens.join(","),
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': '35bf6ab23emsh0fc9d389957b920p1a3ec4jsn32947c9c2d51',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
        return response.data;

	} catch (error) {
		console.error(error);
	}
}

while(true){
const result = await fetchData();

 const resultObtained = result.submissions.every(
      (res) => res.status && res.status.id > 2
    );


if(resultObtained)
    return result

await waiting()

}

}
module.exports = {getLanguageId,submitBatch,submitTokens,getStatus}