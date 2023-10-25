class Random {
    Chance(percentage) {
        if (percentage >= 100) {
            return true;
        } else if (percentage <= 0) {
            return false;
        } else {
            return Math.random() * 100 < percentage;
        }
    }

    HighestRandom(attempts) {
        let record = 0;

        for (let i = 0; i < attempts; i++) {
            let score = 0;

            while (Math.random() < 0.5) {
                score++;
            }

            if (score > record) {
                record = score;
            }
        }

        return record;
    }
}