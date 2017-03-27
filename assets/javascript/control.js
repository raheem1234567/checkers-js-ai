$(document).ready(function() {
  buildBoard();
  populateBoard();

  // put here since if not it won't work due to sequence of dom loading
  $('.odd').each(function() {
    var $this = $(this);
    $this.click(function() {
      if (globals.game.status == "running" && globals.game.currentState.turn == "W" && $this.html() == "W") {
        var index = parseInt($this.data('index'));

        var possibleMoves = globals.game.currentState.indexValidMoves(index)
        var endingLocations = possibleMoves.map(function(x) {return x[1]})
        endingLocations = endingLocations.filter(function(x) {return x != undefined});

        var board = $('.cell');
        $('.possibles').removeClass('possibles');

        endingLocations.forEach(function(location) {
          $(board[location]).addClass('possibles');
        })

        $('.possibles').each(function() {
          var $thistoo = $(this);
          $thistoo.click(function() {
            $('.possibles').removeClass('possibles');

            var endPosition = parseInt($thistoo.data('index'));
            var next = new State(globals.game.currentState);

            next.board[index] = "E";
            next.board[endPosition] = "W";

            if (Math.abs(endPosition - index) > 11) {
              next.board[(endPosition + index) / 2] = "E";
              next.state.capBlackPieces++;
            }

            human.playMove(index, endPosition, "W");

            next.advanceTurn();

            globals.game.advanceTo(next);
          })
        })
      }
    })
  })

})

// This deals with the user control on the site
// set storage for variables in the site
var globals = {};

// choose difficulty level
$('.level').each(function() {
  var $this = $(this);
  $this.click(function() {
    $('.selected').toggleClass('not-selected');
    $('.selected').toggleClass('selected');
    $this.toggleClass('not-selected');
    $this.toggleClass('selected');

    ai.level = $this.attr('id');

    $('.start').fadeIn();
  })
})

// Start game
$('.start').click(function() {
  var selectedDifficulty = $('.selected').attr('id');
  if (typeof selectedDifficulty !== "undefined") {
    var aiPlayer = new AI(selectedDifficulty);
    globals.game = new Game(aiPlayer);

    aiPlayer.plays(globals.game);

    globals.game.start();

    $('.title').fadeOut();
  }
})

// Allow restarting of the game
$('.messages').click(function() {
  if (globals.game.status == "ended") {
    var board = $('.cell');

    for (i = 0; i < board.length; i++) {
      $(board[i]).html('');
    }

    var difficulties = $('.level');

    for (i = 0; i < difficulties.length; i++) {
      $(difficulties[i]).removeClass('selected');
      $(difficulties[i]).addClass('not-selected');
    }

    $('.title').fadeIn();
    $('.initial').fadeIn();
    $('.ingame').fadeOut();
    $('.messages').fadeOut();
    $('.start').hide();
    human.initialControlsVisible = true;
  }
})