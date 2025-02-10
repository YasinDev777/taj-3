let randomSixDigitNumber = null;

export const getRandomSixDigitNumber = () => {
    if (randomSixDigitNumber === null) {
        randomSixDigitNumber = Math.floor(100000 + Math.random() * 900000);
    }
    return randomSixDigitNumber;
};