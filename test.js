function formatLargeNumber(num) {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B'; // Billion
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'; // Million
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'k'; // Thousand
    } else {
        return num.toString(); // Less than 1000
    }
}

console.log(formatLargeNumber(850000000))