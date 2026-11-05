/* Footillion logo: a pixel-art footballer kicking a ball, drawn on a low-res grid then scaled up. */
(function (root) {
  'use strict';
  var W = 44, H = 34;

  function drawLogo(canvas) {
    var scale = Math.floor(canvas.width / W);
    var grid = [], x, y;
    for (y = 0; y < H; y++) { grid[y] = []; for (x = 0; x < W; x++) grid[y][x] = null; }

    function put(px, py, c) { px = Math.round(px); py = Math.round(py); if (px >= 0 && px < W && py >= 0 && py < H) grid[py][px] = c; }
    function disc(cx, cy, r, c, test) {
      for (var j = Math.floor(cy - r); j <= Math.ceil(cy + r); j++)
        for (var i = Math.floor(cx - r); i <= Math.ceil(cx + r); i++)
          if ((i - cx) * (i - cx) + (j - cy) * (j - cy) <= r * r) put(i, j, test ? test(i, j, c) : c);
    }
    function line(x0, y0, x1, y1, t, c) {
      var steps = Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 2);
      for (var s = 0; s <= steps; s++) {
        var k = steps ? s / steps : 0;
        disc(x0 + (x1 - x0) * k, y0 + (y1 - y0) * k, t / 2, c);
      }
    }
    function rect(x0, y0, w, h, c) { for (var j = y0; j < y0 + h; j++) for (var i = x0; i < x0 + w; i++) put(i, j, c); }

    var SKIN = '#f2c9a0', HAIR = '#4a2a14', SHIRT = '#ffd23f', SHORTS = '#f2fff0', SOCK = '#4cd964', BOOT = '#14110c';

    /* ground shadow */
    rect(8, 32, 22, 1, '#04170c');
    /* standing leg (left) */
    line(14, 21, 12, 27, 3, SKIN);
    line(12, 27, 12, 30, 3, SOCK);
    rect(9, 30, 5, 2, BOOT);
    /* kicking leg (right) */
    line(17, 21, 23, 22, 3, SKIN);
    line(23, 22, 29, 18, 3, SOCK);
    disc(30, 17, 1.7, BOOT);
    /* shorts and torso */
    line(15, 18, 16, 22, 5, SHORTS);
    line(16, 9, 15, 18, 5, SHIRT);
    /* arms: back arm and front arm */
    line(14, 10, 8, 12, 3, SHIRT);
    line(8, 12, 6, 15, 2, SKIN);
    line(18, 10, 23, 8, 3, SHIRT);
    line(23, 8, 26, 6, 2, SKIN);
    /* head with hair */
    disc(16, 5, 3.6, SKIN);
    disc(16, 5, 3.6, SKIN, function (i, j) { return j <= 3 || (j === 4 && i < 16) ? HAIR : SKIN; });
    put(18, 5, '#04170c');
    /* shirt stripe */
    line(14, 13, 18, 13, 1, '#d9a500');
    /* ball with a pentagon pattern */
    var bx = 37, by = 12;
    disc(bx, by, 4.2, '#f2fff0');
    put(bx, by, '#04170c'); put(bx - 1, by, '#04170c'); put(bx + 1, by, '#04170c'); put(bx, by - 1, '#04170c'); put(bx, by + 1, '#04170c');
    put(bx - 3, by - 2, '#04170c'); put(bx + 3, by - 2, '#04170c'); put(bx - 3, by + 2, '#04170c'); put(bx + 3, by + 2, '#04170c');
    put(bx, by - 4, '#04170c'); put(bx, by + 4, '#04170c');
    /* motion lines */
    rect(31, 8, 3, 1, '#ffd23f'); rect(30, 11, 4, 1, '#ffd23f'); rect(32, 14, 3, 1, '#ffd23f');

    /* outline pass */
    var OUT = '#031009', out = [];
    for (y = 0; y < H; y++) { out[y] = []; for (x = 0; x < W; x++) out[y][x] = grid[y][x]; }
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      if (grid[y][x]) continue;
      if ((y > 0 && grid[y - 1][x]) || (y < H - 1 && grid[y + 1][x]) || (x > 0 && grid[y][x - 1]) || (x < W - 1 && grid[y][x + 1])) out[y][x] = OUT;
    }

    var ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var ox = Math.floor((canvas.width - W * scale) / 2), oy = Math.floor((canvas.height - H * scale) / 2);
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      if (!out[y][x]) continue;
      ctx.fillStyle = out[y][x];
      ctx.fillRect(ox + x * scale, oy + y * scale, scale, scale);
    }
  }

  root.drawLogo = drawLogo;
  var c = root.document && root.document.getElementById('logoCanvas');
  if (c) drawLogo(c);
})(window);
