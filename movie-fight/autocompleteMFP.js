//ELISE MOVIE FIGHT PROJECT AUTOCOMPLETE 

//destructuring the root object --> so now the autocomplete fxn no longer has to figure out on its own where to render the autocomplete 
const createAutoComplete = ({
    root, 
    renderOption, 
    onOptionSelect, 
    inputValue, 
    fetchData
}) => {

    root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input" />
        <div class="dropdown"> 
            <div class="dropdown-menu">
                <div class="dropdown-content results"></div>
            </div>
        </div>
    `;

    const input = root.querySelector('input');
    const dropdown = root.querySelector('.dropdown');
    const resultsWrapper = root.querySelector('.results');

    const onInput = async e => {
        const items = await fetchData(e.target.value); 

        if (!items.length) {
            dropdown.classList.remove('is-active');
            return; 
        }

        resultsWrapper.innerHTML = '';
        dropdown.classList.add('is-active');

        for (let item of items) {
            const option = document.createElement('a');
            //if movie.Poster is equal to N/A then return an empty string (aka nothing), otherwise, return movie.Poster (which will be the movie poster)

            option.classList.add('dropdown-item');
            option.innerHTML = renderOption(item);
            option.addEventListener('click', () => {
                dropdown.classList.remove('is-active');
                inputValue(item);
                onOptionSelect(item);
            });

            resultsWrapper.appendChild(option);
        }
    };



    //another way to do this is to wrap onInput in debounce instead of the fxn above. 
    //this one would be used if we expected to call onInput multiple times from difference places and we only want it to debounce in some scenarios.
    //a delay such as 500 could be coded here as a third argument (below), otherwise it defaults to above coded 1000
    input.addEventListener('input', debounce(onInput, 500)); 

    document.addEventListener('click', e => {
        //if what was clicked on is NOT found in root, then close out of the dropdown
        //target = whatever was clicked on 
        if (!root.contains(e.target)) {
            dropdown.classList.remove('is-active')
        }
    })
};