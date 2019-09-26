$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val()

    getMovies(searchText)
    e.preventDefault()
  })
})

function getMovies(searchText) {
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
