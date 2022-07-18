
(async () => {

    try {

        // get the data with fetch
        const response = await fetch("/index.json");


        // sanatize the data into json format
        const data_array = await response.json();


        // get the query parameter with an instance of URLSearchParams
        const urlParams = new URLSearchParams(window.location.search);
        let query = urlParams.has('q') ? urlParams.get('q') : ''

        
        // create new filtered shallow array based on the value of query
        let filtered_data_array = data_array.filter((item) => {
            return (
                item.title.toLowerCase().includes(query) ||
                item.contents.toLowerCase().includes(query)
            )
        })


        // grab the html we want to inject into
        let html_result = document.querySelector("#results") || ""


        // create functon to inject data (the filtered array) to html
        const send_data_to_html = (data) => {
            const html_to_inject = data.map((page) => {
                return `
                    <li class="page_result">
                        <a href="${page.permalink}">
                            <img src="${page.image}"/>
                            <div class="details">
                                <h2>${page.title}</h2>
                                <p>${page.description}</p>
                            </div>
                        </a>
                    </li>
                `
            }).join('');
            

            return html_to_inject

        }


        // send it!

        html_result.innerHTML = send_data_to_html(filtered_data_array)


    } catch (err) {
        console.log(err)
    }

})();

