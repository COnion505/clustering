const toJson = async (res) => {
	const json = res.json();
	if(res.ok){
		return json;
	} else {
		throw new Error(json.message);
	}
}

export const execClustering = async (fileData) =>{
	return await fetch('http://localhost:8000/clustering/exec/',{
		method: 'POST',
		body: fileData,
	})
	.then((response) =>{
		console.log('response: ', response);
		return response.json();
	})
	.then( (data) => {
		console.log('data: ', data);
		return data;
	})
}