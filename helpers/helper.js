function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("id-ID");
}

module.exports = {
  formatRupiah,
  formatDate,
};
