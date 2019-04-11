window.onload = () => {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  const CANVAS_COLOR = '#000000';
  const canvasWidth = canvas.width = window.innerWidth * 0.92;
  const canvasHeight = canvas.height = window.innerHeight * 0.94;
  const colors = ['blue', 'red', 'orange', '#44FF88', 'cyan', '#FFFFFF', '#4488FF'];
  const letters = [];
  const lastCols = [];
  const lastColIndex = 0;
  const wrap = 16;
  const size = 30;
  const KEYS = {
    delete: 8,
    enter: 13
  };
  const drawMaxOffset = 2;
  let drawCount = 0;
  let row = 0;
  let col = 0;

  const random = (min, max) => Math.random() * (max - min) + min;

  const factory = {
    createLetter: function(keyCode) {
      const letter = {
        x: parseInt(keyCode) * 4,
        y: canvasHeight + size,
        target: {
          x: col * (size + 4),
          y: row * (size * 1.5),
        },
        speed: 0,
        effect: random(1, 4),
        width: size,
        height: size,
        color: 'orange',
        textColor: colors[Math.round(Math.random() * colors.length)],
        keyCode: keyCode,
      };
      letters.push(letter);
      col ++;

      if (col > wrap) {
        lastCols.push(col);
        col = 0;
        row += 1;
      }
    }
  };

  canvas.style.backgroundColor = CANVAS_COLOR;

  const chase = (letter) => {
    if (letter.x < letter.target.x) {
      letter.x += letter.speed;
    }
    if (letter.x > letter.target.x) {
      letter.x -= letter.speed;
    }
    if (letter.y < letter.target.y) {
      letter.y += letter.speed;
    }
    if (letter.y > letter.target.y) {
      letter.y -= letter.speed;
    }

    const dx = letter.target.x - letter.x;
    const dy = letter.target.y - letter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    letter.speed = distance / 10;
  }

  const update = () => {
    drawCount ++;
    if (drawCount > drawMaxOffset) {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        drawCount = 0;
    }

    letters.forEach(letter => {
      chase(letter);
      context.strokeStyle = '#444444';
      // context.strokeRect(letter.x + 6, letter.y + 12, letter.width, letter.height);
      // context.strokeRect(letters[letters.length - 1].x + 6, letters[letters.length - 1].y + 12, letter.width, letter.height);
      context.fillStyle = letter.textColor;
      context.font = "30px Arial";
      context.textAlign = 'center';
      const txt = String.fromCharCode(letter.keyCode)
      letter.effect += 0.01;
      context.fillText(txt, letter.x + size / 2, letter.y + size + Math.cos(letter.effect));
    })
  };

  const frame = () => {
    update();
    requestAnimationFrame(frame);
  };

  window.onkeydown = e => {
    if (e.keyCode === KEYS.delete) {
      if (col > 0) {
        letters.splice(letters.length - 1, 1);
        col --;
      } else {
        col = lastCols[lastCols.length - 1];
        lastCols.splice(lastCols.length - 1, 1);
        if (row > 0) {
          row -= 1;
        } else {
          row = 0;
          col = 0;
        }
      }

      return;
    } else
    if (e.keyCode === KEYS.enter) {
      lastCols.push(col);
      row += 1;
      col = 0;

      return;
    }
    factory.createLetter(e.keyCode);
  }

  frame();
}
