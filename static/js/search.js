// THis stuff below isn't in use, but I used it to see how to interact with lunr. Works fine, but decided to use my own search functions
function displayResults (results, store) {
    //grab the html section we want to inject stuff into
  const searchResults = document.getElementById('results')
    //check if there's anything in that element
  if (results.length) {
      //if there is, empty it
    let resultList = ''
    // Iterate and build result list elements
    // in this case, "results" is something that lunr.js returned to us
    // we're iterating over each item in that object and building out the html we want to inject
    for (const n in results) {
        // "store" is the variable being used for "window.store" which is a global variable we assigned to store the json object we created in search-index.html 
        // so here, we're just grabbing some part of it
        // the results[n].ref part is just the id that lunar has in its object that we passed into this function
        // so we're looking for that same id within the "window.store" thing we created
        // once we find the object in our store that matches the lunr id, we'll assign it to the variable "item" and start building out html from that objects stuff
      const item = store[results[n].ref]
        //ok here is where we're actually building out the html, appending everything to "resultList"
      resultList += '<li><p><a href="' + item.url + '">' + item.title + '</a></p>'
      resultList += '<p>' + item.content.substring(0, 150) + '...</p></li>'
    }
    // now that we've built an html thing, we can inject it
    searchResults.innerHTML = resultList
  } else {
    // if the "lenth" of the results passed into this function was nothing, then just tell the screen we didn't have results
    searchResults.innerHTML = 'No results found.'
  }
}

// Get the query parameter(s)
// here we setup a URLSearchParams function to grab specific query things from the url
const params = new URLSearchParams(window.location.search)
const query = params.get('query')

// Perform a search if there is a query
// if that successfully grabbed anything, then run what's inside this if block
if (query) {
  // Retain the search input in the form when displaying results
  document.getElementById('search-input').setAttribute('value', query)

 // this is just configuring lunr to give us the type of object we want it to give us
  const idx = lunr(function () {
      // setting up some of the properties on the object here
    this.ref('id')
    this.field('title', {
      boost: 15
    })
    this.field('tags')
    this.field('content', {
      boost: 10
    })

    // sticking our local store stuff into the lunr object
    for (const key in window.store) {
      this.add({
          // the format of window.store is like this:
          // window.store = {
          //    "uniqueid": {
          //         "title": "some sort of title here"
          //    },
          //    "anotheruniquid": {
          //         "title": "some special title for this one"
          //    }
          // }
          //
          // so when we're looping through this object, we're going to first grab the uniqu id and assign it to the "id" key we created in this lunr object
        id: key,
          // using the unique identifier (key) to grab the right objects title property and store it in this lunr objects title property
        title: window.store[key].title,
        tags: window.store[key].category,
        content: window.store[key].content
      })
    }
  })

  // Perform the search
  // use the query from the url and pass it into lunr's search function and let the magic beginning
    // lunr gives us back an object that we can use, it has our results in it. we store it in "results"
  const results = idx.search(query)
  // Update the list with results

  // 
  displayResults(results, window.store)
}

