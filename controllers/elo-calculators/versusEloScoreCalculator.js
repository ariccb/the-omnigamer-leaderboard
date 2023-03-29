export function versusEloCalculator(
    playerOneCurrentElo,
    playerTwoCurrentElo,
    teamOneAvgElo,
    teamTwoAvgElo,
    expectedOutcome, // either true or false (true if the player with the higher elo wins, and false if the players draw or the player with lower elo wins )
    winningTeam
) {
    // Javascript program for Elo Rating
    // K-factor for players below 2100, between 2100–2400 and above 2400 of 32, 24 and 16, respectively

    // Function to calculate the Probability
    function Probability(rating1, rating2) {
        return (
            (1.0 * 1.0) / (1 + 1.0 * Math.pow(10, (1.0 * (rating1 - rating2)) / 480)) // using 480 instead of 400 due to this link https://en.wikipedia.org/wiki/Elo_rating_system#:~:text=Suggested%20modification
        );
    }

    // Function to calculate Elo rating
    // K is a constant.
    // d determines whether Player A wins
    // or Player B.
    function EloRating(
        teamOnePlayerCurrentElo,
        teamTwoPlayerCurrentElo,
        teamOneAvgElo,
        teamTwoAvgElo,
        K, // -- idea: you could have a variable K constant value that is dependent on player's current ELO
        // score -- would make it bigger for players with a lower elo, and make it smaller for players with
        // higher elo scores to reward consistency over "speed of improvement"
        expectedOutcome,
        winningTeam // figure out how to use the actual outcome (1 or 2 if player one or two respectively won)
    ) {
        // To calculate the Winning Probability

        let Pa = Probability(teamTwoAvgElo, teamOneAvgElo);
        let PaPerc = Math.round((100 - Pa * 100) * 100) / 100;
        // To calculate the Winning
        // Probability of Player B
        let Pb = Probability(teamOneAvgElo, teamTwoAvgElo);
        let PbPerc = Math.round((100 - Pb * 100) * 100) / 100;

        console.log(
            `Probability of the Team 1 winning: ${PbPerc}%\nProbability of the Team 2 winning: ${PaPerc}%\n`
        );

        let teamOnePlayerUpdatedElo;
        let teamTwoPlayerUpdatedElo;

        // Case 1 When team one wins and was expected to
        // Updating the Elo Ratings
        if (expectedOutcome === true && winningTeam === 1) {
            teamOnePlayerUpdatedElo = teamOnePlayerCurrentElo + K * (1 - Pa);
            teamTwoPlayerUpdatedElo = teamTwoPlayerCurrentElo + K * (0 - Pb);
        }

        // Case 2 When expected outcome DOESN'T come true (meaning the lower score player or team won)
        // Updating the Elo Ratings
        else if (expectedOutcome === true && winningTeam === 2) {
            teamOnePlayerUpdatedElo = teamOnePlayerCurrentElo + K * (0 - Pa);
            teamTwoPlayerUpdatedElo = teamTwoPlayerCurrentElo + K * (1 - Pb);
        }

        // Case 3 When team one wins and wasn't expected to
        // Updating the Elo Ratings
        if (expectedOutcome === false && winningTeam === 1) {
            teamOnePlayerUpdatedElo = teamOnePlayerCurrentElo + K * (1 - Pa);
            teamTwoPlayerUpdatedElo = teamTwoPlayerCurrentElo + K * (0 - Pb);
        }
        // Case 4 When expected outcome DOESN'T come true (meaning the lower score player or team won)
        // Updating the Elo Ratings
        else if (expectedOutcome === false && winningTeam === 2) {
            teamOnePlayerUpdatedElo = teamOnePlayerCurrentElo + K * (0 - Pa);
            teamTwoPlayerUpdatedElo = teamTwoPlayerCurrentElo + K * (1 - Pb);
        }

        // Case 5 when the teams draw
        // --- this will need to be developed more into more conditions for WHO was expected to win
        // etc. if I want to reward/penalize draws differently depending on win expectations.
        else if (winningTeam === 0.5) {
            // handles all cases where there are ties
            // treat it as if both outcomes took place, and make the result each half added together - this will affect high elo players drawing with low elo players
            teamOnePlayerUpdatedElo =
                (teamOnePlayerCurrentElo +
                    K * (1 - Pa) +
                    (teamOnePlayerCurrentElo + K * (0 - Pa))) /
                2;

            teamTwoPlayerUpdatedElo =
                (teamTwoPlayerCurrentElo +
                    K * (0 - Pb) +
                    (teamTwoPlayerCurrentElo + K * (1 - Pb))) /
                2;
        }
        return [teamOnePlayerUpdatedElo, teamTwoPlayerUpdatedElo];
    }

    // Ra and Rb are current ELO ratings
    const standardK = 30; // change this to change how much overall the values change when you win/lose

    const [playerOneUpdatedElo, playerTwoUpdatedElo] = EloRating(
        playerOneCurrentElo,
        playerTwoCurrentElo,
        teamOneAvgElo,
        teamTwoAvgElo,
        standardK,
        expectedOutcome,
        winningTeam
    );

    return [playerOneUpdatedElo, playerTwoUpdatedElo];
}

// This code is contributed by Vishal Vilas Shinde.
// got from https://www.geeksforgeeks.org/elo-rating-algorithm/
