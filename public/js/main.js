

function search() {
  let q = document.getElementById('a').value
  window.location = `/?search=${q}`
}

function scrolltodoc() {
  let offset = document.getElementById('aboutpage').offsetTop;
  window.scrollTo(0, offset)
}