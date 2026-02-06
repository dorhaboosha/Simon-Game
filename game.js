/**
 * Simon Game - A memory game where the player must repeat an increasingly
 * complex sequence of coloured buttons. Press any key to start.
 * @requires jQuery
 */

/** @type {string[]} Available button colours in the game */
var buttonColours = ["red", "blue", "green", "yellow"];

/** @type {string[]} The sequence the game generates for the player to repeat */
var gamePattern = [];

/** @type {string[]} The sequence of colours the player has clicked */
var userClickedPattern = [];

/** @type {boolean} Whether the game has been started */
var started = false;

/** @type {number} Current level (length of the sequence) */
var level = 0;

$(document).keypress(function() {
    if (!started) {
        $("#level-title").text("Level " + level);
        nextSequence();
        started = true;
    }
});

$(".btn").click(function() {

    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);

    playSound(userChosenColour);
    animatePress(userChosenColour);

    checkAnswer(userClickedPattern.length - 1);
});

/**
 * Checks if the player's input matches the game pattern at the given index.
 * Advances to next level on success, triggers game over on wrong answer.
 * @param {number} currentLevel - Index of the last button the player clicked
 */
function checkAnswer(currentLevel) {

    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        console.log("success");
        if (userClickedPattern.length === gamePattern.length) {
            setTimeout(function() {
                nextSequence();
            }, 1000);
        }
    } else {
        console.log("wrong");
        playSound("wrong");
        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200);
        $("#level-title").text("Game Over, Press Any Key to Restart");
        startOver();
    }
}

/**
 * Generates the next colour in the sequence, displays it with animation and sound,
 * and clears the user's input for the new round.
 */
function nextSequence() {
    userClickedPattern = [];
    level++;
    $("#level-title").text("Level " + level);
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);
    $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(randomChosenColour);
}

/**
 * Adds a brief visual "pressed" effect to the button.
 * @param {string} currentColour - The id of the button to animate
 */
function animatePress(currentColour) {
    $("#" + currentColour).addClass("pressed");
    setTimeout(function() {
        $("#" + currentColour).removeClass("pressed");
    }, 100);
}

/**
 * Plays the sound file for the given colour or effect.
 * @param {string} name - Name of the sound file (without extension)
 */
function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

/**
 * Resets the game state so the player can restart.
 */
function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
}