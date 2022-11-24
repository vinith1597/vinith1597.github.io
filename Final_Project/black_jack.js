var suits = ["Spades", "Hearts", "Clubs", "Diamonds"];

class Card {
  constructor(suit, rank) {
    this.suit = suit;
    this.rank = rank;
  }

  get desc() {
    var rank_str;
    if (this.rank == 1) rank_str = "Ace";
    else if (this.rank == 11) rank_str = "Jack";
    else if (this.rank == 12) rank_str = "Queen";
    else if (this.rank == 13) rank_str = "King";
    else rank_str = this.rank;

    return rank_str + " of " + suits[this.suit];
  }

  get image() {
    var rank_str;
    if (this.rank == 1) rank_str = "A";
    else if (this.rank == 11) rank_str = "J";
    else if (this.rank == 12) rank_str = "Q";
    else if (this.rank == 13) rank_str = "K";
    else rank_str = this.rank;

    return rank_str + suits[this.suit].charAt(0) + ".png";
  }
}

class Deck {
  constructor() {
    //Genertates all 52 cards in a deck
    this.deck = [];
    for (
      var suit = 0;
      suit < 4;
      suit++ //
    ) {
      for (var rank = 1; rank <= 13; rank++) {
        var card = new Card(suit, rank);
        this.deck[this.deck.length] = card;
      }
    }

    this.currentTopCardIndex = 0; //
  }

  shuffle() {
    for (var i = this.deck.length - 1; i > 0; i--) {
      // Pick a random index from 0 to i inclusive
      let j = Math.floor(Math.random() * (i + 1));

      // Swap arr[i] with the element
      // at random index
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  deal() {
    var topCard = this.currentTopCardIndex;
    this.currentTopCardIndex += 1;
    if (this.currentTopCardIndex >= this.deck.length) {
      console.log("Reset the deck...");
      this.shuffle();
      this.currentTopCardIndex = 0;
    }
    return this.deck[topCard];
  }
}

var showCards = function (cards) {
  for (var i = 0; i < cards.length; i++) {
    console.log(cards[i].desc);
  }
};

var showImages = function (cards, divId, addEmpty = false) {
  var src = document.getElementById(divId);
  src.innerHTML = "";
  for (var i = 0; i < cards.length; i++) {
    var img = document.createElement("img");
    if (addEmpty) {
      var closedCard = document.createElement("img");
      closedCard.src = "./PNG/red_back.png";
      src.append(closedCard);
    }
    img.src = "./PNG/" + cards[i].image;
    src.append(img);
  }
};

var isBlackJack = function (cards) {
  //You must only have two cards.
  if (cards.length == 2) {
    //The total points are 21
    if (sum(cards) == 21) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

var sum = function (cards) {
  var total = 0;
  var numOfAces = 0;

  for (var i = 0; i < cards.length; i++) {
    var rank = cards[i].rank;
    var point = 0;
    if (rank == 1) {
      point = 11;
      numOfAces += 1;
    } else if (rank == 11 || rank == 12 || rank == 13) {
      point = 10;
    } else {
      point = rank;
    }

    total += point;
  }

  for (var i = 0; i < numOfAces; i++) {
    if (total <= 21) break;
    total -= 10;
  }

  return total;
};

function displaySum(playerCards, id) {
  var playerSumElement = document.getElementById(id);
  playerSumElement.innerHTML = "POINTS:" + sum(playerCards);
}

function displayGameStatus(gameStatus) {
  var gameStatusElement = document.getElementById("gameStatus");
  gameStatusElement.innerHTML = gameStatus;
}

function displayPlayerStatus() {
  var gameStatusElement = document.getElementById("playerLimitStatus");
  gameStatusElement.innerHTML = "Hit limit reached!!";
}

function removeAllStatuses() {
  var gameStatusElement = document.getElementById("gameStatus");
  gameStatusElement.innerHTML = "";
  var playerLimitStatus = document.getElementById("playerLimitStatus");
  playerLimitStatus.innerHTML = "";
  var playerSumElement = document.getElementById("playerSum");
  playerSumElement.innerHTML = "";
  var dealerSumElement = document.getElementById("dealerSum");
  dealerSumElement.innerHTML = "";
}

window.onload = function () {
  //Create the deck
  var deckObj = new Deck();
  var playerCards = [];
  var dealerCards = [];
  var standStatus = false;
  var playerBurst = false;

  var src = document.getElementById("dealerCards");
  var closedCards = document.createElement("img");
  closedCards.src = "./PNG/back_cards-07.png";
  src.append(closedCards);

  var dealButtonListenerElement = document.getElementById("deal");
  dealButtonListenerElement.onclick = function () {
    playerCards = [];
    dealerCards = [];
    deckObj.shuffle();
    removeAllStatuses();
    //The dealer deals two cards to himself/herself
    dealerCards[dealerCards.length] = deckObj.deal();
    dealerCards[dealerCards.length] = deckObj.deal();

    //The dealer deals two cards to the player
    playerCards[playerCards.length] = deckObj.deal();
    playerCards[playerCards.length] = deckObj.deal();

    // do not show 1 card in dealer
    showImages([dealerCards[1]], "dealerCards", (addEmpty = true));

    //Show the cards from player
    console.log("Cards in your hands:");
    showCards(playerCards);
    showImages(playerCards, "playerCards");

    console.log("Total points in your hands:");
    displaySum(playerCards, "playerSum");
    console.log("===========================");
    console.log("Cards in dealer's hands:");
    standStatus = false;
    playerBurst = false;
    if (isBlackJack(playerCards)) {
      displayGameStatus("You've got a Black jack! You win!");
      return;
    }
  };

  var hitButtonListenerElement = document.getElementById("hit");
  hitButtonListenerElement.onclick = function () {
    var totalPointsOfPlayer = sum(playerCards);
    if (totalPointsOfPlayer >= 21) {
      displayPlayerStatus("Already reached limit! do not HIT!!");
      return;
    }

    playerCards[playerCards.length] = deckObj.deal();
    displaySum(playerCards, "playerSum");
    showImages(playerCards, "playerCards");
    totalPointsOfPlayer = sum(playerCards);
    if (totalPointsOfPlayer > 21) {
      displayGameStatus("You burst! You lose!");
      playerBurst = true;
      return;
    }
  };

  var standButtonListenerElement = document.getElementById("stand");
  standButtonListenerElement.onclick = function () {
    var totalPointsOfDealer = sum(dealerCards);
    if (standStatus || playerBurst) {
      return;
    }
    if (isBlackJack(dealerCards)) {
      showImages(dealerCards, "dealerCards");
      displayGameStatus("The dealer has got a Black jack! You lose!");
      return;
    }
    standStatus = true;
    showImages(dealerCards, "dealerCards");
    var getMoreCard = true;
    while (getMoreCard) {
      if (totalPointsOfDealer >= 17) {
        getMoreCard = false;
      } else {
        dealerCards[dealerCards.length] = deckObj.deal();
        showImages(dealerCards, "dealerCards");
        console.log("Total points in dealer's hands:");
        displaySum(dealerCards, "dealerSum");
        var totalPointsOfPlayer = sum(playerCards);
        totalPointsOfDealer = sum(dealerCards);
        if (totalPointsOfDealer > 21) {
          displayGameStatus("Dealer bursts! You win!");
          return;
        }
      }
    }
    var totalPointsOfPlayer = sum(playerCards);
    displaySum(dealerCards, "dealerSum");
    if (totalPointsOfPlayer > totalPointsOfDealer) {
      displayGameStatus("You win! (your points are greater than dealer)");
    } else if (totalPointsOfPlayer < totalPointsOfDealer) {
      displayGameStatus("You lose! (dealer points are greater)");
    } else {
      displayGameStatus("Draw! Good Game!");
    }
  };
};
