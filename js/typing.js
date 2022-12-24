import { posts } from '/joaosantos/js/postList.js'; /* /joaosantos */

const about = "Hello! My name is João, I'm 22 years old and from Portugal. Currently doing a masters degree in Design and Multimedia and this website is an exercise for the course. Enjoy!";

const regex = /^[0-9a-zA-Z]+$/;
const container = document.querySelector('#canvas');
const backgroundText = document.querySelector('#instructions__text');

const builtInKeywords = ['help', 'about', 'keywords'];

let currentSearch = '';
let currentLeft;

const backspaceAudio = [new Audio('/joaosantos/assets/audio/back_1.wav'), new Audio('/joaosantos/assets/audio/back_2.wav'), new Audio('/joaosantos/assets/audio/back_3.wav')]; /* /joaosantos */
const otherAudio = [new Audio('/joaosantos/assets/audio/other_1.wav'), new Audio('/joaosantos/assets/audio/other_2.wav'), new Audio('/joaosantos/assets/audio/other_3.wav')]; /* /joaosantos */
const enterAudio = [new Audio('/joaosantos/assets/audio/enter_1.wav')]; /* /joaosantos */
const deleteAudio = [new Audio('/joaosantos/assets/audio/delete_1.wav')]; /* /joaosantos */

resetLeftValue();

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
    getRandomTip();
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
        if (post._url.length > 5) {
            a.href = post._url;
            a.target = '_blank';
        }
        const img = document.createElement('img');
        img.addEventListener('mouseover', function () { setBackgroundText(text); });
        img.addEventListener('mouseout', function () { getRandomTip(); });
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

function loaded(){
    init();
}

function getBuiltInResult(search) {
    if (search === builtInKeywords[0]) {
        setBackgroundText('Use letters and numbers to write, enter to search, backspace to erase last character and delete to erase the screen.');
    } else if (search === builtInKeywords[1]) {
        setBackgroundText(about);
    } else if (search === builtInKeywords[2]) {
        setBackgroundText('keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords keywords');
    }
}

function getRandomTip() {
    const tips = [
        'Try writing a color and then pressing enter!',
        'Type portfolio to get the pdf...',
        "'About' gets you my information :)",
        'Use letters or numbers to write and enter to search',
        'You can use backspace to erase last character if you make a typo',
        'Pressing delete erases the screen and gets you a new tip',
        'Check the cursor, some images have links',
        'Try dragging characters or images...',
        'Typing makes sounds!',
        '( ͡° ͜ʖ ͡°)'
    ]

    const chosenTip = tips[Math.floor(Math.random() * tips.length)];

    setBackgroundText(chosenTip);
}

function setBackgroundText(text) {
    backgroundText.innerHTML = text;
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
