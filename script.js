/* ========================================
   PURANE GAANE
   MAIN JAVASCRIPT
======================================== */


/* ========================================
   SONG DATA
======================================== */

const songs = [

    {
        title: "Highway Memories",
        artist: "Purane Gaane Collection",
        category: "truck",
        file: "assets/songs/song1.mp3",
        image: "assets/images/truck.jpg"
    },

    {
        title: "Salon Classics",
        artist: "Evergreen Collection",
        category: "salon",
        file: "assets/songs/song2.mp3",
        image: "assets/images/salon.jpg"
    },

    {
        title: "90s Memories",
        artist: "Golden Era Collection",
        category: "romantic",
        file: "assets/songs/song3.mp3",
        image: "assets/images/romantic.jpg"
    },

    {
        title: "Dil Se Purane",
        artist: "Classic Collection",
        category: "sad",
        file: "assets/songs/song4.mp3",
        image: "assets/images/sad.jpg"
    }

];


/* ========================================
   PLAYER VARIABLES
======================================== */

let currentSong = 0;

let currentSongs = [...songs];

let isPlaying = false;


const audio = new Audio();

audio.volume = 0.8;


const playButton =
    document.getElementById("play-btn");

const previousButton =
    document.getElementById("previous-btn");

const nextButton =
    document.getElementById("next-btn");


const title =
    document.getElementById("player-title");

const artist =
    document.getElementById("player-artist");


const playerImage =
    document.getElementById("player-image");


const progress =
    document.getElementById("progress");

const currentTime =
    document.getElementById("current-time");

const duration =
    document.getElementById("duration");


const volume =
    document.getElementById("volume");


const songContainer =
    document.getElementById("song-container");


const songsHeading =
    document.getElementById("songs-heading");


const searchInput =
    document.getElementById("search-input");


const clearSearch =
    document.getElementById("clear-search");


const menuToggle =
    document.getElementById("menu-toggle");


const navLinks =
    document.getElementById("nav-links");


/* ========================================
   LOCAL STORAGE
======================================== */

let favorites =
    JSON.parse(
        localStorage.getItem("favorites")
    ) || [];


let recentlyPlayed =
    JSON.parse(
        localStorage.getItem("recentlyPlayed")
    ) || [];


/* ========================================
   DISPLAY SONGS
======================================== */

function displaySongs(songList) {

    songContainer.innerHTML = "";


    if (songList.length === 0) {

        songContainer.innerHTML = `

            <div class="no-results">

                <div class="no-results-icon">
                    🎵
                </div>

                <h3>
                    No Songs Found
                </h3>

                <p>
                    Try another song, artist or category.
                </p>

            </div>

        `;

        return;

    }


    songList.forEach(function(song, index) {

        const card =
            document.createElement("article");


        card.className =
            "song-card";


        const favoriteIcon =
            isFavorite(song.title)
                ? "❤️"
                : "♡";


        card.innerHTML = `

            <div class="album-image">

                <img
                    src="${song.image}"
                    alt="${song.title}"
                >


                <button
                    class="favorite-btn"
                    type="button"
                    aria-label="Favorite ${song.title}"
                    data-song="${song.title}"
                >
                    ${favoriteIcon}
                </button>

            </div>


            <div class="song-card-content">

                <h3>
                    ${song.title}
                </h3>

                <p>
                    ${song.artist}
                </p>


                <button
                    class="song-play-btn"
                    type="button"
                    data-index="${index}"
                >
                    ▶ Play
                </button>

            </div>

        `;


        const favoriteButton =
            card.querySelector(
                ".favorite-btn"
            );


        favoriteButton.addEventListener(
            "click",
            function() {

                toggleFavorite(
                    song.title
                );

            }
        );


        const playSongButton =
            card.querySelector(
                ".song-play-btn"
            );


        playSongButton.addEventListener(
            "click",
            function() {

                selectSong(index);

            }
        );


        songContainer.appendChild(card);

    });

}


/* ========================================
   SELECT SONG
======================================== */

function selectSong(index) {

    const song =
        currentSongs[index];


    if (!song) {

        return;

    }


    currentSong = index;

    loadSong(currentSong);

    playCurrentSong();

}


/* ========================================
   LOAD SONG
======================================== */

function loadSong(index) {

    const song =
        currentSongs[index];


    if (!song) {

        return;

    }


    title.textContent =
        song.title;


    artist.textContent =
        song.artist;


    playerImage.src =
        song.image;


    playerImage.alt =
        song.title;


    audio.src =
        song.file;


    audio.load();


    progress.value = 0;


    currentTime.textContent =
        "0:00";


    duration.textContent =
        "0:00";

}


/* ========================================
   PLAY SONG
======================================== */

function playCurrentSong() {

    const song =
        currentSongs[currentSong];


    if (!song) {

        return;

    }


    addToRecentlyPlayed(song);


    audio.play()
        .then(function() {

            isPlaying = true;

            playButton.textContent =
                "⏸";

        })
        .catch(function(error) {

            console.log(
                "Audio could not play:",
                error
            );

            isPlaying = false;

            playButton.textContent =
                "▶";

        });


    displayPersonalSections();

}


/* ========================================
   PAUSE SONG
======================================== */

function pauseCurrentSong() {

    audio.pause();

    isPlaying = false;

    playButton.textContent =
        "▶";

}


/* ========================================
   PLAY / PAUSE BUTTON
======================================== */

playButton.addEventListener(
    "click",
    function() {

        if (isPlaying) {

            pauseCurrentSong();

        } else {

            playCurrentSong();

        }

    }
);


/* ========================================
   NEXT SONG
======================================== */

nextButton.addEventListener(
    "click",
    function() {

        if (
            currentSongs.length === 0
        ) {

            return;

        }


        currentSong++;


        if (
            currentSong >=
            currentSongs.length
        ) {

            currentSong = 0;

        }


        loadSong(currentSong);

        playCurrentSong();

    }
);


/* ========================================
   PREVIOUS SONG
======================================== */

previousButton.addEventListener(
    "click",
    function() {

        if (
            currentSongs.length === 0
        ) {

            return;

        }


        currentSong--;


        if (currentSong < 0) {

            currentSong =
                currentSongs.length - 1;

        }


        loadSong(currentSong);

        playCurrentSong();

    }
);


/* ========================================
   AUDIO TIME UPDATE
======================================== */

audio.addEventListener(
    "timeupdate",
    function() {

        if (!audio.duration) {

            return;

        }


        const percentage =
            (
                audio.currentTime /
                audio.duration
            ) * 100;


        progress.value =
            percentage;


        currentTime.textContent =
            formatTime(
                audio.currentTime
            );

    }
);


/* ========================================
   AUDIO DURATION
======================================== */

audio.addEventListener(
    "loadedmetadata",
    function() {

        duration.textContent =
            formatTime(
                audio.duration
            );

    }
);


/* ========================================
   AUDIO ERROR
======================================== */

audio.addEventListener(
    "error",
    function() {

        console.log(
            "Audio file could not be loaded:",
            audio.src
        );

    }
);


/* ========================================
   PROGRESS SEEK
======================================== */

progress.addEventListener(
    "input",
    function() {

        if (!audio.duration) {

            return;

        }


        audio.currentTime =
            (
                progress.value / 100
            ) * audio.duration;

    }
);


/* ========================================
   VOLUME
======================================== */

volume.addEventListener(
    "input",
    function() {

        audio.volume =
            Number(volume.value);

    }
);


/* ========================================
   SONG ENDED
======================================== */

audio.addEventListener(
    "ended",
    function() {

        nextButton.click();

    }
);


/* ========================================
   FORMAT TIME
======================================== */

function formatTime(time) {

    if (
        isNaN(time) ||
        !isFinite(time)
    ) {

        return "0:00";

    }


    const minutes =
        Math.floor(time / 60);


    const seconds =
        Math.floor(time % 60);


    return (
        minutes +
        ":" +
        seconds
            .toString()
            .padStart(2, "0")
    );

}


/* ========================================
   CATEGORY FILTER
======================================== */

function showCategory(category) {

    currentSongs =
        songs.filter(
            function(song) {

                return (
                    song.category ===
                    category
                );

            }
        );


    currentSong = 0;


    const categoryNames = {

        truck:
            "🚛 Truck Driver Special",

        salon:
            "💈 Salon Classics",

        romantic:
            "❤️ Romantic Songs",

        sad:
            "😢 Dard Bhare Nagme"

    };


    songsHeading.textContent =
        categoryNames[category] ||
        "Popular Old Songs";


    displaySongs(
        currentSongs
    );


    document
        .getElementById("songs")
        .scrollIntoView({

            behavior: "smooth"

        });


    if (
        currentSongs.length > 0
    ) {

        loadSong(0);

    }

}


/* ========================================
   SCROLL TO SONGS
======================================== */

function scrollToSongs() {

    document
        .getElementById("songs")
        .scrollIntoView({

            behavior: "smooth"

        });

}


/* ========================================
   SEARCH
======================================== */

searchInput.addEventListener(
    "input",
    function() {

        const searchText =
            searchInput.value
                .trim()
                .toLowerCase();


        clearSearch.style.display =
            searchText
                ? "block"
                : "none";


        if (!searchText) {

            currentSongs =
                [...songs];


            currentSong = 0;


            songsHeading.textContent =
                "Popular Old Songs";


            displaySongs(
                currentSongs
            );


            return;

        }


        const filteredSongs =
            songs.filter(
                function(song) {

                    return (

                        song.title
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                        ||

                        song.artist
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                        ||

                        song.category
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                    );

                }
            );


        currentSongs =
            filteredSongs;


        currentSong = 0;


        songsHeading.textContent =
            filteredSongs.length > 0
                ? "Search Results"
                : "No Songs Found";


        displaySongs(
            filteredSongs
        );

    }
);


/* ========================================
   CLEAR SEARCH
======================================== */

clearSearch.addEventListener(
    "click",
    function() {

        searchInput.value =
            "";


        clearSearch.style.display =
            "none";


        currentSongs =
            [...songs];


        currentSong = 0;


        songsHeading.textContent =
            "Popular Old Songs";


        displaySongs(
            currentSongs
        );

    }
);


/* ========================================
   FAVORITES
======================================== */

function isFavorite(songTitle) {

    return favorites.includes(
        songTitle
    );

}


function toggleFavorite(songTitle) {

    if (
        isFavorite(songTitle)
    ) {

        favorites =
            favorites.filter(
                function(song) {

                    return (
                        song !== songTitle
                    );

                }
            );

    } else {

        favorites.push(
            songTitle
        );

    }


    localStorage.setItem(
        "favorites",
        JSON.stringify(
            favorites
        )
    );


    displaySongs(
        currentSongs
    );


    displayPersonalSections();

}


/* ========================================
   RECENTLY PLAYED
======================================== */

function addToRecentlyPlayed(song) {

    recentlyPlayed =
        recentlyPlayed.filter(
            function(item) {

                return (
                    item.title !==
                    song.title
                );

            }
        );


    recentlyPlayed.unshift(
        song
    );


    if (
        recentlyPlayed.length > 5
    ) {

        recentlyPlayed =
            recentlyPlayed.slice(
                0,
                5
            );

    }


    localStorage.setItem(
        "recentlyPlayed",
        JSON.stringify(
            recentlyPlayed
        )
    );

}


/* ========================================
   DISPLAY FAVORITES & RECENT
======================================== */

function displayPersonalSections() {

    const favoritesInfo =
        document.getElementById(
            "favorites-info"
        );


    const recentInfo =
        document.getElementById(
            "recent-info"
        );


    if (
        favorites.length === 0
    ) {

        favoritesInfo.innerHTML = `

            <div class="empty-personal">

                <span>❤️</span>

                <p>
                    No favorite songs yet.
                </p>

            </div>

        `;

    } else {

        favoritesInfo.innerHTML =

            favorites.map(
                function(songTitle) {

                    return `

                        <div class="personal-song">

                            ❤️

                            <span>
                                ${songTitle}
                            </span>

                        </div>

                    `;

                }
            ).join("");

    }


    if (
        recentlyPlayed.length === 0
    ) {

        recentInfo.innerHTML = `

            <div class="empty-personal">

                <span>🕘</span>

                <p>
                    No recently played songs yet.
                </p>

            </div>

        `;

    } else {

        recentInfo.innerHTML =

            recentlyPlayed.map(
                function(song) {

                    return `

                        <div class="personal-song">

                            🎵

                            <span>
                                ${song.title}
                            </span>

                        </div>

                    `;

                }
            ).join("");

    }

}


/* ========================================
   MOBILE MENU
======================================== */

menuToggle.addEventListener(
    "click",
    function() {

        navLinks.classList.toggle(
            "active"
        );

    }
);


document
    .querySelectorAll(
        ".nav-links a"
    )
    .forEach(
        function(link) {

            link.addEventListener(
                "click",
                function() {

                    navLinks.classList.remove(
                        "active"
                    );

                }
            );

        }
    );


/* ========================================
   INITIALIZE WEBSITE
======================================== */

displaySongs(
    currentSongs
);


loadSong(0);


displayPersonalSections();


