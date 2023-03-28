export function versusEloCalculator(
    playerOneCurrentElo,
    playerTwoCurrentElo,
    winnersAvgElo,
    losersAvgElo,
    expectedOutcome // either true or false (true if the player with the higher elo wins, and false if the players draw or the player with lower elo wins )
) {
    // Javascript program for Elo Rating
    // K-factor for players below 2100, between 2100–2400 and above 2400 of 32, 24 and 16, respectively

    // Function to calculate the Probability
    function Probability(rating1, rating2) {
        return (
            (1.0 * 1.0) /
            (1 + 1.0 * Math.pow(10, (1.0 * (rating1 - rating2)) / 480)) // using 480 instead of 400 due to this link https://en.wikipedia.org/wiki/Elo_rating_system#:~:text=Suggested%20modification
        );
    }

    // Function to calculate Elo rating
    // K is a constant.
    // d determines whether Player A wins
    // or Player B.
    function EloRating(
        pOneCurrentElo,
        pTwoCurrentElo,
        winnersAvgElo,
        losersAvgElo,
        K,
        expectedOutcome
    ) {
        // To calculate the Winning Probability

        let Pa = Probability(losersAvgElo, winnersAvgElo);
        console.log(`Probability of the winning team winning: ${Pa}`);
        // To calculate the Winning
        // Probability of Player B
        let Pb = Probability(winnersAvgElo, losersAvgElo);
        let pOneUpdatedElo;
        let pTwoUpdatedElo;

        // Case 1 When expected outcome comes true (meaning the lower score player or team won)
        // Updating the Elo Ratings
        if (expectedOutcome === 1) {
            pOneUpdatedElo = pOneCurrentElo + K * (1 - Pa);
            pTwoUpdatedElo = pTwoCurrentElo + K * (0 - Pb);
        }

        // Case 2 When expected outcome DOESN'T come true (meaning the lower score player or team won)
        // Updating the Elo Ratings
        else if (expectedOutcome === 0) {
            pOneUpdatedElo = pOneCurrentElo + K * (0 - Pa);
            pTwoUpdatedElo = pTwoCurrentElo + K * (1 - Pb);
        }

        // Case 3 when the teams tie
        else if (expectedOutcome === 0.5) {
            // treat it as if both outcomes took place, and make the result each half added together - this will affect high elo players drawing with low elo players
            pOneUpdatedElo =
                (pOneCurrentElo +
                    K * (1 - Pa) +
                    (pOneCurrentElo + K * (0 - Pa))) /
                2;

            pTwoUpdatedElo =
                (pTwoCurrentElo +
                    K * (0 - Pb) +
                    (pTwoCurrentElo + K * (1 - Pb))) /
                2;
        }
        console.log(
            `P1 updatedElo: ${pOneUpdatedElo}\nP2 updatedElo: ${pTwoUpdatedElo}`
        );
        return [pOneUpdatedElo, pTwoUpdatedElo];
    }

    // Ra and Rb are current ELO ratings
    const K = 30;
    console.log(`Player One Current Elo: ${playerOneCurrentElo}`);
    console.log(`Player Two Current Elo: ${playerTwoCurrentElo}`);
    console.log(`Winners Avg Elo: ${winnersAvgElo}`);
    console.log(`Losers Avg Elo: ${losersAvgElo}`);
    console.log(
        `Expected Outcome? ${
            expectedOutcome == 0
                ? "Draw"
                : expectedOutcome == 1
                ? "Yes, the winners were expected to win"
                : "No, there was an upset! The underdogs won!"
        }`
    );

    const [playerOneUpdatedElo, playerTwoUpdatedElo] = EloRating(
        playerOneCurrentElo,
        playerTwoCurrentElo,
        winnersAvgElo,
        losersAvgElo,
        K,
        expectedOutcome
    );
    console.log(
        `playerOne updated elo after running EloRating function: ${playerOneUpdatedElo}`
    );
    console.log(
        `playerTwo updated elo after running EloRating function: ${playerTwoUpdatedElo}`
    );
    // This code is contributed by Vishal Vilas Shinde.
    // got from https://www.geeksforgeeks.org/elo-rating-algorithm/

    return [playerOneUpdatedElo, playerTwoUpdatedElo];
}
