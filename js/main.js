let output = ''
const listOfMovies = document.querySelector('#movies')
const singleMovie = document.querySelector('#movie')

const searchForm = document.querySelector('#searchForm')
if (searchForm) {
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let searchText = document.querySelector('#searchText').value
    getMovies(searchText)
  })
}

async function getMovies(searchText) {
  const request = new Request(
    `https://www.omdbapi.com/?s=${searchText}&apikey=eaeba172`
  )
  await fetch(request)
    .then((response) => {
      if (response.status === 200) {
        const data = response.json()
        return data
      } else {
        throw new Error('Unable to get movies')
      }
    })
    .then((response) => {
      let movies = response.Search
      movies.forEach((movie) => {
        output += `
        <div class="col-md-3">
          <div class="card card-body bg-light">
            <img src=${movie.Poster}>
            <h5>${movie.Title}</h5>
            <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="movie.html">Movie Details</a>
          </div>
        </div>
        `
      })
      // Dom parser parses out template string into an object
      // so we can loop through each object with for of, puting each
      // one in the html, this is much nicer than creating
      //elements dynamically
      let doc = new DOMParser().parseFromString(output, 'text/html')
      for (let elem of doc.body.childNodes) {
        listOfMovies.appendChild(elem)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

// store the indvidual movie id that was clicked on
// so that it can be retrieved in getMovie() and displayed
// sessionStorage will clear out after browser is closed
function movieSelected(id) {
  sessionStorage.setItem('movieId', id)
  // moves you to the movie page automatically
  window.location = 'movie.html'
  return false
}

async function getMovie() {
  // get movie out of sessionStorage
  let movieId = sessionStorage.getItem('movieId')
  // request movie info based on that id
  const request = new Request(
    `https://www.omdbapi.com/?i=${movieId}&apikey=eaeba172`
  )

  await fetch(request)
    .then((response) => {
      if (response.status === 200) {
        const data = response.json()
        return data
      } else {
        throw new Error('Unable to get movie')
      }
    })
    .then((response) => {
      let movie = response
      let output = `
        <div class="row">
          <div class="col-md-4">
            <img src="${movie.Poster}" class="img-thumbnail">
          </div>
          <div class="col-md-8>
            <h2>${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre: ${movie.Genre}</strong></li>
              <li class="list-group-item"><strong>Released: ${movie.Released}</strong></li>
              <li class="list-group-item"><strong>Rated: ${movie.Rated}</strong></li>
              <li class="list-group-item"><strong>IMDB Rating: ${movie.imdbRating}</strong></li>
              <li class="list-group-item"><strong>Director: ${movie.Director}</strong></li>
              <li class="list-group-item"><strong>Writers: ${movie.Writer}</strong></li>
              <li class="list-group-item"><strong>Actors: ${movie.Actors}</strong></li>
            </ul>
          </div>
        </div>

        <div>
          <div class="card bg-light" style="border: none;">
          <div class="card-body">
            <h3>Plot</h3>
            ${movie.Plot}
            <hr>
            <a href="https://www.imdb.com/title/${movieId}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="index.html" class="btn btn-default">Go Back To Search</a>
          </div>
        </div>
      `
      let doc = new DOMParser().parseFromString(output, 'text/html')
      singleMovie.appendChild(doc.body)
    })
    .catch((error) => {
      console.log(error)
    })
}
