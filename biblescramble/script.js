const books = [
    "genesis", "exodus", "leviticus", "numbers", "deuteronomy", "joshua", "judges",
    "ruth", "samuel", "kings", "chronicles", "ezra", "nehemiah", "esther",
    "job", "psalms", "proverbs", "ecclesiastes", "isaiah", "jeremiah", "lamentations",
    "ezekiel", "daniel", "hosea", "joel", "amos", "obadiah", "jonah",
    "micah", "nahum", "habakkuk", "zephaniah", "haggai", "zechariah", "malachi",
    "matthew", "mark", "luke", "john", "acts", "romans", "corintians",
    "galatians", "ephesians", "philippians", "colossians", "thessalonians", "timothy", "titus",
    "philemon", "hebrews", "james", "peter", "john", "jude", "revelation"
];
LENGTH = books.length;

onload = () => {
    viewBook = document.getElementById("viewBook");
    button = document.getElementsByTagName("button")[0];
    button.onclick = () => {
        let book = books[parseInt(LENGTH * Math.random())];
        viewBook.textContent = scramble(book);
    }
}

function scramble(word) {
    const arr = word.split("");
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join("");
}
