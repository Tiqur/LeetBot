const findDistance = (array, e1, e2) => {
    const ie1 = array.indexOf(e1);
    const ie2 = array.indexOf(e2);

    return ie1 > ie2 ? (array.length - ie1 + ie2) : (ie2 - ie1);
}

module.exports = findDistance;