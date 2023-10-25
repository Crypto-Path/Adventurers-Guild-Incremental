class RandomNameGenerator {
    constructor(language = null, gender = null) {
        this.selectedLanguage = language;
        this.selectedGender = gender;
        this.languages = {
            "en": {
                maleFirstNames: [
                    "Liam", "Noah", "Ethan", "Oliver", "James", "William", "Benjamin", "Lucas", "Henry", "Alexander",
                    "Mason", "Michael", "Daniel", "Logan", "Jackson", "Sebastian", "Aiden", "Matthew", "Samuel", "David",
                    "Joseph", "Carter", "Owen", "Wyatt", "John", "Jack", "Luke", "Jayden", "Dylan", "Grayson",
                    "Levi", "Isaac", "Gabriel", "Julian", "Mateo", "Anthony", "Jaxon", "Lincoln", "Joshua", "Christopher",
                    "Andrew", "Theodore", "Caleb", "Ryan", "Asher", "Nathan", "Thomas", "Leo", "Isaiah", "Charles",
                    "Josiah", "Hudson", "Christian", "Hunter", "Connor", "Eli", "Ezra", "Aaron", "Landon", "Adrian",
                    "Jonathan", "Nolan", "Jeremiah", "Easton", "Elias", "Colton", "Cameron", "Carson", "Robert", "Angel",
                    "Miles", "Dominic", "Austin", "Ian", "Adam", "Vincent", "Maxwell", "Santiago", "Jordan", "Max",
                    "Parker", "Evan", "Kai", "Bryson", "Alex", "Jace", "Sawyer", "Jason", "Diego", "Leon",
                    "Roman", "Elliot", "Kayden", "Corbin", "Waylon", "Luca", "Zane", "Silas", "Xavier", "Damian",
                    "Avery", "Andy", "Bradley", "Carlos", "Mario", "Fernando", "Javier", "Hector", "Luis", "Ricardo"
                    /* Add more male first names */
                ],
                femaleFirstNames: [
                    "Olivia", "Emma", "Ava", "Charlotte", "Sophia", "Amelia", "Isabella", "Mia", "Evelyn", "Harper",
                    "Camila", "Gianna", "Luna", "Chloe", "Layla", "Zoey", "Lucy", "Aubrey", "Lily", "Madelyn",
                    "Emily", "Paisley", "Nova", "Elena", "Hannah", "Emma", "Avery", "Mila", "Scarlett", "Abigail",
                    "Madison", "Ella", "Riley", "Penelope", "Ariana", "Nora", "Zoe", "Kinsley", "Hazel", "Lillian",
                    "Addison", "Brooklyn", "Savannah", "Grace", "Eliana", "Natalie", "Quinn", "Claire", "Victoria", "Everly",
                    "Aubree", "Kylie", "Stella", "Lucia", "Gabriella", "Zara", "Lila", "Arianna", "Kaylee", "Bella",
                    "Aaliyah", "Maria", "Sophie", "Jade", "Luna", "Sarah", "Audrey", "Melanie", "Valentina", "Allison",
                    "Genesis", "Alexa", "Aria", "Julia", "Liliana", "Kennedy", "Alice", "Raegan", "Taylor", "Leah",
                    "Hailey", "Eliana", "Katherine", "Madeline", "Alexandra", "Allison", "Vivian", "Gabrielle", "Peyton", "Nicole",
                    "Ruby", "Ariella", "Sadie", "Harley", "Valeria", "Adalyn", "Remi", "Jasmine", "Isabelle", "Paige"
                    /* Add more female first names */
                ],
                lastNames: [
                    "Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "García", "Rodríguez", "Martínez",
                    "Hernández", "López", "González", "Pérez", "Thomas", "Moore", "Martin", "Anderson", "Taylor", "Jackson"
                    /* Add more unique last names */
                ]
            },
            "jp": {
                maleFirstNames: [
                    "Haruto", "Yuto", "Sota", "Yuki", "Riku", "Kaito", "Ren", "Sora", "Hikaru", "Ryota",
                    "Yuta", "Yuki", "Takumi", "Kota", "Hayato", "Kakeru", "Ryuki", "Taiga", "Kazuki", "Sosuke",
                    "Kosei", "Daiki", "Tsubasa", "Koki", "Ryota", "Haruki", "Shota", "Kento", "Haru", "Shunya",
                    "Yuto", "Yuki", "Haruto", "Riku", "Sota", "Yuto", "Yuki", "Riku", "Kaito", "Ren",
                    "Sora", "Hikaru", "Ryota", "Yuta", "Yuki", "Takumi", "Kota", "Hayato", "Kakeru", "Ryuki",
                    "Taiga", "Kazuki", "Sosuke", "Kosei", "Daiki", "Tsubasa", "Koki", "Ryota", "Haruki", "Shota",
                    "Kento", "Haru", "Shunya", "Ryosuke", "Soma", "Rui", "Takeru", "Yuma", "Yusei", "Soma",
                    "Rui", "Takeru", "Yuma", "Yusei", "Ren", "Yuito", "Koichi", "Tomoaki", "Minato", "Kota",
                    "Takuya", "Hiroto", "Katsuki", "Ryo", "Naoki", "Sho", "Yamato", "Yudai", "Sota", "Yuki",
                    "Riku", "Kaito", "Ren", "Sora", "Hikaru", "Ryota", "Yuta", "Yuki", "Takumi", "Kota"
                    /* Add more male first names */
                ],
                femaleFirstNames: [
                    "Hana", "Yui", "Miu", "Yuna", "Sakura", "Koharu", "Aoi", "Ichika", "Sora", "Yuzuki",
                    "Riko", "Miyu", "Rio", "Kanon", "Rika", "Kokona", "Saki", "Akari", "Hinata", "Mao",
                    "Mio", "Rin", "Yume", "Rin", "Sara", "Yuna", "Yume", "Yua", "Mio", "Rin", "Yuzuki",
                    "Koharu", "Yume", "Aoi", "Hikari", "Kanon", "Hana", "Sakura", "Yui", "Ichika", "Riko",
                    "Kokona", "Yua", "Ichika", "Mio", "Yume", "Kokona", "Yua", "Yume", "Hinata", "Kokona",
                    "Yua", "Mio", "Yume", "Riko", "Sakura", "Hana", "Rin", "Ichika", "Mio", "Riko", "Hikari",
                    "Kanon", "Yuna", "Ichika", "Riko", "Kokona", "Mio", "Yua", "Yume", "Hinata", "Sakura",
                    "Hana", "Kanon", "Riko", "Ichika", "Kokona", "Yume", "Yua", "Hikari", "Mio", "Yuna",
                    "Yume", "Riko", "Kokona", "Yua", "Sakura", "Yuna", "Ichika", "Kokona", "Yua", "Yume",
                    "Sakura", "Hana", "Ichika", "Yua", "Yume", "Kokona", "Mio", "Riko", "Yuna", "Ichika"
                    /* Add more female first names */
                ],
                lastNames: [
                    "Sato", "Suzuki", "Takahashi", "Tanaka", "Watanabe", "Ito", "Yamamoto", "Nakamura", "Kobayashi", "Kato",
                    "Yoshida", "Yamada", "Sasaki", "Yamaguchi", "Matsumoto", "Inoue", "Kimura", "Shimizu", "Hayashi", "Shimada",
                    "Yamazaki", "Saito", "Yamashita", "Sakamoto", "Fujita", "Tamura", "Abe", "Ishikawa", "Murakami", "Okada",
                    "Nakajima", "Kojima", "Yano", "Ogawa", "Ikeda", "Kondo", "Nakayama", "Takahashi", "Sakai", "Ueda",
                    "Morita", "Sugiyama", "Nakagawa", "Hasegawa", "Takagi", "Maeda", "Fujita", "Matsuda", "Arai", "Ito",
                    "Sasaki", "Nakamura", "Shimizu", "Kimura", "Kobayashi", "Matsui", "Shimada", "Hayashi", "Kato", "Yoshida",
                    "Yamamoto", "Abe", "Saito", "Tamura", "Yamashita", "Ishikawa", "Fujita", "Murakami", "Shimada", "Sakai",
                    "Kojima", "Nakayama", "Hasegawa", "Ogawa", "Takagi", "Ueda", "Morita", "Nakagawa", "Matsuda", "Shimada",
                    "Arai", "Ito", "Sasaki", "Nakamura", "Hayashi", "Kato", "Kimura", "Yoshida", "Saito", "Yamashita",
                    "Shimizu", "Tamura", "Fujita", "Matsui", "Abe", "Kojima", "Nakayama", "Ogawa", "Takagi", "Shimada"
                    /* Add more last names */
                ]
            }
            // Add more languages with respective first names and last names
        };
    }

    setLang(language) {
        if (this.languages[language]) {
            this.selectedLanguage = language;
        } else {
            console.error("Invalid language.");
        }
    }

    setGender(gender) {
        if (this.selectedLanguage && this.languages[this.selectedLanguage]) {
            if (gender === "male" || gender === "female") {
                this.selectedGender = gender;
            } else {
                console.error("Invalid gender. Please use 'male' or 'female'.");
            }
        } else {
            console.error("Please set the language before selecting gender.");
        }
    }

    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    generateName() {
        if (!this.selectedLanguage) {
            console.error("Language not set. Please set the language before generating a name.");
            return null;
        }

        const selectedLanguageData = (this.selectedLanguage != null) ? this.languages[this.selectedLanguage] : this.getRandomItem(this.languages);
        let firstName;
        if (this.selectedGender === "male") {
            firstName = this.getRandomItem(selectedLanguageData.maleFirstNames);
        } else if (this.selectedGender === "female") {
            firstName = this.getRandomItem(selectedLanguageData.femaleFirstNames);
        } else {
            firstName = this.getRandomItem(selectedLanguageData.firstNames);
        }
        const lastName = this.getRandomItem(selectedLanguageData.lastNames);

        return `${firstName} ${lastName}`;
    }
}