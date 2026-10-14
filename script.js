/* ==========================================================================
   SCRIPT.JS - TRẢI NGHIỆM SINH NHẬT MÈO CƯNG (MAI PHƯƠNG 20 TUỔI)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. WEB AUDIO API SYNTHESIZER (NHẠC NỀN & ÂM THANH HIỆU ỨNG TỰ ĐỘNG)
  // ==========================================================================
  let audioCtx = null;
  let isMusicPlaying = false;
  let musicLoopTimeout = null;
  let isVideoPlaying = false;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtxClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // --- SOUND EFFECTS (SFX) ---
  
  // Tiếng mèo kêu "Meoww~" ngọt ngào
  function playCatMeowSFX() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      // Meow pitch contour: rise then glide down
      osc.frequency.setValueAtTime(550, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.6);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch (e) {
      console.warn('Audio SFX error:', e);
    }
  }

  // Tiếng mở thư / xé phong bì sột soạt
  function playUnsealSFX() {
    try {
      const ctx = getAudioContext();
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.1));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1400;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  }

  // Tiếng ngòi bút viết / gõ chữ khi typewriter chạy
  function playTypeTickSFX() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200 + Math.random() * 400, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  }

  // Tiếng thổi nến "phùuuu"
  function playBlowCandleSFX() {
    try {
      const ctx = getAudioContext();
      const bufferSize = ctx.sampleRate * 0.8;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.4;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(150, ctx.currentTime + 0.8);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  }

  // Tiếng kèn chúc mừng sinh nhật (Party Horn) & Pháo hoa
  function playPartyHornAndCheerSFX() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      // Party horn melody: G4 - C5 - E5 - G5 fanfare
      const fanfareNotes = [392, 523.25, 659.25, 783.99, 1046.50];
      fanfareNotes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1800;

        gain.gain.setValueAtTime(0, now + idx * 0.14);
        gain.gain.linearRampToValueAtTime(0.1, now + idx * 0.14 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.4);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 0.45);
      });
    } catch (e) {}
  }

  // Tiếng đánh lửa thắp sáng nến lung linh
  function playSparkIgniteSFX() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      // Spark whoosh
      const bufferSize = Math.floor(ctx.sampleRate * 0.35);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.25;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1400, now);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);

      // Magical Chimes (Sparkle)
      [587.33, 880, 1174.66, 1760].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.06 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.65);
      });
    } catch (e) {}
  }

  // Tiếng dao vàng cắt bánh sinh nhật
  function playKnifeSliceSFX() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const bufferSize = Math.floor(ctx.sampleRate * 0.45);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.22;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now);
      filter.frequency.exponentialRampToValueAtTime(600, now + 0.4);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);

      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1320, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
      oscGain.gain.setValueAtTime(0.07, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);
    } catch (e) {}
  }
  function playCurtainSlideSFX() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 1.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.15;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.linearRampToValueAtTime(400, now + 1.5);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  }

  // --- BẢN TÌNH CA LÃNG MẠN (ROMANTIC PIANO BALLAD) ---
  const ROMANTIC_PIANO_CHORDS = [
    [261.63, 329.63, 392.00, 523.25], // C Major
    [220.00, 261.63, 329.63, 440.00], // A Minor
    [174.61, 220.00, 261.63, 349.23], // F Major
    [196.00, 246.94, 293.66, 392.00], // G Major
    [220.00, 261.63, 329.63, 523.25], // Am7
    [174.61, 261.63, 329.63, 440.00], // Fmaj7
    [196.00, 293.66, 392.00, 587.33], // G sus
    [261.63, 392.00, 523.25, 659.25], // C Add9
  ];

  let chordIndex = 0;
  function playBalladStep() {
    if (!isMusicPlaying || isVideoPlaying) return;
    const ctx = getAudioContext();
    const chord = ROMANTIC_PIANO_CHORDS[chordIndex % ROMANTIC_PIANO_CHORDS.length];
    
    // Play warm chord arpeggio
    chord.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.18);

      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.18);
      gain.gain.linearRampToValueAtTime(0.055, ctx.currentTime + i * 0.18 + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + i * 0.18 + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.18);
      osc.stop(ctx.currentTime + i * 0.18 + 2.1);
    });

    // High music box twinkle
    const twinkleNotes = [523.25, 659.25, 783.99, 880.00, 1046.50];
    const highNote = twinkleNotes[Math.floor(Math.random() * twinkleNotes.length)];
    const oscTwinkle = ctx.createOscillator();
    const gainTwinkle = ctx.createGain();
    oscTwinkle.type = 'sine';
    oscTwinkle.frequency.setValueAtTime(highNote, ctx.currentTime + 0.6);
    gainTwinkle.gain.setValueAtTime(0, ctx.currentTime + 0.6);
    gainTwinkle.gain.linearRampToValueAtTime(0.035, ctx.currentTime + 0.65);
    gainTwinkle.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);
    oscTwinkle.connect(gainTwinkle);
    gainTwinkle.connect(ctx.destination);
    oscTwinkle.start(ctx.currentTime + 0.6);
    oscTwinkle.stop(ctx.currentTime + 1.85);

    chordIndex++;
    musicLoopTimeout = setTimeout(playBalladStep, 1750);
  }

  function startMusic() {
    isMusicPlaying = true;
    document.getElementById('btn-music-toggle')?.classList.add('playing');
    const statusText = document.getElementById('music-status-text');
    if (statusText) statusText.textContent = 'Đang phát: Bản tình ca của Mai Phương 🐱🎵';
    playBalladStep();
  }

  function stopMusic() {
    isMusicPlaying = false;
    clearTimeout(musicLoopTimeout);
    document.getElementById('btn-music-toggle')?.classList.remove('playing');
    const statusText = document.getElementById('music-status-text');
    if (statusText) statusText.textContent = 'Nhạc nền tạm dừng';
  }

  // Toggle button
  document.getElementById('btn-music-toggle').addEventListener('click', () => {
    getAudioContext();
    if (isMusicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });


  // ==========================================================================
  // 2. CANVAS ENGINE: TRÁI TIM, DẤU CHÂN MÈO, SAO & PHÁO HOA RỰC RỠ
  // ==========================================================================
  const canvas = document.getElementById('fx-canvas');
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const ambientParticles = [];
  const fireworks = [];

  class AmbientItem {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 40;
      this.size = Math.random() * 16 + 10;
      this.speedY = Math.random() * 0.8 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.type = Math.random() > 0.45 ? 'heart' : (Math.random() > 0.5 ? 'paw' : 'star');
      this.color = Math.random() > 0.5 ? '#ff758f' : '#ffb3c1';
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.02;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.rotation += this.rotSpeed;
      if (this.y < -30) this.reset();
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      if (this.type === 'heart') {
        ctx.fillStyle = this.color;
        const s = this.size / 15;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-10 * s, -10 * s, -20 * s, 5 * s, 0, 20 * s);
        ctx.bezierCurveTo(20 * s, 5 * s, 10 * s, -10 * s, 0, 0);
        ctx.fill();
      } else if (this.type === 'paw') {
        // Draw cute cat paw print
        ctx.fillStyle = '#ff8fa3';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.45, this.size * 0.35, 0, 0, Math.PI * 2);
        ctx.fill();
        // 4 toe pads
        const toeOffsets = [[-0.35, -0.45], [-0.12, -0.6], [0.12, -0.6], [0.35, -0.45]];
        toeOffsets.forEach(([ox, oy]) => {
          ctx.beginPath();
          ctx.arc(ox * this.size, oy * this.size, this.size * 0.16, 0, Math.PI * 2);
          ctx.fill();
        });
      } else {
        // Star sparkle
        ctx.fillStyle = '#ffd166';
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  for (let i = 0; i < 40; i++) {
    const p = new AmbientItem();
    p.y = Math.random() * height;
    ambientParticles.push(p);
  }

  // Fireworks Spark Particle
  class FireworkSpark {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 3;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.friction = 0.96;
      this.gravity = 0.18;
      this.color = color;
      this.alpha = 1;
      this.decay = Math.random() * 0.015 + 0.01;
      this.size = Math.random() * 5 + 3;
    }
    update() {
      this.vx *= this.friction;
      this.vy *= this.friction;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
    }
    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function launchFirework(x, y, count = 70) {
    const palette = ['#ff476d', '#ff758f', '#ffd166', '#ff9f1c', '#06d6a0', '#118ab2', '#b388eb'];
    const color = palette[Math.floor(Math.random() * palette.length)];
    for (let i = 0; i < count; i++) {
      fireworks.push(new FireworkSpark(x, y, color));
    }
  }

  // Confetti Streamer Particle (Pháo hoa giấy rực rỡ che kín cả màn hình)
  const confettiStorm = [];
  class ConfettiPaper {
    constructor(x, y) {
      this.x = x !== undefined ? x : Math.random() * width;
      this.y = y !== undefined ? y : Math.random() * -120 - 10;
      this.w = Math.random() * 14 + 8;
      this.h = Math.random() * 8 + 5;
      const palette = ['#ff476d', '#ffd166', '#ff758f', '#06d6a0', '#7209b7', '#4cc9f0', '#ffffff', '#ff9f1c', '#f72585'];
      this.color = palette[Math.floor(Math.random() * palette.length)];
      this.vx = (Math.random() - 0.5) * 6;
      this.vy = Math.random() * 5 + 3.5;
      this.rotX = Math.random() * Math.PI * 2;
      this.rotY = Math.random() * Math.PI * 2;
      this.rotZ = (Math.random() - 0.5) * 0.1;
      this.rotSpeedX = Math.random() * 0.1 + 0.03;
      this.rotSpeedY = Math.random() * 0.08 + 0.02;
      this.alpha = 1;
      this.life = 0;
      this.maxLife = Math.random() * 260 + 220;
    }
    update() {
      this.x += this.vx + Math.sin(this.life * 0.04) * 1.5;
      this.y += this.vy;
      this.rotX += this.rotSpeedX;
      this.rotY += this.rotSpeedY;
      this.life++;
      if (this.life > this.maxLife - 40) {
        this.alpha = Math.max(0, (this.maxLife - this.life) / 40);
      }
    }
    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotZ * this.life);
      ctx.scale(Math.cos(this.rotX), Math.sin(this.rotY));
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
      ctx.restore();
    }
  }

  function launchMassiveConfettiStorm(durationMs = 6000) {
    const startTime = Date.now();
    const spawnTimer = setInterval(() => {
      if (Date.now() - startTime > durationMs) {
        clearInterval(spawnTimer);
        return;
      }
      for (let i = 0; i < 24; i++) {
        confettiStorm.push(new ConfettiPaper());
      }
    }, 70);

    for (let f = 0; f < 10; f++) {
      setTimeout(() => {
        const fx = Math.random() * width;
        const fy = Math.random() * (height * 0.7) + 50;
        launchFirework(fx, fy, 90);
      }, f * 350);
    }
  }

  function renderFX() {
    ctx.clearRect(0, 0, width, height);

    ambientParticles.forEach(p => {
      p.update();
      p.draw();
    });

    for (let i = fireworks.length - 1; i >= 0; i--) {
      fireworks[i].update();
      fireworks[i].draw();
      if (fireworks[i].alpha <= 0) {
        fireworks.splice(i, 1);
      }
    }

    for (let i = confettiStorm.length - 1; i >= 0; i--) {
      confettiStorm[i].update();
      confettiStorm[i].draw();
      if (confettiStorm[i].alpha <= 0 || confettiStorm[i].y > height + 60) {
        confettiStorm.splice(i, 1);
      }
    }

    requestAnimationFrame(renderFX);
  }
  renderFX();

  // Mousemove Cat Paw Trail
  let lastPawTime = 0;
  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastPawTime > 120) {
      lastPawTime = now;
      const paw = document.createElement('div');
      paw.className = 'cat-paw-trail';
      paw.textContent = '🐾';
      paw.style.left = `${e.clientX}px`;
      paw.style.top = `${e.clientY}px`;
      document.body.appendChild(paw);
      setTimeout(() => paw.remove(), 1200);
    }
  });


  // ==========================================================================
  // 3. MÀN HÌNH BẮT ĐẦU: Ổ KHÓA HÌNH MÈO LĂN DÒ SỐ (TUMBLER DIAL COMBINATION)
  // ==========================================================================
  const doorViewport = document.getElementById('door-viewport');
  const catShackle = document.getElementById('cat-shackle');
  const lockStatusLabel = document.getElementById('lock-status-label');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const fullscreenText = document.getElementById('fullscreen-text');

  // Mechanical ratchet click sound for rolling tumbler dials
  function playDialClickSFX() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(800 + Math.random() * 200, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {}
  }

  // Padlock heavy snap unlock sound
  function playPadlockUnlockSFX() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      // Metal clack 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(320, now);
      osc1.frequency.exponentialRampToValueAtTime(140, now + 0.08);
      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.12);

      // Metal ring/bell 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1480, now + 0.05);
      gain2.gain.setValueAtTime(0.1, now + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.05);
      osc2.stop(now + 0.45);
    } catch (e) {}
  }

  // Start romantic music immediately on ANY user interaction with lock screen or dials
  function triggerAutoMusicStart() {
    if (!isMusicPlaying && !isVideoPlaying) {
      getAudioContext();
      startMusic();
    }
  }

  doorViewport.addEventListener('click', triggerAutoMusicStart, { once: true });
  doorViewport.addEventListener('touchstart', triggerAutoMusicStart, { once: true });
  doorViewport.addEventListener('wheel', triggerAutoMusicStart, { once: true });

  // Fullscreen toggle handler
  function toggleFullScreen() {
    triggerAutoMusicStart();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        fullscreenText.textContent = 'Đã Bật Toàn Màn Hình ✨';
      }).catch(err => {
        fullscreenText.textContent = 'Nhấn F11 trên bàn phím nhé!';
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        fullscreenText.textContent = 'Bật Toàn Màn Hình (F11)';
      }
    }
  }

  btnFullscreen.addEventListener('click', () => {
    getAudioContext();
    playCatMeowSFX();
    toggleFullScreen();
  });

  // 6 Tumbler Dial Digits state: initialized to [0, 0, 0, 0, 0, 0]
  const dialDigits = [0, 0, 0, 0, 0, 0];
  let isDoorUnlocked = false;

  function updateDialUI(index) {
    const el = document.getElementById(`dial-${index}`);
    if (el) {
      el.textContent = dialDigits[index];
    }
  }

  function checkCombination() {
    if (isDoorUnlocked) return;
    const currentCode = dialDigits.join('');

    if (currentCode === '141020') {
      isDoorUnlocked = true;
      window.scrollTo({ top: 0, behavior: 'instant' });
      lockStatusLabel.textContent = '✨ MẬT MÃ CHÍNH XÁC! CỬA ĐANG MỞ... ✨';
      lockStatusLabel.style.color = '#06d6a0';

      playPadlockUnlockSFX();
      playCatMeowSFX();
      catShackle.classList.add('unlocked');

      launchFirework(window.innerWidth / 2, window.innerHeight / 2, 90);

      // Door swings open 3D after snap
      setTimeout(() => {
        doorViewport.classList.add('door-open');
        triggerAutoMusicStart();
      }, 500);

      // Fade out viewport so user can interact with page smoothly
      setTimeout(() => {
        doorViewport.classList.add('opened');
      }, 1800);
    }
  }

  function stepDial(index, delta) {
    if (isDoorUnlocked) return;
    triggerAutoMusicStart();
    playDialClickSFX();
    dialDigits[index] = (dialDigits[index] + delta + 10) % 10;
    updateDialUI(index);
    checkCombination();
  }

  // Attach button click events
  document.querySelectorAll('.dial-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const dialIdx = parseInt(btn.getAttribute('data-dial'), 10);
      const isUp = btn.classList.contains('up');
      stepDial(dialIdx, isUp ? 1 : -1);
    });
  });

  // Attach mouse wheel rolling for tactile tumbler dial feel
  document.querySelectorAll('.dial-column').forEach((col, idx) => {
    col.addEventListener('wheel', (e) => {
      e.preventDefault();
      stepDial(idx, e.deltaY < 0 ? 1 : -1);
    }, { passive: false });
  });




  // ==========================================================================
  // 4. CHƯƠNG 2: 1 CHÚ MÈO HOẠT HỌA ĐIỆN ẢNH ĐỨNG ĐỢI, NGOẠM DÂY LÔI THƯ RA
  // ==========================================================================
  // Preload high quality movie cat animation frames (supports root & assets/)
  function setCatActorSrc(filename) {
    if (!catActorImg) return;
    catActorImg.onerror = function() {
      this.onerror = null;
      this.src = 'assets/' + filename;
    };
    catActorImg.src = filename;
  }

  const catPreloadPull = new Image();
  catPreloadPull.onerror = () => { catPreloadPull.src = 'assets/cat_pulling_rope.png?v=2'; };
  catPreloadPull.src = 'cat_pulling_rope.png?v=2';

  const catPreloadDone = new Image();
  catPreloadDone.onerror = () => { catPreloadDone.src = 'assets/cat_happy_done.png?v=2'; };
  catPreloadDone.src = 'cat_happy_done.png?v=2';

  const interactiveCat = document.getElementById('interactive-cat');
  const catActorImg = document.getElementById('cat-actor-img');
  const catSpeechBubble = document.getElementById('cat-speech-bubble');
  const giantEnvelope = document.getElementById('giant-envelope');
  const waxPawSeal = document.getElementById('wax-paw-seal');
  const unsealedLetter = document.getElementById('unsealed-letter');
  const typewriterBody = document.getElementById('typewriter-body');
  const typewriterCursor = document.getElementById('typewriter-cursor');
  const btnSkipTyping = document.getElementById('btn-skip-typing');
  const btnReplayTyping = document.getElementById('btn-replay-typing');

  let isCatPulling = false;
  let hasEnvelopeArrived = false;

  // Khi người yêu chạm vào chú mèo đang đứng đợi ở bên trái
  if (interactiveCat) {
    interactiveCat.addEventListener('click', () => {
      if (isCatPulling || hasEnvelopeArrived) return;
      isCatPulling = true;

      playCatMeowSFX();
      catSpeechBubble.textContent = 'Chờ tớ ngoạm dây lôi ra cho em nha! 🐾';

      // Bước 1: Mèo cúi xuống ngoạm chặt lấy sợi dây thừng và bắt đầu kéo
      setTimeout(() => {
        setCatActorSrc('cat_pulling_rope.png?v=2');
        if (catSpeechBubble) catSpeechBubble.textContent = 'Phù... nặng quá! Ráng lên nào! Meoww~ 💦';

        // Bắt đầu gồng người ngoạm dây lôi chiếc phong bao thư ra giữa màn hình
        interactiveCat.classList.add('cat-is-pulling');
        giantEnvelope.classList.add('pulled-to-center');
      }, 350);

      // Tiếng mèo kêu ráng sức giữa chặng đường
      setTimeout(() => {
        playCatMeowSFX();
      }, 2600);

      // Bước 2: Kéo phong bì vào đúng chính giữa màn hình (sau 5.2s)
      setTimeout(() => {
        isCatPulling = false;
        hasEnvelopeArrived = true;

        interactiveCat.classList.remove('cat-is-pulling');
        interactiveCat.classList.add('cat-is-done');

        // Nhả dây thừng ra, chuyển sang tư thế mèo vẫy tay tươi cười chúc mừng
        setCatActorSrc('cat_happy_done.png?v=2');

        giantEnvelope.classList.add('arrived');
        if (catSpeechBubble) catSpeechBubble.textContent = 'Đã lôi ra xong rồi nè! Em chạm dấu sáp đỏ để mở nha! 💖';

        playCatMeowSFX();
        launchFirework(window.innerWidth / 2, window.innerHeight * 0.45, 65);
      }, 5200);
    });
  }

  // Bấm vào dấu sáp đỏ để mở phong bao thư (Chỉ mở khi đã được lôi ra xong)
  function handleOpenLetter() {
    if (!hasEnvelopeArrived) return;
    playUnsealSFX();
    playCatMeowSFX();
    launchFirework(window.innerWidth / 2, window.innerHeight / 2, 70);

    const stageContainer = document.getElementById('cat-caravan');
    if (stageContainer) stageContainer.style.display = 'none';
    unsealedLetter.style.display = 'block';

    runTypewriter();
    unsealedLetter.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  if (waxPawSeal) waxPawSeal.addEventListener('click', handleOpenLetter);
  if (giantEnvelope) {
    giantEnvelope.addEventListener('click', (e) => {
      if (e.target.closest('#interactive-cat')) return;
      handleOpenLetter();
    });
  }

  const LETTER_CONTENT = `Chúc mừng tuổi 20 của Yêu, yêu yêu nhiều lắm.

Lại thêm 1 tuổi mới, nhưng mà với mốc tuổi 20 như này, anh thấy số cũng khá đặc biệt, không biết sao chứ hồi nhỏ tới giờ thấy độ tuổi 20 của phụ nữ là cái giai đoạn gì đó khá quan trọng. Nhưng mà tóm lại là số đẹp.

Nhân dịp này, anh vẫn chúc bé yêu của anh ăn mau chóng lớn, yêu anh, yêu bản thân nhiều hơn và yêu cả công việc hiện tại mà yêu anh đang theo đuổi.

Biết là yêu không thích nhưng mà, vẫn mong yêu anh trưởng thành hơn, trưởng thành không phải là trưởng thành về tuổi, nhưng mà trưởng thành 1 chút để đỡ nạt anh hơn. Chứ mấy hôm vừa rồi, kể lúc anh đang làm cái này nè, cũng đang là lúc hai đứa cãi nhau nữa.

Bây giờ anh với yêu ai rồi cũng bận, anh bình thường lúc nào cũng yêu yêu, nhưng mà anh mệt, rồi yêu cũng thế hay sao á, rồi cãi nhau quá trời.

Thôi thêm tuổi mới rồi, làm cô giáo rồi, nhường nhịn anh tí nhá.

Chả biết nói gì chứ, lúc nào cũng yêu yêu của anh lắm. Yêu em, yêu em và yêu em.`;

  let typingTimer = null;
  let charIdx = 0;
  let isLetterReadFinished = false;
  let isCakeCutFinished = false;

  // VÁCH NGĂN 2: HƯỚNG DẪN NHỎ GỌN (MỞ KHÓA BÁNH SINH NHẬT KHI ĐỌC HẾT THƯ)
  function unlockLetterToCakeBarrier() {
    if (isLetterReadFinished) return;
    isLetterReadFinished = true;

    const chapter3 = document.getElementById('chapter-3');
    const gateLetter = document.getElementById('gate-letter-to-cake');
    const letterCakeBtn = document.getElementById('letter-cake-nav-btn');

    // Mở khóa Chapter 3
    if (chapter3) {
      chapter3.classList.remove('chapter-locked');
      chapter3.classList.add('chapter-unlock-reveal');
    }

    // Cập nhật thẻ Vách ngăn 2 thành Đã mở khóa (gọn gàng, không spoil)
    if (gateLetter) {
      gateLetter.classList.remove('locked');
      gateLetter.classList.add('unlocked');
      gateLetter.innerHTML = `
        <span class="pill-icon">✨</span>
        <span class="pill-text">Đã mở khóa phần tiếp theo! Chạm vào đây để tiếp tục 🐾👇</span>
      `;

      gateLetter.onclick = () => {
        playCatMeowSFX();
        chapter3?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
    }

    if (letterCakeBtn) {
      letterCakeBtn.style.display = 'inline-block';
      letterCakeBtn.addEventListener('click', () => {
        playCatMeowSFX();
        chapter3?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    playCatMeowSFX();
    launchFirework(window.innerWidth / 2, window.innerHeight * 0.65, 60);
  }

  function runTypewriter() {
    clearInterval(typingTimer);
    typewriterBody.textContent = '';
    typewriterCursor.style.display = 'inline-block';
    charIdx = 0;

    typingTimer = setInterval(() => {
      if (charIdx < LETTER_CONTENT.length) {
        typewriterBody.textContent += LETTER_CONTENT[charIdx];
        if (charIdx % 3 === 0) playTypeTickSFX();
        charIdx++;
      } else {
        clearInterval(typingTimer);
        unlockLetterToCakeBarrier();
      }
    }, 36);
  }

  function skipTypewriter() {
    clearInterval(typingTimer);
    typewriterBody.textContent = LETTER_CONTENT;
    unlockLetterToCakeBarrier();
  }

  btnSkipTyping.addEventListener('click', skipTypewriter);
  btnReplayTyping.addEventListener('click', () => {
    playUnsealSFX();
    runTypewriter();
  });


  // ==========================================================================
  // 5. CHƯƠNG 3: BÁNH SINH NHẬT 4 TẦNG LUXURY - KHUNG NỀN TỐI LUNG LINH & THỔI NẾN, CẮT BÁNH
  // ==========================================================================
  const chapter3 = document.getElementById('chapter-3');
  const cakeStage = document.getElementById('cake-interactive-stage');
  const luxuryCakeWrapper = document.getElementById('luxury-cake-wrapper');
  const candleAssembly = document.getElementById('cake-candle-assembly');
  const candleFlame = document.getElementById('candle-flame');
  const candleSmoke = document.getElementById('candle-smoke');
  const candleSpotlight = document.getElementById('candle-spotlight');
  const igniteSpark = document.getElementById('candle-ignite-spark');
  const gaugeFillBar = document.getElementById('gauge-fill-bar');
  const gaugePrompt = document.getElementById('gauge-prompt');
  const goldenKnife = document.getElementById('golden-knife');

  const btnBlowCandle = document.getElementById('btn-blow-candle');
  const btnBlowText = document.getElementById('btn-blow-text');
  const btnHoldFill = document.getElementById('btn-hold-fill');
  const btnCutCake = document.getElementById('btn-cut-cake');
  const btnCutText = document.getElementById('btn-cut-text');
  const cakeCelebrationMessage = document.getElementById('cake-celebration-message');

  let hasIgnitedCandle = false;
  let isCandleBlown = false;
  let isCakeCut = false;
  let isHoldingBlow = false;
  let holdStartTime = 0;
  let holdRafId = null;
  const HOLD_DURATION_MS = 1800; // Cần giữ 1.8 giây để thổi tắt nến

  // Scroll Grow & Center Auto-Ignition Observer
  function triggerCandleIgnition() {
    if (hasIgnitedCandle) return;
    hasIgnitedCandle = true;
    if (cakeStage) cakeStage.classList.add('in-view');
    playSparkIgniteSFX();
    igniteSpark?.classList.add('sparking');
    candleSpotlight?.classList.remove('extinguished');
  }

  if (cakeStage) {
    const cakeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cakeStage.classList.add('in-view');
          if (!hasIgnitedCandle) {
            triggerCandleIgnition();
          }
        }
      });
    }, { threshold: [0.3, 0.6] });

    cakeObserver.observe(cakeStage);
  }

  // Scroll fallback để đảm bảo khi lướt tới trung tâm bánh luôn phóng to và thắp nến lung linh
  window.addEventListener('scroll', () => {
    if (!cakeStage) return;
    const rect = cakeStage.getBoundingClientRect();
    const winH = window.innerHeight;
    if (rect.top < winH * 0.85 && rect.bottom > winH * 0.15) {
      cakeStage.classList.add('in-view');
      if (!hasIgnitedCandle) {
        triggerCandleIgnition();
      }
    }
  }, { passive: true });

  // VÁCH NGĂN 3: HƯỚNG DẪN NHỎ GỌN (MỞ KHÓA VIDEO KỶ NIỆM KHI CẮT XONG BÁNH)
  function unlockCakeToVideoBarrier() {
    if (isCakeCutFinished) return;
    isCakeCutFinished = true;

    const chapter4 = document.getElementById('chapter-4');
    const gateCake = document.getElementById('gate-cake-to-video');
    const cakeVideoHint = document.getElementById('cake-video-hint');

    // Mở khóa Chapter 4
    if (chapter4) {
      chapter4.classList.remove('chapter-locked');
      chapter4.classList.add('chapter-unlock-reveal');
    }

    // Cập nhật thẻ Vách ngăn 3 thành Đã mở khóa (gọn gàng, không spoil)
    if (gateCake) {
      gateCake.classList.remove('locked');
      gateCake.classList.add('unlocked');
      gateCake.innerHTML = `
        <span class="pill-icon">✨</span>
        <span class="pill-text">Đã mở khóa phần tiếp theo! Chạm vào đây để xem tiếp 🐾👇</span>
      `;

      gateCake.onclick = () => {
        playCatMeowSFX();
        chapter4?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };
    }

    if (cakeVideoHint) {
      cakeVideoHint.style.display = 'block';
    }

    playCatMeowSFX();
    launchFirework(window.innerWidth / 2, window.innerHeight * 0.45, 80);
  }

  // Cơ Chế Giữ Lâu Để Thổi Tắt Nến (Press & Hold for 1.8s)
  function startBlowHold(e) {
    if (isCandleBlown) return;
    if (!hasIgnitedCandle) triggerCandleIgnition();

    isHoldingBlow = true;
    holdStartTime = performance.now();
    candleAssembly?.classList.add('holding');

    function stepHold(now) {
      if (!isHoldingBlow) return;
      const elapsed = now - holdStartTime;
      const progress = Math.min(1, elapsed / HOLD_DURATION_MS);
      const strokeOffset = 176 * (1 - progress);

      if (gaugeFillBar) gaugeFillBar.style.strokeDashoffset = strokeOffset;
      if (btnHoldFill) btnHoldFill.style.width = (progress * 100) + '%';
      if (gaugePrompt) gaugePrompt.textContent = `Đang thổi... ${Math.round(progress * 100)}% 💨`;

      if (progress >= 1) {
        performBlowCandle();
      } else {
        holdRafId = requestAnimationFrame(stepHold);
      }
    }

    holdRafId = requestAnimationFrame(stepHold);
  }

  function cancelBlowHold() {
    if (isCandleBlown || !isHoldingBlow) return;
    isHoldingBlow = false;
    if (holdRafId) cancelAnimationFrame(holdRafId);

    candleAssembly?.classList.remove('holding');
    if (gaugeFillBar) gaugeFillBar.style.strokeDashoffset = '176';
    if (btnHoldFill) btnHoldFill.style.width = '0%';
    if (gaugePrompt) gaugePrompt.textContent = 'Giữ để thổi 💨';
  }

  function performBlowCandle() {
    if (isCandleBlown) return;
    isCandleBlown = true;
    isHoldingBlow = false;
    if (holdRafId) cancelAnimationFrame(holdRafId);

    candleAssembly?.classList.remove('holding');
    if (gaugeFillBar) gaugeFillBar.style.strokeDashoffset = '0';
    if (btnHoldFill) btnHoldFill.style.width = '100%';

    playBlowCandleSFX();
    candleFlame?.classList.add('blown');
    candleSmoke?.classList.add('active');
    candleSpotlight?.classList.add('extinguished');

    if (gaugePrompt) gaugePrompt.textContent = 'Đã Thổi Tắt! ✨';
    if (btnBlowText) btnBlowText.textContent = 'Đã Thổi Tắt Nến ✨';
    btnBlowCandle.disabled = true;
    btnCutCake.disabled = false;

    cakeCelebrationMessage.textContent = '✨ Nến đã tắt! Ước nguyện tuổi 20 đã bay lên các vì sao! Bây giờ hãy cắt bánh kem nào! 🎂';

    const gateCakeStatus = document.getElementById('gate-cake-status');
    if (gateCakeStatus) {
      gateCakeStatus.textContent = 'Đã thổi tắt nến! Hãy ấn nút "Cắt Bánh Sinh Nhật" bên trên nhé em 🍰✨';
    }

    // Pháo sáng chúc mừng nhỏ trên đầu nến
    if (candleAssembly) {
      const rect = candleAssembly.getBoundingClientRect();
      launchFirework(rect.left + rect.width / 2, rect.top, 50);
    }
  }

  // Gắn sự kiện nhấn giữ vào cả Cây nến và Nút Thổi nến
  const holdTargets = [candleAssembly, btnBlowCandle].filter(Boolean);
  holdTargets.forEach(target => {
    target.addEventListener('pointerdown', startBlowHold);
    target.addEventListener('pointerup', cancelBlowHold);
    target.addEventListener('pointerleave', cancelBlowHold);
    target.addEventListener('pointercancel', cancelBlowHold);

    // Hỗ trợ touch & mouse dự phòng
    target.addEventListener('mousedown', startBlowHold);
    target.addEventListener('mouseup', cancelBlowHold);
    target.addEventListener('mouseleave', cancelBlowHold);
    target.addEventListener('touchstart', startBlowHold, { passive: true });
    target.addEventListener('touchend', cancelBlowHold);
    target.addEventListener('touchcancel', cancelBlowHold);
  });

  // Cơ Chế Cắt Bánh Sinh Nhật Đẹp Mắt Bằng Dao Vàng & Khôi Phục Ánh Sáng Xung Quanh
  function performCutCake() {
    if (isCakeCut) return;
    isCakeCut = true;

    btnCutCake.disabled = true;
    if (btnCutText) btnCutText.textContent = 'Đang cắt bánh... 🍰✨';

    // Âm thanh nhát dao vàng cắt qua các tầng bánh
    playKnifeSliceSFX();
    goldenKnife?.classList.add('slicing');

    // Sau khi dao lướt qua: Bánh tách đôi hé lộ lớp mứt dâu & kem béo ngậy
    setTimeout(() => {
      luxuryCakeWrapper?.classList.add('cake-sliced');
      playPartyHornAndCheerSFX();
      playCatMeowSFX();

      // KHÔI PHỤC ÁNH SÁNG WEB XUNG QUANH (Pitch Dark -> Warm Celebration Lights)
      chapter3?.classList.add('room-lights-restored');

      if (btnCutText) btnCutText.textContent = 'Đã Cắt Bánh Thành Công 🍰';
      cakeCelebrationMessage.innerHTML = '🎉 CHÚC MỪNG SINH NHẬT MAI PHƯƠNG TRÒN 20 TUỔI! 🐾<br><span style="font-size: 1.05rem; color: #ffd166;">Vạn Sự Như Ý - Yêu Em Mãi Mãi! 💖</span>';

      // Đại tiệc pháo hoa rực rỡ khắp màn hình
      for (let i = 0; i < 7; i++) {
        setTimeout(() => {
          const rx = Math.random() * (window.innerWidth * 0.8) + (window.innerWidth * 0.1);
          const ry = Math.random() * (window.innerHeight * 0.5) + (window.innerHeight * 0.2);
          launchFirework(rx, ry, 90);
        }, i * 280);
      }

      // MỞ KHÓA VÁCH NGĂN 3: XUỐNG VIDEO
      unlockCakeToVideoBarrier();
    }, 700);
  }

  btnCutCake.addEventListener('click', performCutCake);


  // ==========================================================================
  // 6. CHƯƠNG 4: VIDEO KỶ NIỆM, PHÁO HOA GIẤY CHE KÍN MÀN HÌNH & ĐÓNG CỬA KẾT MÀN
  // ==========================================================================
  const memoryVideo = document.getElementById('memory-video');

  // Khi bấm play video: Nhạc nền tự động tắt để nghe rõ tiếng video!
  memoryVideo.addEventListener('play', () => {
    isVideoPlaying = true;
    stopMusic();
  });

  memoryVideo.addEventListener('pause', () => {
    isVideoPlaying = false;
  });

  // Khi video kết thúc: BẮN PHÁO HOA GIẤY CHE KÍN CẢ MÀN HÌNH & DẦN DẦN ĐÓNG CỬA LẠI VỚI TIẾNG NHẠC
  memoryVideo.addEventListener('ended', () => {
    isVideoPlaying = false;

    // 1. Bắn pháo hoa giấy rực rỡ che kín cả màn hình
    launchMassiveConfettiStorm(7500);
    playPartyHornAndCheerSFX();
    playCatMeowSFX();

    // 2. Dần dần đóng cửa lại với tiếng nhạc, không hiện chữ mở khóa
    setTimeout(() => {
      startMusic();
      playCurtainSlideSFX();

      // Ẩn ổ khóa dò số (không cần hiện lại chữ mở khóa)
      const padlock = document.getElementById('cat-padlock');
      if (padlock) {
        padlock.classList.add('padlock-hidden');
        padlock.style.display = 'none';
      }

      // Hiện bảng chúc mừng kết thúc tiệc cùng nút xoay ngược làm lại từ đầu
      const finaleScreen = document.getElementById('door-finale-screen');
      if (finaleScreen) finaleScreen.style.display = 'flex';

      doorViewport.classList.remove('opened');
      doorViewport.classList.remove('door-open');
    }, 1800);
  });

  // NÚT HÌNH XOAY NGƯỢC: LÀM LẠI TỪ ĐẦU
  const btnRestartJourney = document.getElementById('btn-restart-journey');
  if (btnRestartJourney) {
    btnRestartJourney.addEventListener('click', () => {
      playCatMeowSFX();

      // Đặt lại 6 con lăn mật mã về 0
      for (let i = 0; i < 6; i++) {
        dialDigits[i] = 0;
        updateDialUI(i);
      }

      // Hiện lại ổ khóa dò số (giữ nguyên layout flex), ẩn bảng kết thúc
      const padlock = document.getElementById('cat-padlock');
      if (padlock) {
        padlock.classList.remove('padlock-hidden');
        padlock.style.display = '';
      }

      const finaleScreen = document.getElementById('door-finale-screen');
      if (finaleScreen) finaleScreen.style.display = 'none';

      // Đặt lại trạng thái ổ khóa về khóa kín
      isDoorUnlocked = false;
      if (catShackle) {
        catShackle.classList.remove('unlocked');
        catShackle.style.transform = '';
      }
      lockStatusLabel.textContent = '🐾 Lăn dò 6 số để mở cửa 🐾';
      lockStatusLabel.style.color = '';

      // Cuộn mượt mà lên đầu trang
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Đặt lại các chương khóa
      document.getElementById('chapter-3')?.classList.add('chapter-locked');
      document.getElementById('chapter-4')?.classList.add('chapter-locked');
      document.getElementById('chapter-3')?.classList.remove('chapter-unlock-reveal', 'room-lights-restored');
      document.getElementById('chapter-4')?.classList.remove('chapter-unlock-reveal');

      // Đặt lại Vách ngăn 2 & 3
      const g2 = document.getElementById('gate-letter-to-cake');
      if (g2) {
        g2.className = 'mini-barrier-pill locked';
        g2.innerHTML = '<span class="pill-icon">🔒</span><span class="pill-text">Hãy đọc hết bức thư chúc sinh nhật bên trên để mở khóa phần tiếp theo nhé 🐾</span>';
        g2.onclick = null;
      }
      const g3 = document.getElementById('gate-cake-to-video');
      if (g3) {
        g3.className = 'mini-barrier-pill dark-pill locked';
        g3.innerHTML = '<span class="pill-icon">🔒</span><span class="pill-text">Thổi nến và cắt bánh sinh nhật để mở khóa phần tiếp theo em nhé 🎂✨</span>';
        g3.onclick = null;
      }

      // Đặt lại thư chúc sinh nhật & chú mèo
      isLetterReadFinished = false;
      hasEnvelopeArrived = false;
      isCatPulling = false;
      const interactiveCat = document.getElementById('interactive-cat');
      if (interactiveCat) interactiveCat.className = 'helper-cat-character';
      setCatActorSrc('cat_idle_waiting.png?v=2');
      const catSpeechBubble = document.getElementById('cat-speech-bubble');
      if (catSpeechBubble) catSpeechBubble.textContent = 'Chạm vào tớ để tớ lôi thư ra cho em nhé! 🐱🐾';
      const giantEnvelope = document.getElementById('giant-envelope');
      if (giantEnvelope) giantEnvelope.className = 'real-envelope-wrapper';
      const unsealedLetter = document.getElementById('unsealed-letter');
      if (unsealedLetter) unsealedLetter.style.display = 'none';
      const stageContainer = document.getElementById('cat-caravan');
      if (stageContainer) stageContainer.style.display = 'flex';

      // Đặt lại bánh kem sinh nhật
      hasIgnitedCandle = false;
      isCandleBlown = false;
      isCakeCut = false;
      isCakeCutFinished = false;
      cakeStage?.classList.remove('in-view');
      luxuryCakeWrapper?.classList.remove('cake-sliced');
      candleFlame?.classList.remove('blown');
      candleSmoke?.classList.remove('active');
      candleSpotlight?.classList.remove('extinguished');
      if (gaugeFillBar) gaugeFillBar.style.strokeDashoffset = '176';
      if (btnHoldFill) btnHoldFill.style.width = '0%';
      if (gaugePrompt) gaugePrompt.textContent = 'Giữ để thổi 💨';
      btnBlowCandle.disabled = false;
      if (btnBlowText) btnBlowText.textContent = 'Giữ lâu để Thổi Tắt Nến 💨';
      btnCutCake.disabled = true;
      if (btnCutText) btnCutText.textContent = 'Cắt Bánh Sinh Nhật 🍰';
      cakeCelebrationMessage.textContent = '';
      const cakeVideoHint = document.getElementById('cake-video-hint');
      if (cakeVideoHint) cakeVideoHint.style.display = 'none';
    });
  }

});
