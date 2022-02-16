var accessToken = 'BQBlg0MpekVx94PrV7zMUY2enXepBV8hsl-jzPzSsM2FhuX1LqjcqUUgKIetwPSqUobpFcdxRLCPTGfhHwdXCmmKfu0VCQGTbldu90So3AyRfdIzNn3aavr10FsWWPk91XpFh0tQaKqQxEE';

let clickableDiv = document.getElementById('searchResults'); 

let artistId;

let topTracksContainer = document.getElementById('topTracksContainer');

let form = document.getElementById('form');

form.addEventListener('submit', event => {
  event.preventDefault();
  removeAllChildNodes(clickableDiv);
  let searchArtist = event.target.aName.value;
  
  fetch(`https://api.spotify.com/v1/search?q=${searchArtist}&type=artist`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  })
  .then(response => response.json())
  .then(artistsData => {
    // console.log(artistsData);
    let items = artistsData.artists.items;
    for(let i = 0; i < 3; i++) {
      renderEachArtistsData(items[i]);
      
    };
  });

  form.reset();
});

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

function renderEachArtistsData(element) {
  // console.log(element.name, element.images[0]);
  let elementDiv = document.createElement('div');
  elementDiv.className = 'searchResults';
  let artistId = element.id;
  // console.log(artistId);

  let img = document.createElement('img');
  img.src = element.images[0].url;
  
  let name = document.createElement('p');
  name.textContent = element.name;

  elementDiv.appendChild(img);
  elementDiv.appendChild(name);
  elementDiv.addEventListener('click', event => {
    // console.log('i was clicked!')
    fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    })
    .then(response => response.json())
    .then(artist => { 
      console.log(artist);
      grabArtistDetails(artist);
      grabArtistTopTracks(artist)
    })
  })
  clickableDiv.append(elementDiv)
}

function grabArtistDetails(artist) {
  let artistName = artist.name;
  let artistFollowers = artist.followers.total;
  // artistId is in global and in parent function
  let artistImage = artist.images[0].url;

  let genreString = '';
  for(let g = 0; g < artist.genres.length; g++) {
    if (artist.genres[g] === artist.genres[artist.genres.length-1]) {
      genreString += artist.genres[g];
    } else {
    genreString += artist.genres[g] + ', ';
    }
  };
  // console.log(genreString);

  let image = document.getElementById('detailImage');
  image.src = artistImage;

  let name = document.getElementById('artistDetailsName');
  name.textContent = artistName;
  
  let followers = document.getElementById('followers');
  followers.textContent = artistFollowers;

  let genres = document.getElementById('genres');
  genres.textContent = genreString;
}

function grabArtistTopTracks(artist) {
  fetch(`https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  })
  .then(response => response.json())
  .then(topTracks => {
    let tracks = topTracks.tracks;
    tracks.forEach(track => {
      console.log(track.id);
      renderTopTracks(track);
    });
  })
}

function renderTopTracks(track) {
  let trackEmbed = document.createElement('div');
  trackEmbed.id = 'topTrackEmbed';
  let trackId = track.id;
  trackEmbed.innerHTML = 
    `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/${trackId}?utm_source=generator" width="100%" height="80" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`

  topTracksContainer.appendChild(trackEmbed);

  let trackPreview = document.createElement('a')
  trackPreview.href = track.preview_url;

  topTracksContainer.appendChild(trackPreview);
  
  // let trackImage = document.createElement('img');
  // trackImage.src = track.album.images[2].url;

  // topTracksContainer.appendChild(trackImage);
}