let output = ''
let listOfMovies = document.querySelector('#movies')

const searchForm = document.querySelector('#searchForm')
searchForm.addEventListener('submit', (e) => {
  let searchText = document.querySelector('#searchText').value
  getMovies(searchText)
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      console.log(error)
    })

  e.preventDefault()
})

function getMovies2(searchText) {
  // request movies based on the search criteria
  axios
    .get(`https://www.omdbapi.com/?s=${searchText}&apikey=eaeba172`)
    .then(function(response) {
      // handle success
      console.log(response.data.Search)
      let movies = response.data.Search
      let output = ''
      $.each(movies, (index, movie) => {
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
      $('#movies').append(output)
    })
    .catch(function(error) {
      // handle error
      console.log(error)
    })
    .finally(function() {
      // always executed
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
        throw new Error('Unable to get puzzle')
      }
    })
    .then((response) => {
      console.log(response.Search)
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
      let doc = new DOMParser().parseFromString(output, 'text/html')
      for (let elem of doc.body.childNodes) {
        listOfMovies.appendChild(elem)
      }
      console.log(typeof doc)
    })
    .catch((error) => {
      console.log(error)
    })
}

// getMovies(search)
//   .then((response) => {
//     console.log(response)
//   })
//   .catch((error) => {
//     console.log(error)
//   })

// store the indvidual movie id that was clicked on
// so that it can be retrieved in getMovie() and displayed
// sessionStorage will clear out after browser is closed
function movieSelected(id) {
  sessionStorage.setItem('movieId', id)
  // moves you to the movie page automatically
  window.location = 'movie.html'
  return false
}

function getMovie() {
  let movieId = sessionStorage.getItem('movieId')
  // request movie info based on that id
  axios
    .get(`https://www.omdbapi.com/?i=${movieId}&apikey=eaeba172`)

    .then(function(response) {
      // handle success
      console.log(response)
      let movie = response.data
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
      $('#movie').append(output)
    })
    .catch(function(error) {
      // handle error
      console.log(error)
    })
}
