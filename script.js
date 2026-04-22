/* =========================
   1. 获取页面元素
========================== */
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
    title: "桌玻璃下的照片",
    subtitle: "涵盖被害人从小到大的照片，他是哈尔滨人，毕业后在上海做功课白领，爱看团播",
    photos: [
      "images/photo1.png",
      "images/photo2.png",
      "images/photo3.png",
      "images/photo4.png",
      "images/photo5.png"
    ],
    hiddenBackImage: "images/polaroid.png",
    story: `
      <p>桌玻璃下压着五张照片。它们像被人反复翻看过，不只是普通纪念照。</p>
      <p>当你翻到最后一张时，明显感觉这张纸板更厚，背后似乎还藏着别的东西。</p>
    `,
    note: `
      <p><strong>操作方式：</strong>把鼠标放在左侧照片区域，用滚轮或点击左右按钮切换照片。</p>
    `
  },

  mirror: {
    icon: "🪞",
    title: "衣柜门上的镜子",
    subtitle: "表面异常冰冷",
    image: "images/mirror1.png",
  },

  doll: {
    icon: "🧸",
    title: "床边玩偶",
    subtitle: "与头部和四肢部分的柔软不同，玩偶腹腔部分填充物似乎更坚硬",
    image: "images/doll.png",
    story: `
      <p>你摸到缝线深处，发现填充物里埋着微型镜头。</p>
    `
  },

  dollHidden: {
    icon: "⭕",
    title: "你重新查看娃娃的腹部。",
    image: "images/doll2.png",
    story: `
      <p>你重新查看娃娃的腹部。那一块布料被处理得过于平整，像是在掩盖一个被缝进去的硬物。</p>
    `
  },

  photoReveal: {
    icon: "🖼️",
    title: "翻开的最后一张照片",
    subtitle: "照片背后藏着被刻意隐藏的内容",
    image: "images/evidence3.png",
    story: `
      <p>最后一张照片的背面藏着另一层信息。它不是普通的纪念照片，而是被用来掩盖某个关键线索的外壳。</p>
    `,
    note: `
      <p><strong>说明：</strong>这是你从最后一张照片背面找到的隐藏证据。</p>
    `
  },

  photoMirror: {
    icon: "🖼️",
    title: "镜中桌玻璃下的照片",
    subtitle: "另一叠被压在玻璃下的照片",
    photos: [
      "images/photo6.png",
      "images/photo7.png",
      "images/photo8.png",
      "images/photo9.png",
      "images/photo10.png"
    ],
    story: `
      <p>这一次，桌下压着的是另一组照片。它们延续了上一叠照片没有说完的叙事。</p>
    `,
    note: `
      <p><strong>操作方式：</strong>把鼠标放在左侧照片区域，用滚轮或点击左右按钮切换。</p>
    `
  },

  computer: {
    icon: "💻",
    title: "死者电脑",
    subtitle: "云盘中保存私密视频",
    image: "images/computer.png",
  },

  camera: {
    icon: "📷",
    title: "桌上的相机",
    subtitle: "似乎死者是个喜爱拍照、摄像的人。这与他的工科职业似乎没什么关系，但是又很和“合理”--一个喜爱机械的理工男，对吧",
    image: "images/camera.png",
  },

  polaroid: {
    icon: "🧾",
    title: "放在桌子上的拍立得相机",
    image: "images/pc.png",
  }
};

/* =========================
   4. 页面切换
========================== */
function openScreen(screenToOpen) {
  introScreen.classList.remove("active");
  gameScreen.classList.remove("active");
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
    <div class="photo-stack-shell">
      <p class="photo-stack-instruction">
        鼠标放在照片区域中，可用滚轮或左右按钮切换。

      <div class="photo-stack-stage" id="photoStackStage"></div>

      <div class="photo-stack-footer">
        <button type="button" id="photoPrevBtn">← 上一张</button>
        <div class="photo-stack-counter" id="photoStackCounter">照片 1 / 5</div>
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

      return `
        <div class="photo-card" data-index="${index}">
          <div class="photo-card-face photo-card-front">
            <img src="${src}" alt="照片 ${index + 1}">
          </div>

          ${
            isLast
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

    if (photoStackIndex === photoData.photos.length - 1 && !photoStackFlipped) {
      flipBtn.style.display = "inline-flex";
    } else {
      flipBtn.style.display = "none";
    }

    if (photoStackIndex === photoData.photos.length - 1 && !photoStackFlipped) {
      hint.textContent = "这张照片有点厚，可以点击 Flip，或左右拖拽翻面。";
      hint.classList.add("important");
    } else if (photoStackFlipped) {
      hint.textContent = "你翻到了背面：隐藏证物 evidence3。";
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
  backPage1Btn.addEventListener("click", () => {
    openScreen(gameScreen);
  });

  flipBtn.addEventListener("click", () => {
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

  updatePhotoStack();

  evidenceModal.dataset.photoKeyHandlerBound = "true";
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
      <p class="doll-instruction">
        先观察娃娃腹部。点击腹部位置，也许能发现隐藏层。
      </p>

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
      ? "它这次映出的不再是原来的东西"
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
      <p><strong>镜面已经改变。</strong> 你现在看到的，不再是最初那面镜子。</p>
    `;
    storyText.innerHTML = `
      <p>镜面沉默地停留在那张新的脸上。</p>
      <p>它像已经记住了你，也拒绝恢复原状。</p>
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
    storyText.innerHTML = `
      <p><strong>三个关键证据已经齐了。</strong> 这个房间不是普通的案发现场，而是一个围绕偷窥、记录与隐藏而运转的装置。</p>
    `;
  }

  checkCollapseTrigger();
  currentOpenEvidenceKey = null;
  isClosingForCollapse = false;
}


//动画
function startCollapseSequence() {
  isClosingForCollapse = true;
  closeModal();

  storyText.innerHTML = `
    <p>房间忽然开始不稳定地震颤。</p>
    <p>像有什么东西终于被看见，也终于决定反过来看你。</p>
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
});

backIntroBtn.addEventListener("click", () => {
  openScreen(introScreen);
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
  modalTitle.textContent = "镜子再次亮起";
  modalSubtitle.textContent = "它这次映出的不再是原来的东西";

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

  artifactNote.innerHTML = `
    <p>镜面像接触不良一样闪烁。</p>
    <p>它正在切换成另一个画面。</p>
    <p><strong>等画面稳定后，点击镜子继续。</strong></p>
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
      <p>你穿过镜面，进入了另一个房间。</p>
      <p>布局与刚才几乎一致，只是方向被彻底颠倒了。</p>
    `;
  }
}

  // 这里先留空，后面你可以接：
  // 1. 切第二关
  // 2. 跳转新页面
  // 3. 播放新的过场