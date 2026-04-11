/**
 * Simon Game — memory sequence game.
 *
 * Flow:
 * 1. First keypress starts the run; `nextSequence()` adds a colour and plays it.
 * 2. Player repeats the full pattern by clicking pads; each click is checked in order.
 * 3. Correct full length → short pause, then `nextSequence()` extends the pattern.
 * 4. Wrong click → wrong sound, game-over styling, state reset; any key starts a new run.
 *
 * @requires jQuery
 */

// ---------------------------------------------------------------------------
// State (shared across handlers and helpers)
// ---------------------------------------------------------------------------

/** @type {string[]} Colours used for pads; indices match random 0–3 in `nextSequence`. */
var buttonColours = ["red", "blue", "green", "yellow"];

/** @type {string[]} Full sequence the player must copy this round. */
var gamePattern = [];

/** @type {string[]} Clicks so far in the current attempt (cleared each new level). */
var userClickedPattern = [];

/** @type {boolean} True after the first keypress until `startOver()` runs. */
var started = false;

/** @type {number} How many steps in the pattern (increments each successful round). */
var level = 0;

// ---------------------------------------------------------------------------
// Input: keyboard (start / restart) and pad clicks
// ---------------------------------------------------------------------------

$(document).keypress(function () {
    if (!started) {
        // Title updates again inside `nextSequence()` once `level` is bumped.
        $("#level-title").text("Level " + level);
        nextSequence();
        started = true;
    }
});

$(".btn").click(function () {
    var userChosenColour = $(this).attr("id");
    userClickedPattern.push(userChosenColour);

    playSound(userChosenColour);
    animatePress(userChosenColour);

    // Compare this click to the expected colour at the same step index.
    checkAnswer(userClickedPattern.length - 1);
});

// ---------------------------------------------------------------------------
// Game logic
// ---------------------------------------------------------------------------

/**
 * Verifies the latest click against `gamePattern` at `currentLevel`.
 * On success: if the player has entered the whole pattern, schedule the next round.
 * On failure: play error, flash game-over, reset so the next keypress starts fresh.
 *
 * @param {number} currentLevel - Index of the last clicked pad (0-based within this round).
 */
function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        console.log("success");
        if (userClickedPattern.length === gamePattern.length) {
            // Full pattern matched — brief pause so the last sound finishes, then extend sequence.
            setTimeout(function () {
                nextSequence();
            }, 1000);
        }
    } else {
        console.log("wrong");
        playSound("wrong");
        $("body").addClass("game-over");
        setTimeout(function () {
            $("body").removeClass("game-over");
        }, 200);
        $("#level-title").text("Game Over, Press Any Key to Restart");
        startOver();
    }
}

/**
 * New round: clear the player's partial input, increase level, append one random colour,
 * show the new tail of the sequence (flash + sound), update the heading.
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

// ---------------------------------------------------------------------------
// Feedback (visual + audio)
// ---------------------------------------------------------------------------

/**
 * Short highlight on the pad the user clicked.
 *
 * @param {string} currentColour - Button `id` (e.g. `"green"`).
 */
function animatePress(currentColour) {
    $("#" + currentColour).addClass("pressed");
    setTimeout(function () {
        $("#" + currentColour).removeClass("pressed");
    }, 100);
}

/**
 * Plays `sounds/<name>.mp3` (colour names or `"wrong"`).
 *
 * @param {string} name - Filename without extension.
 */
function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

/**
 * Clears progression so the next keypress behaves like a cold start.
 */
function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
}