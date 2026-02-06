// api
insertPerson()

async function insertPerson() {
    const baseURL = 'https://fdnd.directus.app'
    const endpoint = '/items/person/306'
    const url = baseURL + endpoint

    let response = await fetch(url)
    console.log(response)

    let person = await response.json()
    console.log(person)

    let personHTML = 
        `<article class="${person.data.name}">
			<h2>${person.data.name}</h2>
			<img src=${person.data.avatar} alt=${person.data.name}>
			<p>${person.data.github_handle}</p>
			<p>${person.data.website}</p>
            <p>${person.data.birthdate}</p>
		</article>`
    
    document.body.insertAdjacentHTML('beforeend', personHTML)
}