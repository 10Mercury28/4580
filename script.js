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

const evidenceModal = document.getElementById("evidenceModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalMark = document.getElementById("modalMark");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const artifactView = document.getElementById("artifactView");
const artifactNote = document.getElementById("artifactNote");

/* =========================
   2. 记录已发现证据
========================== */
const discovered = new Set();

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
    hiddenBackImage: "images/evidence3.png",
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
    image: "images/mirror.png",
    story: `
      <p>镜面比周围更冷。你靠近时，影子像短暂错位了一下。</p>
      <p>这不像一面普通镜子。更像一道尚未彻底打开的门。</p>
    `,
    note: `
      <p><strong>用途：</strong>这是第二轮镜像空间的伏笔。</p>
    `
  },

  doll: {
    icon: "🧸",
    title: "床边玩偶",
    subtitle: "内部藏有针孔摄像头",
    image: "images/doll.png",
    story: `
      <p>你摸到缝线深处，发现填充物里埋着微型镜头。</p>
      <p>亲密空间并不是被“纪念”，而是被监视。</p>
    `,
    note: `
      <p><strong>证据意义：</strong>偷拍视频不是临时起意，而是长期、预谋性的窥视。</p>
    `
  },
  dollHidden: {
    icon: "⭕",
    title: "娃娃腹部异常痕迹",
    subtitle: "红圈标注出的隐藏位置",
    image: "images/doll2.png",
    story: `
      <p>你重新查看娃娃的腹部。那一块布料被处理得过于平整，像是在掩盖一个被缝进去的硬物。</p>
      <p>红圈标记的位置，让这个“玩偶”彻底失去无害的外表。</p>
    `,
    note: `
      <p><strong>发现：</strong>点击腹部后，你锁定了娃娃内部异常位置。</p>
      <p><strong>意义：</strong>这说明偷拍视频装置被精确嵌入在看似柔软、无害、亲密的物体内部。</p>
    `
  },

  computer: {
    icon: "💻",
    title: "死者电脑",
    subtitle: "云盘中保存私密视频",
    image: "images/computer.png",
    story: `
      <p>电脑里保存着多段私密视频和录音。女人说：一旦被人看见，她将万劫不复。</p>
      <p>“我曾经就被机器记录过、伤害过。”</p>
    `,
    note: `
      <p><strong>关键点：</strong>这里把当下偷拍与更早的“被机器记录”的历史性伤害联系起来。</p>
    `
  },

  camera: {
    icon: "📷",
    title: "桌上的相机",
    subtitle: "镜头朝向床铺",
    image: "images/camera.png",
    story: `
      <p>镜头朝着床的位置。卧室像被布置成了一间小型拍摄场。</p>
      <p>这不是偶然，而是等待、取景、记录。</p>
    `,
    note: `
      <p><strong>证据意义：</strong>它把亲密空间转化成了视觉生产空间。</p>
    `
  },

  polaroid: {
    icon: "🧾",
    title: "藏起来的拍立得",
    subtitle: "女人熟睡与裸露的影像",
    image: "images/polaroid.png",
    story: `
      <p>抽出的拍立得显示女人在熟睡中被拍下，身体与脸被贴近构图。</p>
      <p>这不是共同留影，而是单方面把她变成对象。</p>
    `,
    note: `
      <p><strong>证据意义：</strong>不仅是电子存档，连实体照片也在占有她的身体。</p>
    `
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
let wheelLocked = false;          // 冷却锁：翻一页后短时间内不允许再翻
let wheelGestureReady = true;     // 本次滚轮手势是否允许触发翻页
let wheelReleaseTimer = null;     // 用来判断“手已经停下来了”

/* =========================
   6. 渲染照片堆叠组件
   修复点：
   - 加左右按钮，避免用户只能用滚轮
   - 滚轮节流，防止一下翻好几张
   - 最后一张拖拽翻面更容易成功
========================== */
function renderPhotoStack(photoData) {
  artifactView.innerHTML = `
  <div class="photo-stack-shell">
    <p class="photo-stack-instruction">
      鼠标放在照片区域中，可用滚轮或左右按钮切换。到最后一张后，可点击 Flip 或直接左右拖拽翻面。
    </p>

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
                    <img src="images/polaroid.png" alt="隐藏证物 evidence3">
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

    /* 如果最后一张已经翻面，确保它维持翻面状态 */
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

  /* 左右按钮翻页 */
  prevBtn.addEventListener("click", goPrev);
  nextBtn.addEventListener("click", goNext);

  flipBtn.addEventListener("click", () => {
  if (photoStackIndex !== photoData.photos.length - 1) return;
  if (photoStackFlipped) return;

  photoStackFlipped = true;
  lastCard.style.transform = "";
  lastCard.classList.add("flipped");
  hint.textContent = "你翻到了背面：隐藏证物 evidence3。";
  hint.classList.add("important");
  prevBtn.disabled = true;
  nextBtn.disabled = true;
  flipBtn.style.display = "none";
});

  /* 滚轮翻页：加锁，避免一滑到底 */
stage.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();

    if (photoStackFlipped) return;

    /* 忽略很小的抖动，避免触控板轻微噪声也翻页 */
    if (Math.abs(event.deltaY) < 12) return;

    /* 如果还在冷却中，直接忽略 */
    if (wheelLocked) return;

    /* 如果这次手势还没“释放”，也忽略
       这样一次连续滑动只会翻一页
    */
    if (!wheelGestureReady) return;

    /* 锁住：这一次手势只允许翻一页 */
      wheelLocked = true;
      wheelGestureReady = false;

      if (event.deltaY > 0) {
        goNext();
      } else {
        goPrev();
      }

      /* 冷却时间：翻页后停顿一下 */
      setTimeout(() => {
        wheelLocked = false;
      }, 420);

      /* 只要持续有滚轮事件，就不断重置“释放计时器”
        等用户真的停下来一小会儿，才允许下一次翻页
      */
      if (wheelReleaseTimer) {
        clearTimeout(wheelReleaseTimer);
      }

      wheelReleaseTimer = setTimeout(() => {
        wheelGestureReady = true;
      }, 260);
    },
    { passive: false }
  );

  /* 键盘左右键翻页 */
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

  /* 拖拽翻最后一张 */
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

    /* 只允许轻微预览旋转，手感更稳定 */
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

    /* 阈值降低，更容易翻过去 */
    if (Math.abs(currentDragX) > 55) {
      photoStackFlipped = true;
      lastCard.style.transform = "";
      lastCard.classList.add("flipped");
      hint.textContent = "你翻到了背面：隐藏证物 evidence3。";
      hint.classList.add("important");
      prevBtn.disabled = true;
      nextBtn.disabled = true;
    } else {
      resetLastCardPosition();
    }
  }

  lastCard.addEventListener("pointerup", finishDrag);
  lastCard.addEventListener("pointercancel", finishDrag);
  lastCard.addEventListener("lostpointercapture", finishDrag);

  updatePhotoStack();

  /* 关闭弹窗时清理键盘监听，避免重复绑定 */
  evidenceModal.dataset.photoKeyHandlerBound = "true";
  evidenceModal._photoKeyHandler = keyHandler;
}

/* =========================
   娃娃腹部交互状态
   第一阶段：doll.png
   点击腹部后 dissolve 到 doll2.png
   第二阶段：再次点击腹部 -> 出现红圈，并解锁新证物
========================== */
let dollStage = 1; // 1 = 原图, 2 = 切换到 doll2, 3 = 红圈已出现

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

        <!-- 腹部点击区域 -->
        <button
          id="dollBellyHotspot"
          class="doll-belly-hotspot"
          aria-label="点击娃娃腹部"
        ></button>

        <!-- dissolve 黑幕层：用于过渡 -->
        <div id="dollDissolveOverlay" class="doll-dissolve-overlay"></div>

        <!-- 红圈 -->
        <div id="dollRedCircle" class="doll-red-circle"></div>
      </div>
    </div>
  `;

  const dollMainImage = document.getElementById("dollMainImage");
  const dollBellyHotspot = document.getElementById("dollBellyHotspot");
  const dollDissolveOverlay = document.getElementById("dollDissolveOverlay");
  const dollRedCircle = document.getElementById("dollRedCircle");

  dollBellyHotspot.addEventListener("click", () => {
    /* 第一击：从 doll.png dissolve 到 doll2.png */
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

    /* 第二击：显示红圈，并把 doll2 作为新证物加入证物栏 */
    if (dollStage === 2) {
      dollStage = 3;

      dollRedCircle.classList.add("visible");

      const hiddenBtn = document.querySelector('.evidence-btn[data-evidence="dollHidden"]');
      if (hiddenBtn) {
        hiddenBtn.classList.add("visible");
      }

      const noteBlock = document.getElementById("artifactNote");
      if (noteBlock) {
        noteBlock.innerHTML = `
          <p><strong>已锁定：</strong>红圈处就是娃娃腹部的异常位置。</p>
          <p><strong>结果：</strong>新证物“娃娃腹部镜头”已加入右侧证物栏，可单独重新查看。</p>
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

/* =========================
   7. 打开证据弹窗
========================== */
function openEvidence(key) {
  const data = evidenceData[key];
  if (!data) return;

  const isFirstTime = !discovered.has(key);
  discovered.add(key);

  modalMark.textContent = data.icon;
  modalTitle.textContent = data.title;
  modalSubtitle.textContent = data.subtitle;

  /* 照片证据走特殊组件，其他证据显示普通图片 */
  if (key === "photo") {
    renderPhotoStack(data);
  } else if (key === "doll") {
    renderDollInteraction(data);
  } else {
    artifactView.innerHTML = `
      <img class="artifact-image" src="${data.image}" alt="${data.title}">
    `;
  }

  artifactNote.innerHTML = data.note;

  evidenceModal.classList.add("active");
  roomImage.classList.add("blurred");
  storyText.innerHTML = data.story;

  const hotspot = document.querySelector(`.hotspot[data-evidence="${key}"]`);
  if (hotspot) {
    hotspot.classList.add("discovered");
  }

  const evidenceBtn = document.querySelector(`.evidence-btn[data-evidence="${key}"]`);
  if (evidenceBtn) {
    evidenceBtn.classList.add("visible");
  }

  progressCount.textContent = `${discovered.size} / 6`;

  if (isFirstTime && discovered.size === 6) {
    storyText.innerHTML += `
      <p><strong>你已经找到第一轮的全部物证。</strong> 这个房间显然不只是凶案现场，更像是一套围绕“观看女性”运转的装置。</p>
    `;
  }
}

/* =========================
   8. 关闭弹窗
========================== */
function closeModal() {
  evidenceModal.classList.remove("active");
  roomImage.classList.remove("blurred");

  /* 清理照片组件可能绑定的键盘事件 */
  if (evidenceModal._photoKeyHandler) {
    document.removeEventListener("keydown", evidenceModal._photoKeyHandler);
    evidenceModal._photoKeyHandler = null;
  }
}

/* =========================
   9. 绑定页面事件
========================== */

/* 首页 -> 游戏页 */
startGameBtn.addEventListener("click", () => {
  openScreen(gameScreen);
});

/* 游戏页 -> 首页 */
backIntroBtn.addEventListener("click", () => {
  openScreen(introScreen);
});

/* 场景热点 */
document.querySelectorAll(".hotspot").forEach((hotspot) => {
  hotspot.addEventListener("click", () => {
    const key = hotspot.dataset.evidence;
    openEvidence(key);
  });
});

/* 右侧证据栏 */
document.querySelectorAll(".evidence-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("visible")) {
      const key = btn.dataset.evidence;
      openEvidence(key);
    }
  });
});

/* 关闭按钮 */
closeModalBtn.addEventListener("click", closeModal);

/* 点击遮罩关闭 */
evidenceModal.addEventListener("click", (event) => {
  if (event.target === evidenceModal) {
    closeModal();
  }
});

/* Esc 关闭弹窗 */
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});