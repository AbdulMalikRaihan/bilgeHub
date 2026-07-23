function formattedPrice(value) {
  return 'Rp ' + value.toLocaleString('id-ID') + ',00';
}

module.exports = {
  formattedPrice
};