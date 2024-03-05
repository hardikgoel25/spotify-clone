let currentSong = new Audio();
let songs;
function secondsToMinutesAndSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Adding leading zero if necessary
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${minutes}:${formattedSeconds}`;
}


async function getSongs() {
    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text()
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3"))
            songs.push(element.href.split("/songs/")[1])
    }
    return songs
}
const playMusic = (track, pause = false) => {
    //let audio = new Audio("/songs/" + track)
    currentSong.src = "/songs/" + track
    if (!pause) {
        currentSong.play()
        playsvg.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}
getSongs()
async function main() {
    // get list of songs
    songs = await getSongs()
    playMusic(songs[0], true)
    //all songs
    let songUl = document.querySelector(".slist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
    <span>
        <img src="img/music.svg" alt="">
        <div class="inf">
            <span class="n songnam">${song.replaceAll("%20", " ")}</span>
            <span class="n">artist</span>
        </div>
    </span>
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="rgb(156, 155, 155)">
        <circle cx="12" fill="none" cy="12" r="10" stroke="rgb(156, 155, 155)" stroke-width="1"/>
        <path d="M15.4531 12.3948C15.3016 13.0215 14.5857 13.4644 13.1539 14.3502C11.7697 15.2064 11.0777 15.6346 10.5199 15.4625C10.2893 15.3913 10.0793 15.2562 9.90982 15.07C9.5 14.6198 9.5 13.7465 9.5 12C9.5 10.2535 9.5 9.38018 9.90982 8.92995C10.0793 8.74381 10.2893 8.60868 10.5199 8.53753C11.0777 8.36544 11.7697 8.79357 13.1539 9.64983C14.5857 10.5356 15.3016 10.9785 15.4531 11.6052C15.5156 11.8639 15.5156 12.1361 15.4531 12.3948Z" stroke="rgb(156, 155, 155)" stroke-width="1" stroke-linejoin="round"/>
        </svg>
</li>`
    }
    //attack event listener to each song
    Array.from(document.querySelector(".slist").getElementsByTagName("li")).forEach(e => {
        console.log(e)
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".inf").firstElementChild.innerHTML)
        })
    })
    //eventlistener for next or prev
    playsvg.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            playsvg.src = "img/pause.svg"
        }
        else {
            currentSong.pause()
            playsvg.src = "img/play.svg"
        }
    })
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesAndSeconds(currentSong.currentTime)}/${secondsToMinutesAndSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
        document.querySelector(".fill").style.width = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })
    document.querySelector(".seek").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = (percent * currentSong.duration) / 100
    })
    document.querySelector("#nextsvg").addEventListener("click", (e) => {
        console.log(currentSong.src)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })
    document.querySelector("#prevsvg").addEventListener("click", (e) => {
        console.log(currentSong.src)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0)
            playMusic(songs[index - 1])
    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume = parseInt(e.target.value)/100
    })
}
main()