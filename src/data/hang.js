export const pic = [
  "https://i.postimg.cc/fR8Tk2fh/wtf1.png",
  "https://i.postimg.cc/xd7f3XZx/wtf2.png",
  "https://i.postimg.cc/R0qCt7gJ/wtf3.png",
  "https://i.postimg.cc/j57sgs0s/wtf4.png",
  "https://i.postimg.cc/1X0ySJ32/wtf5.png",
  "https://i.postimg.cc/KjhmCdxt/wtf6.png",
  "https://i.postimg.cc/Y2QrQqzR/wtf7.png",
  "https://i.postimg.cc/K8G8GSLN/wtf-win.png",
  "https://i.postimg.cc/zXSfYXLv/wtf-lose.png",
];
const randomWords = {
  "Animals 😺": [
    "DOG",
    "CAT",
    "ELEPHANT",
    "TIGER",
    "LION",
    "GIRAFFE",
    "ZEBRA",
    "MONKEY",
    "KANGAROO",
    "PANDA",
    "BEAR",
    "WOLF",
  ],
  "Colors 🎨": [
    "RED",
    "BLUE",
    "GREEN",
    "YELLOW",
    "ORANGE",
    "PURPLE",
    "PINK",
    "BROWN",
    "BLACK",
    "WHITE",
    "GREY",
    "VIOLET",
  ],
  "Fruits 🍎": [
    "APPLE",
    "BANANA",
    "CHERRY",
    "DATE",
    "ELDERBERRY",
    "FIG",
    "GRAPE",
    "KIWI",
    "LEMON",
    "MANGO",
    "NECTARINE",
    "ORANGE",
  ],
  "Countries 🌎": [
    "USA",
    "CANADA",
    "MEXICO",
    "BRAZIL",
    "ARGENTINA",
    "UK",
    "FRANCE",
    "GERMANY",
    "ITALY",
    "SPAIN",
    "CHINA",
    "JAPAN",
    "MALAYSIA",
  ],
  "Cities 🏙️": [
    "NEWYORK",
    "LOSANGELES",
    "CHICAGO",
    "HOUSTON",
    "PHOENIX",
    "PHILADELPHIA",
    "SANANTONIO",
    "SANDIEGO",
    "DALLAS",
    "SANJOSE",
    "AUSTIN",
    "ALORSETAR",
  ],
  "Professions 👷‍♂️": [
    "DOCTOR",
    "ENGINEER",
    "TEACHER",
    "NURSE",
    "SCIENTIST",
    "LAWYER",
    "ARCHITECT",
    "CHEF",
    "ARTIST",
    "MECHANIC",
    "PLUMBER",
    "ELECTRICIAN",
  ],
  "Sports 💪": [
    "SOCCER",
    "BASKETBALL",
    "BASEBALL",
    "TENNIS",
    "CRICKET",
    "HOCKEY",
    "GOLF",
    "BOXING",
    "SWIMMING",
    "CYCLING",
    "VOLLEYBALL",
    "RUGBY",
    "SILAT",
  ],
  "Vegetables 🥦": [
    "CARROT",
    "POTATO",
    "TOMATO",
    "ONION",
    "BROCCOLI",
    "SPINACH",
    "PEPPER",
    "CUCUMBER",
    "GARLIC",
    "LETTUCE",
    "PEAS",
    "CORN",
  ],
  "Vehicles 🚗": [
    "CAR",
    "TRUCK",
    "BICYCLE",
    "MOTORCYCLE",
    "BUS",
    "TRAIN",
    "AIRPLANE",
    "BOAT",
    "HELICOPTER",
    "SUBMARINE",
    "SCOOTER",
    "VAN",
  ],
  "Instruments 🎶": [
    "GUITAR",
    "PIANO",
    "VIOLIN",
    "DRUM",
    "FLUTE",
    "TRUMPET",
    "SAXOPHONE",
    "CELLO",
    "CLARINET",
    "HARP",
    "TROMBONE",
    "UKULELE",
  ],
};
export function random() {
  const category =
    Object.keys(randomWords)[
      Math.floor(Math.random() * Object.keys(randomWords).length)
    ];
  const word =
    randomWords[category][
      Math.floor(Math.random() * randomWords[category].length)
    ];
  return { category, word };
}