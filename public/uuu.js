
// const timeStart = Date.now();

// window.addEventListener('DOMContentLoaded',function () {
//     console.log( (Date.now() - timeStart ) / 1000 + " seconds")
//     console.log("ASDASDa")
// });


document.addEventListener('readystatechange', function() { console.log("Fiered '" + document.readyState + "' after " + performance.now()/1000 + " s"); });

  document.addEventListener('DOMContentLoaded', function() { console.log("Fiered DOMContentLoaded after " + performance.now()/1000 + " s"); }, false);

  window.addEventListener('load', function() { console.log("Fiered load after " + performance.now()/1000 + " s"); }, false);





