const capitalizeFirstLetter = (word) => {
    if (!word) return;
    return word.chartAt(0).toUpperCase() + word.splice(1).toLowerCase();

}

module.exports = {
    capitalizeFirstLetter
}