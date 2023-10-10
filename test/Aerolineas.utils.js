const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

const tokens = (n, unit) => {
  return ethers.parseEther(n.toString(), unit);
};

module.exports = { getKeyByValue, tokens };
