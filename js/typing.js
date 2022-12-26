import { posts } from '/joaosantos/js/postList.js'; /* /joaosantos */

const about = "Hello! My name is João, I'm 22 years old and from Portugal. Currently doing a masters degree in Design and Multimedia and this website is an exercise for the course. Enjoy!";

const regex = /^[0-9a-zA-Z]+$/;

const container = document.querySelector('#canvas');
const backgroundText = document.querySelector('#instructions__text');
const inputText = document.querySelector('#inputText');
const blocker = document.querySelector('#blocker');

const portfolioURL = 'https://drive.google.com/file/d/1mGWpbq1SQyNWfmL_Ek3SiI2agA9B3_Ra/view?usp=share_link';
const spotifyURL = 'https://open.spotify.com/user/tellajoke?si=a044e4969dbc457d';

const builtInKeywords = ['help', 'about', 'keywords', 'reset', 'delete', 'erase', 'refresh', 'portfolio', 'spotify'];

let oldSearch; //for mobile
let currentSearch = '';
let currentLeft;
let lastTip;

const backspaceAudio = [new Audio('/joaosantos/assets/audio/back_1.wav'), new Audio('/joaosantos/assets/audio/back_2.wav'), new Audio('/joaosantos/assets/audio/back_3.wav')]; /* /joaosantos */
const otherAudio = [new Audio('/joaosantos/assets/audio/other_1.wav'), new Audio('/joaosantos/assets/audio/other_2.wav'), new Audio('/joaosantos/assets/audio/other_3.wav')]; /* /joaosantos */
const enterAudio = [new Audio('/joaosantos/assets/audio/enter_1.wav')]; /* /joaosantos */
const deleteAudio = [new Audio('/joaosantos/assets/audio/delete_1.wav')]; /* /joaosantos */

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
    console.log('yoyoyo');
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

function search() {
    resetLeftValue();
    if (currentSearch.length > 0) {
        if (builtInKeywords.includes(currentSearch)) {
            getBuiltInResult(currentSearch);
        } else {
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

function getBuiltInResult(search) { //['help', 'about', 'keywords', 'reset', 'delete', 'erase', 'refresh', 'portfolio', 'spotify'];
    if (search === 'help') {
        setBackgroundText('Use letters and numbers to write, enter to search, backspace to erase last character and delete to erase the screen.');
    } else if (search === 'about') {
        setBackgroundText(about);
    } else if (search === 'keywords') {
        setBackgroundText('keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords');
    } else if (search === 'reset' || search === 'delete' || search === 'erase') {
        resetCanvas();
    } else if (search === 'refresh') {
        refresh();
    } else if (search === 'portfolio') {
        window.open(portfolioURL, '_blank');
    } else if (search === 'spotify') {
        window.open(spotifyURL, '_blank');
    }
}

function getRandomTip() {
    const tips = [
        'Try writing a color and then pressing enter!',
        'Type portfolio to get the pdf...',
        "'About' gets you my information :)",
        'Use letters or numbers to write and enter to search',
        'You can press backspace to erase the last character if you make a typo',
        'Writing delete erases the screen',
        "The border around the images means there's a link!",
        'Try dragging characters or images...',
        'Typing makes sounds',
        '( ͡° ͜ʖ ͡°)',
        'Type featured to get some of my favorite works',
        'Type spotify to get yourself some nice playlists',
        'Try breaking the website'
    ]

    const chosenTip = tips[Math.floor(Math.random() * tips.length)];

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