// ELISE MOVIE FIGHT PROJECT FS
//1. Need to fetch the movie data from an api (using omdbapi.com)
//1a. Will have an initial "overview" fetch of the movies with limited data, and then will have to do additional requests to the api for more data about each movie
//2. Build a widget from scratch that autocompletes search user movie inputs
//2a. Determine the rules for the widget 
//3. Styling and CSS


const autocompleteConfig = {
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `       
             <img src="${imgSrc}" />
            ${movie.Title} (${movie.Year})
            `;
    },
   
    inputValue(movie) {
        return movie.Title; 
    }, 
    async fetchData(searchTerm) {
        const response = await axios.get('http://www.omdbapi.com', {
            params: {
                apikey: 'efd0c43b',
                s: searchTerm
            }
        });
    
        if (response.data.Error) {
            return [];
        };
    
        //we are using a capitol s in Search because the term Search in the data we get back has a capitol s
        return response.data.Search;
        }
};


createAutoComplete({
   //the ... means to make a copy of everything inside that object and take all the different fxns inside there and throw them into this object and the add this root properity. 
    ...autocompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    
    onOptionSelect(movie) {
        //is-hidden will hide the tutorial on screen when the user clicks on a movie
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    }    
});

createAutoComplete({
     ...autocompleteConfig,
     root: document.querySelector('#right-autocomplete'),
     
     onOptionSelect(movie) {
        document.querySelector('.tutorial').classList.add('is-hidden')
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    }
 });



let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com', {
        params: {
            apikey: 'efd0c43b',
            i: movie.imdbID
        }
    });
   summaryElement.innerHTML = movieTemplate(response.data);

    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    //now add a check to make sure both movies are defined. If they are we can move on to the comparsions.
    if (leftMovie && rightMovie) {
        runComparison();
    }
};

const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];
        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        if (rightSideValue > leftSideValue) {
            //this removes the green color and adds in a yellow color
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    });
};

const movieTemplate = (movieDetial) => {
    //the backslash in front of $ allows us to 'escape' the fact that its a protected value (meaning js have an encoded definition reserved fot it)
    const dollars = parseInt(movieDetial.BoxOffice.replace(/\$/g,'').replace(/,/g,''));
    const metascore = parseInt(movieDetial.Metascore);
    const imdbRating = parseFloat(movieDetial.imdbRating);
    const imdbVotes = parseInt(movieDetial.imdbVotes.replace(/,/g,''));
    
    
 
//prev = previous value 
//in a reduce fxn, the first argument is previous value, and the second argument is the word that we are currently iterating over
//inside the fxn body, we need to make sure we return the next value for the next iteration loop 
    const awards = movieDetial.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);

        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0)


    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetial.Poster}" />
            </p>
        </figure>
        <div class="media-content">
            <h1>${movieDetial.Title}</h1>
            <h4>${movieDetial.Genre}</h4>
            <p>${movieDetial.Plot}</p>
        </div>
    </article>

    <article data-value=${awards} class="notification is-primary">
        <p class="title">${movieDetial.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
        <p class="title">${movieDetial.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>

    <article data-value=${metascore} class="notification is-primary">
        <p class="title">${movieDetial.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>

    <article data-value=${imdbRating} class="notification is-primary">
        <p class="title">${movieDetial.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
        <p class="title">${movieDetial.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>
    `;
};


// NOTES
//s = search 
//i = id = imBD 
//remember, when you make a request with axios there is usually a lot of pieces but the only property we usually care about is the 'data' property which has the actual info from the api  


//OUTLINE OF SEARCH WIDGET 
//1. default state: input box is empty
//2. user starts typing in input, after the user has stop typing for a set amount of time, the search string is then sent as a request to the api
//3. api returns search results (that match the input) as a drop down menu
//4. if user hits enter, noothing will happen
//5. user must click on one of the drop down items, which will then replace what they typed in, and show them stats on it 
//6. if user clicks outside of the drop down or input box, then drop down will dispear and nothing will happen


//debouncing an input = waiting for some time to pass after the last even to actually do something

