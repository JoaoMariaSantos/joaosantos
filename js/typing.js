import { posts } from '/js/postList.js'; /* /joaosantos */

const about = "Hello! My name is João, I'm 22 years old and from Portugal. Currently doing a masters degree in Design and Multimedia and this website is an exercise for the course. Enjoy!";
const help = "Use letters and numbers to write and press enter to search. Pressing backspace will erase the last character. Write or press delete to reset the screen.";

const regex = /^[0-9a-zA-Z]+$/;

const container = document.querySelector('#canvas');
const backgroundText = document.querySelector('#instructions__text');
const inputText = document.querySelector('#inputText');
const blocker = document.querySelector('#instructions__text');

const portfolioURL = 'https://drive.google.com/file/d/1mGWpbq1SQyNWfmL_Ek3SiI2agA9B3_Ra/view?usp=share_link';
const spotifyURL = 'https://open.spotify.com/user/tellajoke?si=a044e4969dbc457d';

const builtInKeywords = ['help', 'about', 'keywords', 'reset', 'delete', 'erase', 'refresh', 'portfolio', 'spotify', 'random'];

let oldSearch; //for mobile
let currentSearch = '';
let currentLeft;
let lastTip;

const audioPath = '/assets/audio/';  /* /joaosantos */

const backspaceAudio = [new Audio(audioPath + 'back_1.wav'), new Audio(audioPath + 'back_2.wav'), new Audio(audioPath + 'back_3.wav')];
const otherAudio = [new Audio(audioPath + 'other_1.wav'), new Audio(audioPath + 'other_2.wav'), new Audio(audioPath + 'other_3.wav')];
const enterAudio = [new Audio(audioPath + 'enter_1.wav')];
const deleteAudio = [new Audio(audioPath + 'delete_1.wav')];

const tips = [
    'Try writing a color and then pressing enter!',
    'Type portfolio to get the pdf...',
    "'About' gets you my information",
    'Use letters or numbers to write and enter to search',
    'You can press backspace to erase the last character if you make a typo',
    'Writing delete erases the screen',
    "The border around the images means there's a link!",
    'Try dragging characters or images...',
    'Typing makes sounds',
    'Type featured to get some of my favorite works',
    'Type spotify to get yourself some nice playlists',
    '( ͡° ͜ʖ ͡°)',
    'Try breaking the website'
]

resetLeftValue();
detectMobileInput();

window.addEventListener('keydown', function (event) {
    const key = event.key.toLocaleLowerCase();
    if (testRegex(key) && key.length == 1) {
        typed(key);
        playSound(otherAudio);
    }
    else if (key === 'enter') {
        search();
        inputText.value = '';
        playSound(enterAudio);
    }
    else if (key === 'backspace') {
        removeCharacter();
        playSound(backspaceAudio);
    }
    else if (key === 'delete') {
        resetCanvas();
        playSound(deleteAudio);
    }
});

function detectMobileInput() {
    inputText.addEventListener('input', manageInput);
    inputText.addEventListener('submit', submittedInput);
    blocker.onclick = handleBlocker;

    /* if (inputText.display === 'block') { //display returns undefined??
        console.log('is block'); 
        inputText.addEventListener('input', manageInput);
        inputText.addEventListener('submit', submittedInput);
        //window.removeEventListener('keydown'); //wrong
    } */
}

function manageInput(e) {
    currentSearch = e.target.value;
    currentSearch = currentSearch.toLowerCase();
    currentSearch = currentSearch.replace(/[^a-z0-9]+/, '');
    e.target.value = currentSearch;

    if (currentSearch !== oldSearch) {
        if (currentSearch > oldSearch) {
            appendCharacter(currentSearch.slice(-1));
        }
        else if (currentSearch < oldSearch) {
            removeCharacter();
        }
    }
    playSound(otherAudio);
    oldSearch = currentSearch;
}

function submittedInput(e) {
    inputText.value = '';
    search();
    playSound(enterAudio);
}

function typed(c) {
    currentSearch += c;
    appendCharacter(c);
}

function appendCharacter(c) {
    const char = document.createElement('span');
    char.innerHTML = c;
    char.style.left = getLeftValue();
    char.classList.add('box2d');
    container.append(char);
    init();
}

function appendParagraph(text) {
    const par = document.createElement('p');
    par.innerHTML = text;
    par.style.left = getLeftValue();
    par.style.width = '50%';
    par.classList.add('box2d');
    container.append(par);
    init();
}

function search() {
    resetLeftValue();
    if (currentSearch.length > 0) {
        if (builtInKeywords.includes(currentSearch)) {
            getBuiltInResult(currentSearch);
        } else if(isInt(currentSearch)){
            const numSearch = parseInt(currentSearch);
            if(numSearch < posts.length){
                const searchResults = getNPosts(numSearch);
                appendPosts(searchResults);
                setBackgroundText(numSearch + " projects");
            }
            else setBackgroundText("That's too many projects...");
        }
        else {
            const searchResults = getSearchPosts(currentSearch);
            if (searchResults != null) {
                appendPosts(searchResults);
                setBackgroundText('Searched: ' + currentSearch + '<br>' + searchResults.length + ' results');

            } else {
                getRandomTip();
            }
            resetLeftValue();
        }
        if (isColor(currentSearch)) {
            console.log(currentSearch);
            document.querySelector('body').style.backgroundColor = currentSearch;
        }
    }
    currentSearch = '';
    init();
}

function removeCharacter() {
    currentSearch = currentSearch.slice(0, -1);
    if (!currentSearch) currentSearch = '';
    const characters = container.querySelectorAll('span');
    if (characters.length < 1) return;
    characters[characters.length - 1].remove();
}

function resetCanvas() {
    container.innerHTML = '';
    currentSearch = '';
    setBackgroundText('Fresh screen');
}

function getLeftValue() {
    currentLeft += Math.floor(Math.random() * 10 + 5);
    if (currentLeft > 100) resetLeftValue();
    return currentLeft + '%';
}

function resetLeftValue() {
    currentLeft = Math.floor(Math.random() * 5);
}

function getSearchPosts(search) {
    let searchResults = [];
    posts.forEach(post => {
        let postTerms = [];
        postTerms.push(post._title.replace(/\s+/g, '').toLowerCase());
        postTerms = postTerms.concat(post._tags);

        postTerms.forEach(term => {
            if (term.indexOf(search) > -1) {
                searchResults.push(post);
                //return false;
            }
        });
    });
    return [...new Set(searchResults)];
}

function getNPosts(n){
    console.log(n);

    let searchResults = [];
    let numbersArray = [];
    for(var i = 0; i < posts.length; i++) {
        numbersArray.push(i);
    }
    numbersArray = shuffle(numbersArray);
    numbersArray = numbersArray.slice(0, n);

    console.log(numbersArray);

    numbersArray.forEach(i => searchResults.push(posts[i]));

    return searchResults;
}

function appendPosts(posts) {
    posts.forEach(post => { appendPost(post) });
}

function appendPost(post) {
    const text = post._title + ', ' + post._year;

    post._gallery.forEach(url => {
        const a = document.createElement('a');
        const img = document.createElement('img');
        if (post._url.length > 5) {
            a.href = post._url;
            a.target = '_blank';
            img.classList.add('hasLink');
        }
        img.addEventListener('mouseover', function () { handleImgHover(text); });
        img.addEventListener('mouseout', function () { handleImgHover(); });
        img.classList.add('box2d');
        img.src = url;
        img.style.width = '15vw';
        img.style.left = getLeftValue();

        if (img.complete) {
            loaded();
        } else {
            img.addEventListener('load', loaded);
        }

        a.append(img);
        container.append(a);
    })
}

function loaded() {
    init();
}

function getBuiltInResult(srch) { //['help', 'about', 'keywords', 'reset', 'delete', 'erase', 'refresh', 'portfolio', 'spotify'];
    if (srch === 'help') {
        setBackgroundText(help);
        appendParagraph(help)
    } else if (srch === 'about') {
        setBackgroundText(about);
        appendParagraph(about);
    } else if (srch === 'keywords') {
        setBackgroundText('keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords');
    } else if (srch === 'reset' || srch === 'delete' || srch === 'erase') {
        resetCanvas();
    } else if (srch === 'refresh') {
        refresh();
    } else if (srch === 'portfolio') {
        window.open(portfolioURL, '_blank');
    } else if (srch === 'spotify') {
        window.open(spotifyURL, '_blank');
    } else if (srch === 'random') {
        const searchResults = [posts[Math.floor(Math.random()*posts.length)]];
        appendPosts(searchResults);
    }
}

function getRandomTip() {

    const pickedIndex = Math.floor(Math.random() * (tips.length - 1))
    const chosenTip = tips[pickedIndex];

    const lastTip = tips[tips.length - 1]
    tips[tips.length - 1] = chosenTip;
    tips[pickedIndex] = lastTip;

    setBackgroundText(chosenTip);
}

function setBackgroundText(text) {
    backgroundText.innerHTML = text;
}


function handleBlocker() {
    getRandomTip();
    console.log('blocker clicked');
}

function handleImgHover(text) {
    if (text) {
        lastTip = backgroundText.innerHTML;
        setBackgroundText(text);
    } else {
        setBackgroundText(lastTip);
    }
}

function playSound(sound) {
    sound[Math.floor(Math.random() * sound.length)].play();
}

function isColor(strColor) {
    var s = new Option().style;
    s.color = strColor;
    return s.color == strColor;
}

function testRegex(c) {
    return regex.test(c);
}

function refresh() {
    document.location.reload();
}

function isInt(num){
    const parsed = parseInt(num);
    let isnum = /^\d+$/.test(num);
    return !isNaN(parsed) && isnum;
}

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }