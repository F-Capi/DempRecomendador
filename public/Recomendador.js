

let songsearch = document.getElementById("song-btn");
songsearch.addEventListener("click", SearchSong);


let artistsearch = document.getElementById("artist-btn");
artistsearch.addEventListener("click", SearchArtist);

let obj = { cancion: "", artista: "", genero: "" }

var generos = [
    "Pop",
    "Rock",
    "Jazz",
    "R&B",
    "Hip-hop",
    "Electrónica",
    "Reggae",
    "Country",
    "Blues",
    "Clásica",
    "Folk",
    "Soul",
    "Funk",
    "Metal",
    "Punk",
    "Indie",
    "Dance",
    "Reggaetón",
    "Salsa",
    "Merengue",
    "Cumbia",
    "Bachata",
    "Gospel",
    "Disco",
    "Trap",
    "House",
    "Techno",
    "Grunge",
    "Alternativa",
    "Rap",
    "New Age",
    "Instrumental",
    "Ska",
    "Opera",
    "Fusión",
    "Rhythm and Blues (R&B)",
    "Samba",
    "Hard Rock",
    "Downtempo",
    "Drum and Bass",
    "Flamenco",
    "Funky",
    "Heavy Metal",
    "Hip House",
    "Indie Pop",
    "Indie Rock",
    "Industrial",
    "J-Pop",
    "K-Pop",
    "Lounge",
    "Música clásica contemporánea",
    "Música experimental",
    "Música industrial",
    "Música minimalista",
    "Música vocal",
    "New Wave",
    "Post-punk",
    "Rock alternativo",
    "Rock progresivo",
    "Rock psicodélico",
    "Rock sinfónico",
    "Ska punk",
    "Swing",
    "Synth-pop",
    "Tango",
    "Trance",
    "Tropical",
    "Vallenato",
    "World Music"
];

function resetTodo() {
    obj.cancion = "";
    obj.genero = "";
    obj.artista = "";

    var box = document.querySelector("#song-suggestion-container");
    box.innerHTML = "";

    let fav = document.querySelector("#artist-suggestion-container");
    fav.innerHTML = "";

    let informacionartista = document.getElementById("favorite-artist");
    informacionartista.innerHTML = "";



    let fav2 = document.querySelector("#favorite-song");
    fav2.innerHTML = "";
}

const select_genre = document.getElementById("select_generos")
for (let index = 0; index < generos.length; index++) {
    let genre = generos[index]
    let option = document.createElement("option");
    option.value = genre;
    option.innerHTML = genre;
    select_genre.appendChild(option);
}

function SearchSong() {
    let inp = document.getElementById("search-song");
    if (inp.value.length < 3) {
        return
    }
    //ella&baila&sola
    let value = inp.value;
    const nombreCancionEncoded = encodeURIComponent(value);
    const url = `https://itunes.apple.com/search?term=${nombreCancionEncoded}&media=music`;


    fetch(url)
        .then(response => response.json())
        .then(data => {


            var box = document.querySelector("#song-suggestion-container");
            box.innerHTML = "";
            var songs = data.results.slice(0, 7);


            for (let index = 0; index < songs.length; index++) {
                var el = document.createElement("div");
                el.classList.add("song");
                el.innerHTML = `<span class='song-title'>${songs[index].trackName}</span><span>by ${songs[index].artistName}</span>`
                box.append(el);
                el.addEventListener("click", () => {
                    let fav = document.querySelector("#favorite-song");
                    fav.innerHTML = "";
                    let chosen = document.createElement("div");
                    chosen.classList.add("chosen-song");
                    chosen.innerHTML = `<h3>${songs[index].trackName}</h3><span>by ${songs[index].artistName}</span><br><img class='img-song' src="${songs[index].artworkUrl100}"<br>`
                    let audio = document.createElement("audio");
                    audio.controls = true;
                    audio.src = songs[index].previewUrl;
                    chosen.appendChild(audio);
                    fav.append(chosen);

                    obj.cancion = songs[index].trackName;
                    console.log(obj);
                });
            }


        })
        .catch(error => {
            console.error('Error:', error);
        });
}






function SearchArtist() {
    let inp = document.getElementById("search-artist");
    if (inp.value.length < 3) {
        return
    }
    let value = inp.value;
    const nombreArtistaEncoded = encodeURIComponent(value);
    const url = `https://itunes.apple.com/search?term=${nombreArtistaEncoded}&entity=musicArtist`;

    fetch(url).then(response => response.json())
        .then((data) => {
            let fav = document.querySelector("#artist-suggestion-container");
            fav.innerHTML = "";


            let artists = data.results.slice(0, 5);


            for (let posicion = 0; posicion < artists.length; posicion++) {
                let el = document.createElement("div");
                el.classList.add("artist");
                el.innerHTML = `<span>${artists[posicion].artistName}</span>`;
                el.addEventListener("click", () => {
                    let informacionartista = document.getElementById("favorite-artist");
                    informacionartista.innerHTML = ""
                    let chosen = document.createElement("div");
                    chosen.classList.add("chosen-artist")
                    chosen.innerHTML = `<h3 class="favorite-artist-name">${artists[posicion].artistName}</h3><span class='favorite-artist-genre'>Genre: ${artists[posicion].primaryGenreName}</span><a target='_blank' class='favorite-artist-link' href='${artists[posicion].artistLinkUrl}'>Ver artista</a>`;
                    informacionartista.append(chosen);


                    obj.artista = artists[posicion].artistName;
                    console.log(obj);

                });
                fav.append(el);


            }
        }).catch(error => console.log(error));
}

var send = document.getElementById("send-btn")

send.addEventListener("click", () => {
    if (obj.cancion !== "" && obj.artista !== "") {
        console.log(obj);
        obj.genero = select_genre.value;
        document.getElementById('loading').classList.remove('loading-hidden');
        document.getElementById('loading').classList.add('loading-visible');


        fetch("/recomendacion", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                document.getElementById('loading').classList.remove('loading-visible');
                document.getElementById('loading').classList.add('loading-hidden');
                resetTodo();

                /*
                let r = document.getElementById("recomendation");
                r.innerHTML = "";
                let chosen = document.createElement("div");
                chosen.classList.add("chosen-song");
                chosen.innerHTML = `<h3>${data.cancion}</h3>`;
                r.appendChild(chosen);*/
                getRecomendación(data.cancion);
            })
            .catch(error => {
                console.log(error);
                document.getElementById('loading').classList.remove('loading-visible');
                document.getElementById('loading').classList.add('loading-hidden');
            });


    } else {
        console.log(obj);
        alert("No has acabado de contestar las preguntas");
    }
});



function getRecomendación(value) {
    const nombreCancionEncoded = encodeURIComponent(value);
    const url = `https://itunes.apple.com/search?term=${nombreCancionEncoded}&media=music`;


    fetch(url)
        .then(response => response.json())
        .then(data => {
            var song = data.results[0];

            let fav = document.querySelector("#recomendation");
            fav.innerHTML = "";
            let chosen = document.createElement("div");
            chosen.classList.add("chosen-song");
            chosen.innerHTML = `<h3>${song.trackName}</h3><span>by ${song.artistName}</span><br><img class='img-song' src="${song.artworkUrl100}"<br>`
            let audio = document.createElement("audio");
            audio.controls = true;
            audio.src = song.previewUrl;
            chosen.appendChild(audio);
            fav.append(chosen);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}
