/* =========================
   1. 获取页面元素
========================== */
//手脚架！！！一定要删掉
const goIntroBtn = document.getElementById("goIntroBtn");
const goRoom1Btn = document.getElementById("goRoom1Btn");
const goRoom2Btn = document.getElementById("goRoom2Btn");
//
const introScreen = document.getElementById("introScreen");
const gameScreen = document.getElementById("gameScreen");
const startGameBtn = document.getElementById("startGameBtn");
const backIntroBtn = document.getElementById("backIntroBtn");

const roomImage = document.getElementById("roomImage");
const storyText = document.getElementById("storyText");
const progressCount = document.getElementById("progressCount");
const evidenceIcons = document.getElementById("evidenceIcons");

const evidenceModal = document.getElementById("evidenceModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalMark = document.getElementById("modalMark");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const artifactView = document.getElementById("artifactView");
const artifactNote = document.getElementById("artifactNote");

//晃动动画
const gameLayout = document.querySelector(".game-layout");
const scenePanel = document.querySelector(".scene-panel");
const sidePanel = document.querySelector(".side-panel");
const topBar = document.querySelector(".top-bar");
const gameScreenInner = document.getElementById("gameScreen");
const panelBlocks = document.querySelectorAll(".panel-block");
const storyPanelText = document.querySelectorAll(".story-text, .panel-block h3, .panel-block p, .top-bar h2, .top-bar p");
const evidenceButtons = document.querySelectorAll(".evidence-btn");

const gameScreen2 = document.getElementById("gameScreen2");
const backPage1Btn = document.getElementById("backPage1Btn");
const roomImage2 = document.getElementById("roomImage2");
const storyText2 = document.getElementById("storyText2");

const bgm1 = document.getElementById("bgm1");
const bgm2 = document.getElementById("bgm2");

let bgm1Started = false;
let bgm2Started = false;

const CLICK_SOUND_SRC = "audio/click.mp3";

function playClickSound() {
  const clickAudio = new Audio(CLICK_SOUND_SRC);
  clickAudio.volume = 0.5;
  clickAudio.play().catch((err) => {
    console.log("Click sound blocked:", err);
  });
}

document.addEventListener("click", (event) => {
  const clickable = event.target.closest("button");
  if (!clickable) return;
  if (clickable.closest("#scaffoldNav")) return;
  playClickSound();
});

function safePlay(audioEl) {
  if (!audioEl) return;
  audioEl.play().catch((err) => {
    console.log("Audio play blocked:", err);
  });
}

function startBgm1() {
  if (!bgm1 || bgm1Started) return;

  bgm1.volume = 0.6;
  if (bgm2) bgm2.volume = 0.75;

  bgm1.currentTime = 0;
  safePlay(bgm1);

  bgm1Started = true;
  bgm2Started = false;
}

function switchToBgm2() {
  if (!bgm2 || bgm2Started) return;

  if (bgm1) {
    bgm1.pause();
    bgm1.currentTime = 0;
  }

  bgm2.currentTime = 0;
  safePlay(bgm2);

  bgm1Started = false;
  bgm2Started = true;
}

function stopAllBgm() {
  if (bgm1) {
    bgm1.pause();
    bgm1.currentTime = 0;
  }

  if (bgm2) {
    bgm2.pause();
    bgm2.currentTime = 0;
  }

  bgm1Started = false;
  bgm2Started = false;
}
/* =========================
   2. 记录已发现证据
========================== */
const discovered = new Set();

const coreEvidenceKeys = ["dollHidden", "computer", "photoReveal"];
const investigationKeys = ["dollHidden", "computer", "photoReveal", "mirror", "camera", "polaroid"];

const collectedEvidence = new Set();
const investigatedItems = new Set();

let currentOpenEvidenceKey = null;
const pendingEvidenceRewards = new Set();
const pendingInvestigationRewards = new Set();
let isClosingForCollapse = false;
let mirrorCorrupted = false;

let allCoreEvidenceUnlocked = false;

let collapseStarted = false;
let collapseFinished = false;
let collapseTimers = [];

/* =========================
   3. 证据数据
   你只需要改图片路径和文字内容
========================== */
const evidenceData = {
  photo: {
    icon: "🖼️",
    title: "A series of photo taken under the table glass",
    subtitle: "The photos cover the victim from childhood to adulthood. He is from Harbin. After graduation, he worked as a white-collar worker doing homework in Shanghai and loved watching thirsty trap videos and livestreaming profitting on male gaze",
    photos: [
      "images/photo1.png",
      "images/photo2.png",
      "images/photo3.png",
      "images/photo4.png",
      "images/photo5.png"
    ],
    hiddenBackImage: "images/polaroid.png",
    story: `
      <p>The victim displays this five photos to identify and fashion his identity</p>
      <p>When you turn to the last one, you can clearly feel that this cardboard is thicker and there seems to be something else hidden behind it</p>
    `
  },

  mirror: {
    icon: "🪞",
    title: "The mirror on the wardrobe door",
    subtitle: "The surface is extremely cold",
    image: "images/mirror1.png",
  },

  doll: {
    icon: "🧸",
    title: "Doll on the bed",
    subtitle: "Unlike the softness of the head and limbs, the filling in the abdominal cavity of the doll seems to be harder",
    image: "images/doll.png",
    story: `
      <p>You reached deep into the suture and found a miniature lens buried in the filling.</p>
    `
  },

  dollHidden: {
    icon: "⭕",
    title: "Take another look at the doll's abdomen.",
    image: "images/doll2.png",
  },

  photoReveal: {
    icon: "🖼️",
    title: "The hidden polaroid revealed",
    subtitle: "why, another device?",
    image: "images/evidence3.png",
  },

  photoMirror: {
    icon: "🖼️",
    title: "The photos in the file folder",
    photos: [
      "images/photo6.png",
      "images/photo7.png",
      "images/photo8.png",
      "images/photo9.png",
      "images/photo10.png"
    ],
  },

  computer: {
    icon: "💻",
    title: "The victim's PC",
    subtitle: "The deceased's private video is saved in Cloud Drive a of the computer",
    image: "images/computer.png",
    note: `
    <p><strong>女人：</strong>你在录像吗？</p>
    <p><strong>Woman:</strong> Are you recording me?</p>
    <p><strong>男人：</strong>宝贝，对不起，你太美了，我就想要录下来，我就是自己看，没和别人分享。</p>
    <p><strong>Man:</strong> Baby, I'm sorry. You're just too beautiful. I wanted to record you. It's only for me to watch. I haven't shared it with anyone else.</p>
    <p><strong>女人：</strong>什么！你把我当成什么了！别录了，我说别录了！难道你忘了我对你说的！一旦被人看见，我将万劫不复！你不能理解吗？</p>
    <p><strong>Woman:</strong> What? What do you think I am? Stop recording. I said stop recording! Did you forget what I told you? If anyone sees this, I'll be ruined forever. Don't you understand?</p>
    <p><strong>男人：</strong>闭上嘴！我把你录下来是欣赏你的肉体，你别不识好歹。长成这样不就是给人看的吗，不然我还花时间和精力和你约会做什么？我从小刻苦考进大厂就是为了老婆孩子热炕头，你读大学和天天打扮不就是为了嫁得好，那既然给我了，我想咋看就咋看。（击打声）</p>
    <p><strong>Man:</strong> Shut up! I recorded you because I enjoy looking at your body, so don't act ungrateful. Isn't a body like yours meant to be looked at? Otherwise why would I spend all this time and energy dating you? I studied my whole life and fought my way into a top company so I could have a wife, kids, and a warm bed at home. Didn't you go to college and dress yourself up every day so you could marry well? Now that you're with me, I can look at you however I want. <em>(sound of a blow)</em></p>
    <p><strong>女人：</strong>（哭声）我曾经就被机器记录过伤害过。你答应我的事呢？我大学就和你约会了。我以为你尊重我，我以为你拿我当人。</p>
    <p><strong>Woman:</strong> <em>(crying)</em> I was hurt before because of machines that recorded me. What about what you promised me? I've been with you since college. I thought you respected me. I thought you saw me as a person.</p>
    <p><strong>男人：</strong>给脸不要。你大学就把贞洁给我了，你以为你是什么好货色？别人好要你吗，婊子。你该庆幸有人看你。我可给你们家彩礼了，你整个人都是我的了。当人？当然当人看，前提你得该做啥做啥。床上，家里，做饭，生孩子，你都干好了才能有资格叫，有资格提要求。还尊重？互联网女权你这是。女权可以叫，要排在阶级、民族的后面。你以为的。</p>
    <p><strong>Man:</strong> Don't push your luck. You gave me your virginity back in college. What makes you think you're still some kind of prize? Who else would even want you, slut? You should be grateful anyone is willing to look at you. I paid bride price to your family. That means you belong to me, completely. A person? Sure, I'll treat you like a person—if you do what you're supposed to do. In bed, at home, cooking, having children. Only when you do all of that do you earn the right to complain, the right to ask for anything. Respect? This is that internet feminism talking. Women can talk about rights only after class and nation come first. That's how it really is.</p>
    <p><strong>女人：</strong>啊！</p>
    <p><strong>Woman:</strong> Ah!</p>
    <p><strong>男人：</strong>还哭，我和你说，这间房子是我婚前财产，你再哭我给你扫地出门！</p>
    <p><strong>Man:</strong> Still crying? Let me tell you something. This house is my premarital property. If you keep crying, I'll throw you out with nothing!</p>
    <p><strong>女人：</strong>这是什么？你又做什么！啊！</p>
    <p><strong>Woman:</strong> What is this? What are you doing now? Ah!</p>
    <p><strong>男人：</strong>（也开始尖叫）好烫！我的眼睛。</p>
    <p><strong>Man:</strong> <em>(also screaming)</em> It's burning! My eyes!</p>
  `
  },

  camera: {
    icon: "📷",
    title: "The victim's camera colelction",
    subtitle: "It seems that the deceased was a person who loved taking photos and videos. This seems to have little to do with his engineering career, but it's quite reasonable - a science and engineering guy who loves machinery, right?",
    image: "images/camera.png",
  },

  polaroid: {
    icon: "🧾",
    title: "The Polaroid camera placed on the table",
    image: "images/pc.png",
  }
};

/* =========================
   4. 页面切换
========================== */
function openScreen(screenToOpen) {
  introScreen.classList.remove("active");
  gameScreen.classList.remove("active");
  gameScreen2.classList.remove("active");
  screenToOpen.classList.add("active");
}

/* =========================
   5. 照片堆叠组件状态
========================== */
let photoStackIndex = 0;
let photoStackFlipped = false;

/* 滚轮分页控制 */
let wheelLocked = false;
let wheelGestureReady = true;
let wheelReleaseTimer = null;

/* =========================
   6. 渲染照片堆叠组件
========================== */
function renderPhotoStack(photoData) {
  artifactView.innerHTML = `
    <div class="photo-stack-shell ${photoData.vintageStyle ? "photo-stack-shell-vintage" : ""}">
      <p class="photo-stack-instruction">
        examine the photos with your mouse
      </p>

      <div class="photo-stack-stage ${photoData.vintageStyle ? "photo-stage-vintage" : ""}" id="photoStackStage"></div>

      <div class="photo-stack-footer">
        <button type="button" id="photoPrevBtn">← 上一张</button>
        <div class="photo-stack-counter" id="photoStackCounter">照片 1 / ${photoData.photos.length}</div>
        <button type="button" id="photoNextBtn">下一张 →</button>
      </div>

      <div class="photo-stack-footer" style="margin-top: 8px;">
        <div class="photo-stack-hint" id="photoStackHint">滚轮或按钮切换照片</div>
        <button type="button" id="photoFlipBtn" class="photo-flip-btn">Flip</button>
      </div>
    </div>
  `;

  const stage = document.getElementById("photoStackStage");
  const counter = document.getElementById("photoStackCounter");
  const hint = document.getElementById("photoStackHint");
  const prevBtn = document.getElementById("photoPrevBtn");
  const nextBtn = document.getElementById("photoNextBtn");
  const flipBtn = document.getElementById("photoFlipBtn");

  photoStackIndex = 0;
  photoStackFlipped = false;
  wheelLocked = false;

  stage.innerHTML = photoData.photos
    .map((src, index) => {
      const isLast = index === photoData.photos.length - 1;
      const vintageCardClass = photoData.vintageStyle ? " photo-card-vintage" : "";
      const vintageFrontClass = photoData.vintageStyle ? " photo-card-front-vintage" : "";

      return `
        <div class="photo-card${vintageCardClass}" data-index="${index}">
          <div class="photo-card-face photo-card-front${vintageFrontClass}">
            <img src="${src}" alt="照片 ${index + 1}">
          </div>

          ${
            isLast && photoData.hiddenBackImage
              ? `
                <div class="photo-card-face photo-card-back">
                  <div class="photo-back-inner">
                    <img src="${photoData.hiddenBackImage}" alt="翻开的最后一张照片">
                  </div>
                </div>
              `
              : ""
          }
        </div>
      `;
    })
    .join("");

  const cards = Array.from(stage.querySelectorAll(".photo-card"));
  const lastCard = cards[cards.length - 1];

  function updatePhotoStack() {
    cards.forEach((card, i) => {
      card.classList.remove(
        "is-hidden",
        "is-back-2",
        "is-back-1",
        "is-active",
        "is-next-1",
        "is-next-2"
      );

      if (i < photoStackIndex - 2 || i > photoStackIndex + 2) {
        card.classList.add("is-hidden");
      } else if (i === photoStackIndex - 2) {
        card.classList.add("is-back-2");
      } else if (i === photoStackIndex - 1) {
        card.classList.add("is-back-1");
      } else if (i === photoStackIndex) {
        card.classList.add("is-active");
      } else if (i === photoStackIndex + 1) {
        card.classList.add("is-next-1");
      } else if (i === photoStackIndex + 2) {
        card.classList.add("is-next-2");
      }
    });

    if (photoStackFlipped) {
      lastCard.classList.add("flipped");
    } else {
      lastCard.classList.remove("flipped");
    }

    counter.textContent = `照片 ${photoStackIndex + 1} / ${photoData.photos.length}`;

    if (
      photoData.hiddenBackImage &&
      photoStackIndex === photoData.photos.length - 1 &&
      !photoStackFlipped
    ) {
      flipBtn.style.display = "inline-flex";
    } else {
      flipBtn.style.display = "none";
    }

    if (
      photoData.hiddenBackImage &&
      photoStackIndex === photoData.photos.length - 1 &&
      !photoStackFlipped
    ) {
      hint.textContent = "这张照片有点厚，可以点击 Flip，或左右拖拽翻面。";
      hint.classList.add("important");
    } else if (photoStackFlipped) {
      hint.textContent = "你翻到了背面。";
      hint.classList.add("important");
    } else {
      hint.textContent = "滚轮或按钮切换照片";
      hint.classList.remove("important");
    }

    prevBtn.disabled = photoStackIndex === 0 || photoStackFlipped;
    nextBtn.disabled = photoStackIndex === photoData.photos.length - 1 || photoStackFlipped;
  }

  function goPrev() {
    if (photoStackFlipped) return;
    if (photoStackIndex > 0) {
      photoStackIndex -= 1;
      updatePhotoStack();
    }
  }

  function goNext() {
    if (photoStackFlipped) return;
    if (photoStackIndex < photoData.photos.length - 1) {
      photoStackIndex += 1;
      updatePhotoStack();
    }
  }

  prevBtn.addEventListener("click", goPrev);
  nextBtn.addEventListener("click", goNext);

  flipBtn.addEventListener("click", () => {
    if (!photoData.hiddenBackImage) return;
    if (photoStackIndex !== photoData.photos.length - 1) return;
    if (photoStackFlipped) return;

    photoStackFlipped = true;
    queueEvidenceReward("photoReveal");
    queueInvestigationReward("photoReveal");
    lastCard.style.transform = "";
    lastCard.classList.add("flipped");
    hint.textContent = "你翻到了背面：隐藏证物 evidence3。";
    hint.classList.add("important");
    prevBtn.disabled = true;
    nextBtn.disabled = true;
    flipBtn.style.display = "none";
  });

  stage.addEventListener(
    "wheel",
    (event) => {
      event.preventDefault();

      if (photoStackFlipped) return;
      if (Math.abs(event.deltaY) < 12) return;
      if (wheelLocked) return;
      if (!wheelGestureReady) return;

      wheelLocked = true;
      wheelGestureReady = false;

      if (event.deltaY > 0) {
        goNext();
      } else {
        goPrev();
      }

      setTimeout(() => {
        wheelLocked = false;
      }, 420);

      if (wheelReleaseTimer) {
        clearTimeout(wheelReleaseTimer);
      }

      wheelReleaseTimer = setTimeout(() => {
        wheelGestureReady = true;
      }, 260);
    },
    { passive: false }
  );

  function keyHandler(event) {
    if (!evidenceModal.classList.contains("active")) return;
    if (!artifactView.querySelector("#photoStackStage")) return;

    if (event.key === "ArrowLeft") {
      goPrev();
    } else if (event.key === "ArrowRight") {
      goNext();
    }
  }

  document.addEventListener("keydown", keyHandler);

  let isDragging = false;
  let dragStartX = 0;
  let currentDragX = 0;

  if (photoData.hiddenBackImage) {
    lastCard.addEventListener("pointerdown", (event) => {
      if (photoStackIndex !== photoData.photos.length - 1) return;
      if (photoStackFlipped) return;

      isDragging = true;
      dragStartX = event.clientX;
      currentDragX = 0;
      lastCard.classList.add("dragging");
      lastCard.setPointerCapture(event.pointerId);
    });

    lastCard.addEventListener("pointermove", (event) => {
      if (!isDragging) return;

      currentDragX = event.clientX - dragStartX;
      const rotate = Math.max(-14, Math.min(14, currentDragX / 10));
      lastCard.style.transform = `translate(-50%, -50%) rotate(${rotate}deg)`;
    });

    function resetLastCardPosition() {
      lastCard.style.transform = "";
      updatePhotoStack();
    }

    function finishDrag() {
      if (!isDragging) return;

      isDragging = false;
      lastCard.classList.remove("dragging");

      if (Math.abs(currentDragX) > 55) {
        photoStackFlipped = true;
        lastCard.style.transform = "";
        lastCard.classList.add("flipped");
        hint.textContent = "你翻到了背面：隐藏证物";
        hint.classList.add("important");
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        queueEvidenceReward("photoReveal");
        queueInvestigationReward("photoReveal");
      } else {
        resetLastCardPosition();
      }
    }

    lastCard.addEventListener("pointerup", finishDrag);
    lastCard.addEventListener("pointercancel", finishDrag);
    lastCard.addEventListener("lostpointercapture", finishDrag);
  }

  updatePhotoStack();

  evidenceModal._photoKeyHandler = keyHandler;
}

/* =========================
   娃娃腹部交互状态
========================== */
let dollStage = 1;

function renderDollInteraction(dollData) {
  dollStage = 1;

  artifactView.innerHTML = `
    <div class="doll-shell">


      <div class="doll-stage" id="dollStage">
        <img
          id="dollMainImage"
          class="doll-main-image"
          src="${dollData.image}"
          alt="${dollData.title}"
        />

        <button
          id="dollBellyHotspot"
          class="doll-belly-hotspot"
          aria-label="点击娃娃腹部"
        ></button>

        <div id="dollDissolveOverlay" class="doll-dissolve-overlay"></div>
        <div id="dollRedCircle" class="doll-red-circle"></div>
      </div>
    </div>
  `;

  const dollMainImage = document.getElementById("dollMainImage");
  const dollBellyHotspot = document.getElementById("dollBellyHotspot");
  const dollDissolveOverlay = document.getElementById("dollDissolveOverlay");
  const dollRedCircle = document.getElementById("dollRedCircle");

  dollBellyHotspot.addEventListener("click", () => {
    if (dollStage === 1) {
      dollStage = 2;

      dollDissolveOverlay.classList.add("active");

      setTimeout(() => {
        dollMainImage.src = "images/doll2.png";
      }, 220);

      setTimeout(() => {
        dollDissolveOverlay.classList.remove("active");
      }, 520);

      const noteBlock = document.getElementById("artifactNote");
      if (noteBlock) {
        noteBlock.innerHTML = `
          <p><strong>你发现了异常：</strong>娃娃腹部的质感发生了变化，表面像被重新缝补过。</p>
          <p><strong>继续操作：</strong>再点击一次腹部，锁定具体异常位置。</p>
        `;
      }

      return;
    }

    if (dollStage === 2) {
      dollStage = 3;

      dollRedCircle.classList.add("visible");

      queueEvidenceReward("dollHidden");
      queueInvestigationReward("dollHidden");

      const noteBlock = document.getElementById("artifactNote");
      if (noteBlock) {
        noteBlock.innerHTML = `
          <p><strong>已锁定：</strong>红圈处就是娃娃腹部的异常位置。</p>
          <p><strong>关闭这个弹窗后，证物会正式加入右侧证据栏。</strong></p>
        `;
      }

      storyText.innerHTML = `
        <p>你按压娃娃腹部后，发现其中并不是棉絮的柔软感，而是被隐藏的硬物轮廓。</p>
        <p>那个位置被红圈标记出来。伪装成玩具的监视装置，终于露出具体形状。</p>
      `;

      return;
    }
  });
}
function addEvidenceToPanel(key) {
  if (!coreEvidenceKeys.includes(key)) return;
  if (collectedEvidence.has(key)) return;

  const data = evidenceData[key];
  if (!data) return;

  collectedEvidence.add(key);

  const btn = document.createElement("button");
  btn.className = "evidence-btn visible";
  btn.dataset.evidence = key;
  btn.innerHTML = `${data.icon}<span>${data.title}</span>`;

  btn.addEventListener("click", () => {
    openEvidence(key);
  });

  evidenceIcons.appendChild(btn);
}


function addToInvestigationProgress(key) {
  if (!investigationKeys.includes(key)) return;
  if (investigatedItems.has(key)) return;

  investigatedItems.add(key);
  progressCount.textContent = `${investigatedItems.size} / 6`;
}

function queueEvidenceReward(key) {
  if (!coreEvidenceKeys.includes(key)) return;
  if (collectedEvidence.has(key)) return;
  pendingEvidenceRewards.add(key);
}

function queueInvestigationReward(key) {
  if (!investigationKeys.includes(key)) return;
  if (investigatedItems.has(key)) return;
  pendingInvestigationRewards.add(key);
}

function checkCollapseTrigger() {
  if (collapseStarted) return;
  if (collectedEvidence.size < 3) return;
  if (investigatedItems.size < 6) return;

  collapseStarted = true;
  startCollapseSequence();
}
/* =========================
   7. 打开证据弹窗
========================== */

function queueEvidenceReward(key) {
  if (!coreEvidenceKeys.includes(key)) return;
  if (collectedEvidence.has(key)) return;
  pendingEvidenceRewards.add(key);
}
 function queueInvestigationReward(key) {
  if (!investigationKeys.includes(key)) return;
  if (investigatedItems.has(key)) return;
  pendingInvestigationRewards.add(key);
}

function openEvidence(key) {
  const data = evidenceData[key];
  if (!data) return;

  currentOpenEvidenceKey = key;
  pendingEvidenceRewards.clear();
  pendingInvestigationRewards.clear();

  if (key === "computer") {
    queueEvidenceReward("computer");
    queueInvestigationReward("computer");
  }

  if (key === "mirror" || key === "camera" || key === "polaroid") {
    queueInvestigationReward(key);
  }

  modalMark.textContent = data.icon;
  modalTitle.textContent = data.title;
  modalSubtitle.textContent = data.subtitle || "";

  if (key === "photo" || key === "photoMirror") {
  renderPhotoStack(data);
  } else if (key === "doll") {
    renderDollInteraction(data);
  } else if (key === "mirror") {
    const mirrorSrc = mirrorCorrupted ? "images/mirror2.png" : "images/mirror1.png";
    const mirrorSubtitle = mirrorCorrupted
      ? "It refused to reflect what it sees."
      : (data.subtitle || "");

    modalSubtitle.textContent = mirrorSubtitle;

    artifactView.innerHTML = `
      <img class="artifact-image" src="${mirrorSrc}" alt="${data.title}">
    `;
  } else {
    artifactView.innerHTML = `
      <img class="artifact-image" src="${data.image}" alt="${data.title}">
    `;
  }

  if (key === "mirror" && mirrorCorrupted) {
    artifactNote.innerHTML = `
      <p><strong>The mirror surface has changed.</strong> What you see now is no longer the mirror you saw at the beginning.</p>
    `;
  } else {
    artifactNote.innerHTML = data.note || "";
    storyText.innerHTML = data.story || "";
  }

  evidenceModal.classList.add("active");
  roomImage.classList.add("blurred");
}

/* =========================
   8. 关闭弹窗
========================== */
function closeModal() {
  if (!isClosingForCollapse) {
    pendingEvidenceRewards.forEach((key) => {
      addEvidenceToPanel(key);
    });

    pendingInvestigationRewards.forEach((key) => {
      addToInvestigationProgress(key);
    });
  }

  pendingEvidenceRewards.clear();
  pendingInvestigationRewards.clear();

  evidenceModal.classList.remove("active");
  roomImage.classList.remove("blurred");

  if (evidenceModal._photoKeyHandler) {
    document.removeEventListener("keydown", evidenceModal._photoKeyHandler);
    evidenceModal._photoKeyHandler = null;
  }

  if (!allCoreEvidenceUnlocked && collectedEvidence.size === 3) {
    allCoreEvidenceUnlocked = true;
  }

  checkCollapseTrigger();
  currentOpenEvidenceKey = null;
  isClosingForCollapse = false;
}


//动画
function startCollapseSequence() {
  switchToBgm2();

  isClosingForCollapse = true;
  closeModal();

  storyText.innerHTML = `
    <p>The room suddenly began to tremble unstably.</p>
    <p>It's as if something has finally been seen and has finally decided to look at you in the opposite direction.</p>
  `;

  stopCollapseSequence();

  roomImage.classList.add("image-blackout-stage-1");

  collapseTimers.push(setTimeout(() => {
    roomImage.classList.add("image-shake-stage-2");
    roomImage.classList.remove("image-blackout-stage-1");
    roomImage.classList.add("image-blackout-stage-2");
  }, 3000));

  collapseTimers.push(setTimeout(() => {
    document.body.classList.add("borders-flicker-stage-3");
  }, 10000));

  collapseTimers.push(setTimeout(() => {
    document.body.classList.add("text-chaos-stage-4");
    document.body.classList.add("global-flicker-stage-4");
  }, 15000));

  collapseTimers.push(setTimeout(() => {
    roomImage.classList.remove("image-blackout-stage-2");
    roomImage.classList.add("image-blackout-stage-5");

    gameScreenInner.classList.add("whole-screen-shake-stage-5");
    document.body.classList.remove("global-flicker-stage-4");
    document.body.classList.add("global-flicker-stage-5");
  }, 20000));

  collapseTimers.push(setTimeout(() => {
    document.body.classList.add("final-blackout-stage");
    gameScreenInner.classList.add("final-image-takeover");
  }, 27000));

  collapseTimers.push(setTimeout(() => {
    stopCollapseSequence();
    showMirrorFinale();
  }, 30000));
}
//结束
function stopCollapseSequence() {
  collapseFinished = true;

  collapseTimers.forEach((timerId) => clearTimeout(timerId));
  collapseTimers = [];

  roomImage.classList.remove(
    "image-blackout-stage-1",
    "image-shake-stage-2",
    "image-blackout-stage-2",
    "image-blackout-stage-5"
  );

  gameScreenInner.classList.remove(
    "whole-screen-shake-stage-5",
    "final-image-takeover"
  );

  document.body.classList.remove(
    "borders-flicker-stage-3",
    "text-chaos-stage-4",
    "global-flicker-stage-4",
    "global-flicker-stage-5",
    "final-blackout-stage"
  );
}
/* =========================
   9. 绑定页面事件
========================== */
startGameBtn.addEventListener("click", () => {
  openScreen(gameScreen);
  startBgm1();
});


backIntroBtn.addEventListener("click", () => {
  openScreen(introScreen);
  stopAllBgm();
});

backPage1Btn.addEventListener("click", () => {
  openScreen(gameScreen);
});

document.querySelectorAll(".hotspot").forEach((hotspot) => {
  hotspot.addEventListener("click", () => {
    const key = hotspot.dataset.evidence;
    openEvidence(key);
  });
});

document.querySelectorAll(".evidence-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("visible")) {
      const key = btn.dataset.evidence;
      openEvidence(key);
    }
  });
});

closeModalBtn.addEventListener("click", closeModal);

evidenceModal.addEventListener("click", (event) => {
  if (event.target === evidenceModal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

function showMirrorFinale() {
  const data = evidenceData.mirror;
  if (!data) return;

  mirrorCorrupted = true;

  modalMark.textContent = data.icon;
  modalTitle.textContent = "The mirror has changed";
  modalSubtitle.textContent = "It no longer reflects what it sees, or... does it?";

  artifactView.innerHTML = `
    <div class="mirror-finale-wrap">
      <img
        id="finalMirrorImage"
        class="artifact-image mirror-finale-image"
        src="images/mirror1.png"
        alt="镜子"
      />
    </div>
  `;

  evidenceModal.classList.add("active");
  roomImage.classList.add("blurred");

  const finalMirrorImage = document.getElementById("finalMirrorImage");

  setTimeout(() => {
    finalMirrorImage.classList.add("mirror-flashing");
  }, 120);

  setTimeout(() => {
    finalMirrorImage.src = "images/mirror2.png";
    finalMirrorImage.classList.remove("mirror-flashing");
    finalMirrorImage.classList.add("mirror-final-form");
  }, 1400);

  setTimeout(() => {
    finalMirrorImage.addEventListener("click", handleMirrorFinalClick, { once: true });
  }, 1500);
  
}

function handleMirrorFinalClick() {
  closeModal();
  openScreen(gameScreen2);

  if (storyText2) {
    storyText2.innerHTML = `
      <p>You passed through the mirror and entered another room.</p>
      <p>This room is completely mirrored in layout with the crime scene</p>
    `;
  }
}

  // 这里先留空，后面你可以接：
  // 1. 切第二关
  // 2. 跳转新页面
  // 3. 播放新的过场
  
  goIntroBtn.addEventListener("click", () => {
    openScreen(introScreen);
  });

  goRoom1Btn.addEventListener("click", () => {
    openScreen(gameScreen);
  });

  goRoom2Btn.addEventListener("click", () => {
    openScreen(gameScreen2);
  });//一定要删掉