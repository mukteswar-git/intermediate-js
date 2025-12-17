const SHUFFLE_STATE = Symbol('shuffleState');

class Playlist {
  constructor() {
    this.songs = [];
    this[SHUFFLE_STATE] = false;
  }

  add(song) {
    this.songs.push(song);
  }

  shuffle(enabled) {
    this[SHUFFLE_STATE] = enabled;
  }

  [Symbol.iterator]() {
    let songs = [...this.songs];

    if(this[SHUFFLE_STATE]) {
      // Fisher-Yates shuffle
      for(let i = songs.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [songs[i], songs[j]] = [songs[j], songs[i]];
      }
    }

    let index = 0;

    return {
      next() {
        if (index < songs.length) {
          return { value: songs[index++], done: false };
        }
        return { done: true };
      }
    };
  }
}

// Test
const playlist = new Playlist();
playlist.add('Bohemian Rhapsody');
playlist.add('Stairway to Heaven');
playlist.add('Hotel California');

console.log('Normal order:');
for (const song of playlist) {
  console.log(song);
}

playlist.shuffle(true);
console.log('\nShuffled');
for (const song of playlist) {
  console.log(song);
}

console.log('\nVisible properties:', Object.keys(playlist));