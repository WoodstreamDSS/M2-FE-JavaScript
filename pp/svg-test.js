let t0, t1;

const drawSVG = (svg, time) => {
  let paths = svg.find('path');
  time = time * 1000;
  delay = time / paths.length;
  let i = 0;
  const showPath = function(i) {
    $(paths[i]).css('display', 'block');
    i++;
    if (i < paths.length) {
      setTimeout(function() {
        showPath(i);
      }, delay);
    } else {
      t1 = performance.now();
      console.log(t1 - t0);
    }
  }
  showPath(i);
}

let svg = $('#bird-1');
t0 = performance.now();
drawSVG(svg, 1);