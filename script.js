/* =========================
   1. 获取页面元素
========================== */
/* =========================
手脚架
const goIntroBtn = document.getElementById("goIntroBtn");
const goBriefingBtn = document.getElementById("goBriefingBtn");
const goRoom1Btn = document.getElementById("goRoom1Btn");
const goRoom2Btn = document.getElementById("goRoom2Btn");
const goRoom3Btn = document.getElementById("goRoom3Btn");
const goSovietQuestionBtn = document.getElementById("goSovietQuestionBtn");
========================== */

const introScreen = document.getElementById("introScreen");
const briefingScreen = document.getElementById("briefingScreen");
const gameScreen = document.getElementById("gameScreen");
const gameScreen2 = document.getElementById("gameScreen2");

const startGameBtn = document.getElementById("startGameBtn");
const enterSceneBtn = document.getElementById("enterSceneBtn");

const detectiveForm = document.getElementById("detectiveForm");
const detectiveNameInput = document.getElementById("detectiveNameInput");
const briefingSpeaker = document.getElementById("briefingSpeaker");
const briefingWelcome = document.getElementById("briefingWelcome");

const registerLocationBtn = document.getElementById("registerLocationBtn");
const locationResultText = document.getElementById("locationResultText");

const archiveApiBtn = document.getElementById("archiveApiBtn");
const archiveApiResult = document.getElementById("archiveApiResult");

let detectiveName = "Detective";

const briefingScroll = document.getElementById("briefingScroll");

const roomImage = document.getElementById("roomImage");
const roomImage2 = document.getElementById("roomImage2");

const room2SceneWrapper = document.getElementById("room2SceneWrapper");
const room2FlipBtn = document.getElementById("room2FlipBtn");
const room2ProgressCount = document.getElementById("room2ProgressCount");
const blinkOverlay = document.getElementById("blinkOverlay");
const gameScreen3 = document.getElementById("gameScreen3");

const chaseScene = document.getElementById("chaseScene");
const chaseImage = document.getElementById("chaseImage");
const chaseTransitionOverlay = document.getElementById("chaseTransitionOverlay");

const chaseLeftBtn = document.getElementById("chaseLeftBtn");
const chaseForwardBtn = document.getElementById("chaseForwardBtn");
const chaseRightBtn = document.getElementById("chaseRightBtn");

const chaseDialogueBox = document.getElementById("chaseDialogueBox");
const chaseNodeTitle = document.getElementById("chaseNodeTitle");
const chaseQuestion = document.getElementById("chaseQuestion");
const chaseProgressTag = document.getElementById("chaseProgressTag");
const chaseAnswerScroll = document.getElementById("chaseAnswerScroll");
const chaseAnswerText = document.getElementById("chaseAnswerText");
const chaseProceedBtn = document.getElementById("chaseProceedBtn");

const drumGamePanel = document.getElementById("drumGamePanel");
const drumInstruction = document.getElementById("drumInstruction");
const drumRoundText = document.getElementById("drumRoundText");

const storyText = document.getElementById("storyText");
const storyText2 = document.getElementById("storyText2");

const progressCount = document.getElementById("progressCount");
const progressStatusText = document.getElementById("progressStatusText");
const evidenceIcons = document.getElementById("evidenceIcons");

const evidenceModal = document.getElementById("evidenceModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalMark = document.getElementById("modalMark");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const artifactView = document.getElementById("artifactView");
const artifactNote = document.getElementById("artifactNote");

const gameScreenInner = document.getElementById("gameScreen");

const bgm1 = document.getElementById("bgm1");
const bgm2 = document.getElementById("bgm2");
const bgm3 = document.getElementById("bgm3");

const chaseChapterIntro = document.getElementById("chaseChapterIntro");
const chaseEncounterLayer = document.getElementById("chaseEncounterLayer");
const chaseSpiritImage = document.getElementById("chaseSpiritImage");
const chaseItemCard = document.getElementById("chaseItemCard");
const chaseItemImage = document.getElementById("chaseItemImage");

let bgm1Started = false;
let bgm2Started = false;
let bgm3Started = false;

const CLICK_SOUND_SRC = "audio/click.mp3";

/* =========================
   2. 音频
========================== */
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

  if (bgm2) {
    bgm2.pause();
    bgm2.currentTime = 0;
  }

  if (bgm3) {
    bgm3.pause();
    bgm3.currentTime = 0;
  }

  bgm1.volume = 0.6;
  bgm1.currentTime = 0;
  safePlay(bgm1);

  bgm1Started = true;
  bgm2Started = false;
  bgm3Started = false;
}

function switchToBgm2() {
  if (!bgm2 || bgm2Started) return;

  if (bgm1) {
    bgm1.pause();
    bgm1.currentTime = 0;
  }

  if (bgm3) {
    bgm3.pause();
    bgm3.currentTime = 0;
  }

  bgm2.volume = 0.75;
  bgm2.currentTime = 0;
  safePlay(bgm2);

  bgm1Started = false;
  bgm2Started = true;
  bgm3Started = false;
}

function switchToBgm3() {
  if (!bgm3 || bgm3Started) return;

  if (bgm1) {
    bgm1.pause();
    bgm1.currentTime = 0;
  }

  if (bgm2) {
    bgm2.pause();
    bgm2.currentTime = 0;
  }

  bgm3.volume = 0.78;
  bgm3.currentTime = 0;
  safePlay(bgm3);

  bgm1Started = false;
  bgm2Started = false;
  bgm3Started = true;
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

  if (bgm3) {
    bgm3.pause();
    bgm3.currentTime = 0;
  }

  bgm1Started = false;
  bgm2Started = false;
  bgm3Started = false;
}

/* =========================
   External API: location + distance
========================== */

const CRIME_SCENE_LOCATION = {
  name: "Harbin, Northeast China",
  latitude: 45.8038,
  longitude: 126.5350
};

let detectiveLocationRecord = null;

function toRadians(degrees) {
  return degrees * Math.PI / 180;
}

function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(earthRadiusKm * c);
}

function getCurrentBrowserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position);
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 9000,
        maximumAge: 60000
      }
    );
  });
}

async function reverseGeocodeWithExternalApi(latitude, longitude) {
  const apiUrl =
    "https://api.bigdatacloud.net/data/reverse-geocode-client" +
    `?latitude=${encodeURIComponent(latitude)}` +
    `&longitude=${encodeURIComponent(longitude)}` +
    "&localityLanguage=en";

  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error("External reverse geocoding API request failed.");
  }

  return response.json();
}

async function registerDetectiveLocation() {
  if (!locationResultText || !registerLocationBtn) return;

  locationResultText.innerHTML = `
    <p>Requesting location permission...</p>
  `;

  registerLocationBtn.disabled = true;
  registerLocationBtn.textContent = "Registering...";

  try {
    const position = await getCurrentBrowserLocation();

    const userLatitude = position.coords.latitude;
    const userLongitude = position.coords.longitude;

    locationResultText.innerHTML = `
      <p>Location received. Contacting external archive service...</p>
    `;

    const geoData = await reverseGeocodeWithExternalApi(
      userLatitude,
      userLongitude
    );

    const city =
      geoData.city ||
      geoData.locality ||
      geoData.principalSubdivision ||
      "an unknown city";

    const country =
      geoData.countryName ||
      geoData.countryCode ||
      "an unknown country";

    const distanceKm = calculateDistanceKm(
      userLatitude,
      userLongitude,
      CRIME_SCENE_LOCATION.latitude,
      CRIME_SCENE_LOCATION.longitude
    );

    detectiveLocationRecord = {
      city,
      country,
      distanceKm,
      latitude: userLatitude,
      longitude: userLongitude
    };

    locationResultText.innerHTML = `
      <p><strong>Location registered:</strong> ${city}, ${country}.</p>
      <p><strong>Distance from ${CRIME_SCENE_LOCATION.name}:</strong> approximately ${distanceKm.toLocaleString()} km.</p>
      <p>Distance does not interrupt testimony. The scene is now ready.</p>
    `;
  } catch (error) {
    console.error(error);

    detectiveLocationRecord = null;

    locationResultText.innerHTML = `
      <p>Location record unavailable.</p>
      <p>The investigation may continue, but the distance between you and the scene remains unregistered.</p>
    `;
  } finally {
    registerLocationBtn.disabled = false;
    registerLocationBtn.textContent = "Register my location";
  }
}

/* =========================
   3. 页面切换
========================== */
function openScreen(screenToOpen) {
  introScreen.classList.remove("active");
  briefingScreen.classList.remove("active");
  gameScreen.classList.remove("active");
  gameScreen2.classList.remove("active");

  if (gameScreen3) {
    gameScreen3.classList.remove("active");
  }

  if (screenToOpen) {
    screenToOpen.classList.add("active");
  }
}

function resetBriefingProgress() {
  if (!briefingScroll || !enterSceneBtn) return;

  briefingScroll.scrollTop = 0;
  enterSceneBtn.classList.remove("visible");

  requestAnimationFrame(() => {
    const noScrollNeeded = briefingScroll.scrollHeight <= briefingScroll.clientHeight + 4;
    if (noScrollNeeded) {
      enterSceneBtn.classList.add("visible");
    }
  });
}

function checkBriefingScroll() {
  if (!briefingScroll || !enterSceneBtn) return;

  const threshold = 24;
  const reachedBottom =
    briefingScroll.scrollTop + briefingScroll.clientHeight >= briefingScroll.scrollHeight - threshold;

  if (reachedBottom) {
    enterSceneBtn.classList.add("visible");
  }
}

/* =========================
   4. 记录已发现证据
========================== */
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
let collapseTimers = [];

/* =========================
   5. 证据数据
========================== */
const evidenceData = {
  photo: {
    icon: "🖼️",
    title: "A series of photo taken under the table glass",
    subtitle:
      "The photos cover the victim from childhood to adulthood. He is from Harbin. After graduation, he worked as a white-collar worker doing homework in Shanghai and loved watching thirsty trap videos and livestreaming profitting on male gaze",
    photos: [
      "images/photo1.png",
      "images/photo2.png",
      "images/photo3.png",
      "images/photo4.png",
      "images/photo5.png",
    ],
    hiddenBackImage: "images/polaroid.png",
    story: `
      <p>The victim displays this five photos to identify and fashion his identity.</p>
      <p>When you turn to the last one, you can clearly feel that this cardboard is thicker and there seems to be something else hidden behind it.</p>
    `,
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
    subtitle:
      "Unlike the softness of the head and limbs, the filling in the abdominal cavity of the doll seems to be harder",
    image: "images/doll.png",
    story: `
      <p>You reached deep into the suture and found a miniature lens buried in the filling.</p>
    `,
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
    subtitle: "A stack of historical images lies inside the mirrored room.",
    room2ObjectStyle: true,
    instructionText: "Examine the photographs with your mouse.",
    counterLabel: "Photo",
    defaultHint: "Use the mouse wheel or buttons to switch photos.",
    photos: [
      "images/photo7.png",
      "images/photo8.png",
      "images/photo9.png",
      "images/photo10.png",   // 如果你已经把 10 的两张图上下拼成一张，就用这个
      "images/photo11.png",
      "images/photo12.png",
      "images/photo13.png"
    ],
    notes: [
      {
        title: "What is this...",
        bodyHtml: `
          <p>A roster of those who participated in the Epidemic Prevention and Water Supply Department.The Japanese military’s Remaining Personnel Register of the Kwantung Army Epidemic Prevention and Water Supply Department recorded a total of 3,497 individuals. During the fascist war, these people committed atrocities of live human experimentation against civilians in China, the Soviet Union, and Korea. There is no blood on this document, no screaming—only names, ranks, and identification numbers.</p>
          <p>That is precisely what makes it more terrifying. It proves that these atrocities were not accidental eruptions of chaos, but part of a bureaucratic machine capable of registration, deployment, demobilization, and continued silence. This was an internal personnel record preserved and used by the Japanese administrative system itself.</p>
          <p>On the one hand, when retreating, the Japanese military systematically burned and destroyed evidence of the experiments and the victims in order to deny the existence of atrocities such as those of Unit 731. On the other hand, at least until 1999, this roster continued to be preserved within the system of Japan’s Ministry of Health, Labour and Welfare, and was even used to provide pensions to former participants of Unit 731.</p>
          <p>This systematic, institutionalized terror has not ended. It still continues because it has attempted to erase and thus stain the world’s shared public memory.</p>
        `
      },
      {
        title: "What is this...",
        bodyHtml: `
          <p>Bodies, corpses, lined up in a row, stripped of all dignity, exposed to gaze, control, and record.This violence does not belong only to the well-dressed researchers of the invading army standing before the lens in their rational-looking lab coats. It also belongs to the photographer behind the lens, to the militarist system, and to the camera itself—that supposedly objective lens, and to the narrator who tries to wrap himself in the language of science, objectivity, modernity, and civilization.</p>
        `
      },
      {
        title: "Do you see that living person?",
        bodyHtml: `
          <p>Do you see his face? He is staring at you, staring at the camera, staring at the man behind the camera who tries to hide himself behind the mechanical machine that claims absolute objectivity.</p>
          <p>Is he a human being? No. He is a cultivated devil: someone who watches a living body being cut open before him, feels a restrained thrill at the potential outcome of his work, and presses the shutter while pretending to record everything with scientific professionalism and objectivity.</p>
          <p>Are they human? No. They do not even show their faces. What they present instead are professional side profiles, bodies wrapped in lab coats, evil spirits hidden beneath research uniforms, sheltered by institutions and militarist narratives.</p>
          <p>Is he human? No. He is a subject—an experimental subject, and the subject matter of the photograph.</p>
          <p>How horrifying. Under the lens, this is what he becomes. The image invites its viewers to see him this way. And yet his gaze clearly tells whoever looks through the camera that he is human. But he is pinned down by an outside force, framed by the lens. To those who are in collusion with the camera, that gaze sparks a manic joy: yes, that one can dominate at will an object with a human physique; his anger, fear, and pain are proof of one’s power.</p>
          <p>How terrible—when I look at this image, I find myself catching sight of the very same scene, through the refraction of light, alongside the vile viewer and accomplice the camera had already anticipated. And yet once I understand their collusion, I can no longer accuse them from a safe distance.</p>
        `
      },
      {
        bodyHtml: `
          <p>Front and back views: an anatomical specimen of a Soviet woman, recorded “objectively” by a Japanese military documentarian.</p>
        `
      },
      {
        title: "There is always one more way to persecute women, isn’t there?",
        bodyHtml: `
          <p>Sexual violence—though at its core it is all the same power dynamic, the same institutionalized crushing of bodies under a civilized exterior.</p>
          <p>With militarized uniformity, the Japanese army wrapped “comfort women” into formation. They enjoyed the collectivity, the identity, and the conveniences that came with it. Backed by military barbed wire, these men carved out a corner in which gendered and national violence could be infinitely tolerated.</p>
          <p>The women kneel, faces drained. Some are Chinese, some are Korean. They did not know one another before. Now they have been forced into a social formation built by another gender, by another group of strangers, centered entirely around those strangers. They are forced to adapt, forced to change, forced to endure violence.</p>
        `
      },
      {
        bodyHtml: `
          <p>Under the pressure of the smiling men looking into the camera, the photographer, and the eyes of those who originally circulated the image—what are the five of you in the middle?</p>
        `
      },
      {
        title: "Women’s Volunteer Corps.",
        bodyHtml: `
          <p>Government propagandists said they were being sent to hospitals in Manchuria to serve as nurses, to bring comfort to the brave men at the front, emphasizing “serving the nation” and “sacrifice.” In reality, 60% of Japanese “comfort women” were recruited through this kind of deception. Many of them were female students misled by so-called patriotic education.</p>
        `
      }
    ]
  },

  archiveFolder: {
    icon: "📁",
    title: "Archive folder on the desk",
    subtitle: "A thin file and two slips of writing are tucked together.",
    room2ObjectStyle: true,
    instructionText: "Examine the materials with your mouse.",
    counterLabel: "Item",
    defaultHint: "Use the mouse wheel or buttons to switch materials.",
    flipHint: "This slip seems to have writing on the back. Click Flip or drag left and right to turn it over.",
    flippedHint: "You turned the slip over.",
    photos: [
      "images/file.png",
      "images/wFront.png"
    ],
    hiddenBackImage: "images/wBack.png",
    notes: [
      {
        title: "yellowed report sheet with three tables",
        bodyHtml: `
          <p><strong>List of bacterial and infectious disease experiments:</strong></p>
          <p>1. Plague<br>
          2. Cholera<br>
          3. Typhoid / Paratyphoid<br>
          4. Anthrax<br>
          5. Dysentery<br>
          6. Experiments related to tuberculosis, syphilis, and other infectious diseases</p>

          <p><strong>Purposes of the experiments:</strong></p>
          <p>1. To spread plague through fleas<br>
          2. To contaminate water sources, food, or land<br>
          3. To disseminate pathogens through bombs, ceramic shells, spraying, and similar methods<br>
          4. To conduct field tests of bacteriological warfare in Chinese cities and villages</p>

          <p><strong>Experimental materials:</strong></p>
          <p>1. Vivisection performed on living “logs” (maruta) in order to investigate the effects of infection, frostbite, burns, poison gas, and other chemical and biological agents</p>
        `
      },
      {
        title: "two slips of hand writing",
        bodyHtml: `
          <p>One slip, written neatly and cut with clean edges, reads:</p>
          <p>“Kantō-gun Army Epidemic Prevention and Water Supply Department.”</p>
          <p>On the back, it reads:</p>
          <p>“Bacterial Weapons Research and Production Base.”</p>
          <p>The other reads:</p>
          <p>“Sunwu County Hall for Japanese Soldiers during the Occupation.”</p>
          <p>The handwriting is messy, and the paper is clearly torn from somewhere else. Small yellowish stains mark its surface.</p>
        `
      }
    ]
  },

  computer: {
    icon: "💻",
    title: "The victim's PC",
    subtitle: "The deceased's private video is saved in Cloud Drive of the computer",
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
    `,
  },

  camera: {
    icon: "📷",
    title: "The victim's camera collection",
    subtitle:
      "It seems that the deceased was a person who loved taking photos and videos. This seems to have little to do with his engineering career, but it's quite reasonable — a science and engineering guy who loves machinery, right?",
    image: "images/camera.png",
  },

  polaroid: {
    icon: "🧾",
    title: "The Polaroid camera placed on the table",
    image: "images/pc.png",
  },
};

const reportState = {
  a: {
    label: "A",
    visible: false,
    unlockedCount: 0,
    segments: [
      "From the details in the image, the victim appears to have been born in Heilongjiang. He was probably an only child, and a much-loved one. In the early 1990s, his family already owned a camera and used it to record ordinary moments of his childhood. That alone says something. His life was not luxurious, but it was carefully preserved.",
      "He later became an engineering student and, after graduation, found work at an internet company in Shanghai.",
      "In contemporary mainland China, this was almost a textbook path of middle-class mobility: leaving a second- or third-tier city, arriving in the country’s most developed capitalist metropolis, and hoping, eventually, to secure a Shanghai household registration. If he had not died, if he had married and had children, his child might have become a Shanghai resident. That child could have attended an international school, prepared for migration to the United States, and gained access to first-rate educational resources. Even the national college entrance exam would have been easier there than in many other parts of China.",
      "His hometown in the Northeast followed a different trajectory. After China’s market reforms, the region that had once functioned as a major industrial base supporting the entire nation was gradually recast as abandoned ground: emptied factories, aging neighborhoods, and landscapes left behind by development. Only in recent years has it begun to recover part of its economic vitality through the service sector, especially by tailoring local culture, snow, food, and nostalgia for tourists from the South.",
      "There are also signs that he spent a great deal of time on short-video platforms and social media. He likely killed time by binge-watching videos, a common habit among contemporary knowledge workers whose labor exhausts the mind without exhausting the body. Pressed under the desk is a screenshot from a group livestream performance. This type of livestream depends on prolonged emotional labor, synchronized collective dancing, and sometimes thirst-trap aesthetics to satisfy the male gaze and the interactive desires of male viewers. The performers’ costumes are highly modular. Each member, each group, each visual style can be replaced, exchanged, or reproduced at any time. It is not only entertainment. It is an assembly line of self-media bodies."
    ]
  },

  b: {
    label: "B",
    visible: false,
    unlockedCount: 0,
    segments: [
      "A set of professional and various cameras on the first layer of the shelf. As an engineering student, his interest in the mechanics of cameras appears, at first, to fit his profile. The metal body, the shutter, the lens, the precision of the device: all of these seem consistent with the kind of masculine technical taste he likely wanted to inhabit.",
      "And yet there is a gap between the equipment and the evidence of actual practice. Apart from a few scattered photographs, he does not seem to have produced a coherent body of work. There is no proper portfolio. His social media accounts show little sustained photographic activity, and the SD card contains far fewer images than the number of cameras would suggest.",
      "The cameras themselves were not stored in a dry, shock-resistant camera bag, as one would expect from someone who regularly used and cared for them. Instead, they were placed openly on the table, almost like objects on display.",
      "This suggests that the cameras functioned less as tools than as symbols. They were part of how he performed his identity as an engineering man: rational, technical, precise, quietly refined. He may not even have needed an audience for this performance. The act of purchasing, owning, and arranging the machines was already enough to confirm the image of himself he wanted to believe.",
      "On the second layer, perfumes and facial cream are stored."
    ]
  },

  c: {
    label: "C",
    visible: false,
    unlockedCount: 0,
    segments: [
      "A Polaroid camera is sitting on the table, as if it had been left there before anyone had time to put it back into a cabinet or store it somewhere else. But there are no Polaroid photographs displayed on the wall, tucked into the mirror, or stored in the cabinet. Nothing in the room suggests that instant photography was part of his visible photographic habit.",
      "This is strange, because the rest of the apartment is carefully arranged. His desk, shelves, and belongings all suggest a controlled and orderly domestic space. The camera, by contrast, looks casually displaced, almost too casual. Was his neatness not really his own? Was this apartment kept in order by someone else’s domestic labor? Or did someone disturb the scene after the incident, but only to look at the Polaroid?",
      "The camera itself also does not quite belong with the others. Its matte white surface and rounded lines clash with the darker, more mechanical cameras elsewhere in the room. Compared with the devices he displayed as markers of technical taste, this one feels softer, more private, and harder to explain."
    ]
  },

  d: {
    label: "D",
    visible: false,
    unlockedCount: 0,
    segments: [
      "A full-length mirror stands in the room. It looks like the kind of mirror used for checking outfits before leaving the apartment, an ordinary domestic object with no obvious connection to.",
      "It may have belonged to his girlfriend, along with the cosmetics that she had moved in with him."
    ]
  },

  e: {
    label: "E",
    visible: false,
    unlockedCount: 0,
    segments: [
      "It appears to be harmless, perhaps something kept there for comfort or companionship during sleep."
    ]
  },

  f: {
    label: "F",
    visible: false,
    unlockedCount: 0,
    segments: [
      "But there is a camera hidden inside it. It appears to have been used to record private videos without consent. At this stage, it is still unclear whether the victim kept these videos for himself or circulated them for attention, profit, or status. But the distinction does not lessen the violation. Whether private or public, the act itself is already an abuse of intimacy and trust."
    ]
  },

  g: {
    label: "G",
    visible: false,
    unlockedCount: 0,
    segments: [
      "The victim had hidden a photograph of a sleeping woman underneath the group livestream screenshot. Unlike the other five photographs, which were developed after being taken elsewhere, this one was made with a Polaroid camera. It is intimate and immediate. And because the entire process of production happens under the photographer’s eyes, it also carries a particular claim to authenticity: the image appears, slowly and irreversibly, in the same space where the act of photographing took place.",
      "But the fact that this photograph was hidden behind another image changes its meaning. The woman in the photograph likely did not know she was being photographed at the time. There is also no evidence that she was told before or after. The victim did not seek her consent. Instead, he buried the evidence of his own voyeurism beneath the appearance of a harmless photographic hobby.",
      "This makes the victim harder to read as merely innocent. He preserved childhood, hometown, work, and online entertainment through images, but he also used photography to take something from another person without permission. The camera was not only a tool of memory. In his hands, it also became a private instrument of possession and concealment."
    ]
  },

  h: {
    label: "H",
    visible: false,
    unlockedCount: 0,
    segments: [
      "A video project is still open on the victim’s computer.",
      "The file appears to be in progress, not yet exported. It contains an intimate video of the victim and his girlfriend. The angle seems to come from somewhere on or near the bed, not from a device openly held by either person.",
      "One detail is especially difficult to ignore: the man appears to glance toward the direction of the lens, while the woman never makes eye contact with it. Her gaze does not meet the camera at any point. This strongly suggests that she did not know the camera was there.",
      "The project file also contains an audio track captured through the system’s built-in real-time recording function. It recorded part of a conversation between the man and the woman.",
      "What exactly happened to him?"
    ]
  }
};

const reportOrder = ["a", "b", "c", "d", "e", "f", "g", "h"];
let latestUnlockedSegments = [];
let typewriterQueueRunning = false;
const typedSegmentsPlayed = new Set();

function unlockReport(letter, count = 1) {
  const entry = reportState[letter];
  if (!entry) return;

  const prevVisible = entry.visible;
  const prevCount = entry.unlockedCount;

  entry.visible = true;
  entry.unlockedCount = Math.min(
    entry.segments.length,
    Math.max(entry.unlockedCount, count)
  );

  if (entry.visible !== prevVisible || entry.unlockedCount !== prevCount) {
    latestUnlockedSegments = [];

    for (let i = prevCount; i < entry.unlockedCount; i += 1) {
      latestUnlockedSegments.push({
        letter,
        index: i
      });
    }

    renderReportColumn();
    refreshCurrentModalNote();
  }
}

function isLatestUnlockedSegment(letter, index) {
  return latestUnlockedSegments.some(
    (item) => item.letter === letter && item.index === index
  );
}

function getSegmentPlaybackKey(letter, index) {
  return `${letter}-${index}`;
}

function getReportHtml(letter) {
  const entry = reportState[letter];
  if (!entry || !entry.visible || entry.unlockedCount <= 0) return "";

  const segments = entry.segments.slice(0, entry.unlockedCount);
  const specialClass = ["f", "g", "h"].includes(letter) ? " report-entry-body-emphasis" : "";

  return `
    <div class="report-entry" data-report="${letter}">
      <div class="report-entry-body${specialClass}">
        ${segments.map((text) => `<p>${text}</p>`).join("")}
      </div>
    </div>
  `;
}

function renderReportColumn() {
  if (!storyText) return;

  const visibleEntries = reportOrder
    .filter((letter) => reportState[letter].visible)
    .map((letter) => getReportHtml(letter))
    .join("");

  if (!visibleEntries) {
    storyText.innerHTML = `
      <div class="report-scroll">
        <div class="report-entry">
          <div class="report-entry-body">
            <p>No analytical notes have been unlocked yet.</p>
          </div>
        </div>
      </div>
    `;
    return;
  }

  storyText.innerHTML = `
    <div class="report-scroll">
      ${visibleEntries}
    </div>
  `;
}

function getModalReportHtml(letter) {
  const entry = reportState[letter];
  if (!entry || !entry.visible || entry.unlockedCount <= 0) return "";

  const specialClass = ["f", "g", "h"].includes(letter) ? " report-entry-body-emphasis" : "";

  return `
    <div class="report-entry">
      <div class="report-entry-body${specialClass}">
        ${entry.segments
          .slice(0, entry.unlockedCount)
          .map((text, index) => {
            const segmentKey = getSegmentPlaybackKey(letter, index);
            const isNew = isLatestUnlockedSegment(letter, index);
            const alreadyPlayed = typedSegmentsPlayed.has(segmentKey);

            let extraClass = "";
            if (alreadyPlayed) {
              extraClass = "is-done";
            } else if (isNew) {
              extraClass = "typewriter-line";
            }

            return `
              <p
                class="${extraClass}"
                data-segment-letter="${letter}"
                data-segment-index="${index}"
                data-segment-key="${segmentKey}"
              >${text}</p>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function buildStackNoteHtml(data) {
  if (!data || !Array.isArray(data.notes) || data.notes.length === 0) return "";

  const safeIndex = Math.max(0, Math.min(photoStackIndex, data.notes.length - 1));
  const note = data.notes[safeIndex];
  if (!note) return "";

  return `
    <div class="report-entry">
      ${note.title ? `<div class="report-entry-label">${note.title}</div>` : ""}
      <div class="report-entry-body">
        ${note.bodyHtml || `<p>${note.body || ""}</p>`}
      </div>
    </div>
  `;
}

function buildArtifactNoteHtml(key) {
  if (!key) return "";

  const data = evidenceData[key];

  if (data && Array.isArray(data.notes) && data.notes.length > 0) {
    return buildStackNoteHtml(data);
  }

  if (key === "photo") {
    const aHtml = getModalReportHtml("a");
    const gHtml = reportState.g.visible ? getModalReportHtml("g") : "";
    return `${aHtml}${gHtml}`;
  }

  if (key === "doll") {
    const eHtml = getModalReportHtml("e");
    const fHtml = reportState.f.visible ? getModalReportHtml("f") : "";
    return `${eHtml}${fHtml}`;
  }

  if (key === "computer") {
    const hHtml = getModalReportHtml("h");
    return `
      ${hHtml}
      <div class="report-entry">
        <div class="report-entry-label">Transcript</div>
        <div class="report-entry-body">
          ${evidenceData.computer.note || ""}
        </div>
      </div>
    `;
  }

  if (key === "mirror" && mirrorCorrupted) {
    const dHtml = getModalReportHtml("d");
    return `
      ${dHtml}
      <div class="report-entry">
        <div class="report-entry-body">
          <p><strong>The mirror surface has changed.</strong> What you see now is no longer the mirror you saw at the beginning.</p>
        </div>
      </div>
    `;
  }

  const letter = evidenceToReportLetter[key];
  if (!letter) {
    return `<p>${evidenceData[key]?.note || ""}</p>`;
  }

  return getModalReportHtml(letter) || `<p>${evidenceData[key]?.note || ""}</p>`;
}

function refreshCurrentModalNote() {
  if (!artifactNote || !currentOpenEvidenceKey) return;
  artifactNote.innerHTML = buildArtifactNoteHtml(currentOpenEvidenceKey);
  runSequentialTypewriterInModal();
}

function scrollModalNoteToSegment(letter, index) {
  if (!artifactNote) return;

  const target = artifactNote.querySelector(
    `[data-segment-letter="${letter}"][data-segment-index="${index}"]`
  );

  if (target) {
    target.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });
  }
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function reverseChaseStep(step) {
  switch (step) {
    case "left":
      return "right";
    case "right":
      return "left";
    case "zoom":
    case "zoomIn":
      return "zoomOut";
    case "zoomOut":
    case "out":
      return "zoom";
    case "dark":
      return "dark";
    default:
      return step;
  }
}

function reverseChaseSequence(sequence = []) {
  return [...sequence].reverse().map(reverseChaseStep);
}

function getTurnBackDirection(sequence = []) {
  const reversed = reverseChaseSequence(sequence);

  const horizontal = reversed.find(
    (step) => step === "left" || step === "right"
  );
  if (horizontal) return horizontal;

  const zoomLike = reversed.find(
    (step) => step === "zoomOut" || step === "zoom" || step === "out"
  );
  if (zoomLike) return "forward";

  return "forward";
}

function getResolvedChaseChoices(nodeOrId) {
  const node =
    typeof nodeOrId === "string" ? chaseNodes[nodeOrId] : nodeOrId;

  const resolved = {};
  if (!node || !node.choices) return resolved;

  Object.entries(node.choices).forEach(([originalDirection, choice]) => {
    if (!choice) return;

    // turn back：回到最近一次 encounter，而不是上一个节点
    if (choice.turnBack && chaseState.lastEncounterNodeId) {
      const reversedSequence = reverseChaseSequence(
        chaseState.pathFromLastEncounter || []
      );

      const renderDirection =
        choice.renderDirection ||
        getTurnBackDirection(chaseState.pathFromLastEncounter || []);

      resolved[renderDirection] = {
        ...choice,
        transition: reversedSequence,
        next: chaseState.lastEncounterNodeId,
        _resolvedDirection: renderDirection
      };

      return;
    }

    resolved[originalDirection] = {
      ...choice,
      _resolvedDirection: originalDirection
    };
  });

  return resolved;
}

async function runSequentialTypewriterInModal() {
  if (!artifactNote || latestUnlockedSegments.length === 0) return;

  typewriterQueueRunning = true;

  const segmentsToPlay = [...latestUnlockedSegments];
  latestUnlockedSegments = [];

  for (const segment of segmentsToPlay) {
    const segmentKey = getSegmentPlaybackKey(segment.letter, segment.index);

    if (typedSegmentsPlayed.has(segmentKey)) {
      continue;
    }

    const node = artifactNote.querySelector(
      `[data-segment-letter="${segment.letter}"][data-segment-index="${segment.index}"]`
    );

    if (!node) continue;

    scrollModalNoteToSegment(segment.letter, segment.index);

    node.classList.remove("is-done");
    node.classList.add("is-typing");

    await wait(650);

    node.classList.remove("is-typing");
    node.classList.add("is-done");

    typedSegmentsPlayed.add(segmentKey);

    await wait(80);
  }

  typewriterQueueRunning = false;

  if (latestUnlockedSegments.length > 0) {
    runSequentialTypewriterInModal();
  }
}

function scrollModalNoteToLatest() {
  if (!artifactNote || latestUnlockedSegments.length === 0) return;

  const firstNew = latestUnlockedSegments[0];

  requestAnimationFrame(() => {
    const newest = artifactNote.querySelector(
      `[data-segment-letter="${firstNew.letter}"][data-segment-index="${firstNew.index}"]`
    );

    if (newest) {
      newest.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  });
}

const evidenceToReportLetter = {
  photo: "a",
  camera: "b",
  polaroid: "c",
  mirror: "d",
  doll: "e",
  dollHidden: "f",
  photoReveal: "g",
  computer: "h"
};

/* =========================
   6. 照片堆叠组件状态
========================== */
let photoStackIndex = 0;
let photoStackFlipped = false;
let wheelLocked = false;
let wheelGestureReady = true;
let wheelReleaseTimer = null;

/* =========================
   6.5 Room 2 进度 / 眨眼 / 终局
========================== */
const ROOM2_TOTAL_REQUIRED = 10;

const room2State = {
  seen: new Set(),
  finalPending: false,
  finalTriggered: false,
  fullscreenActive: false,
  doorFlipUnlocked: false,
  doorVisible: false,
  persistentBlink: false,
  blinkTimers: [],
  dragActive: false,
  dragStartX: 0
};

function clearRoom2BlinkTimers() {
  room2State.blinkTimers.forEach((timerId) => clearTimeout(timerId));
  room2State.blinkTimers = [];
  if (blinkOverlay) {
    blinkOverlay.classList.remove("active");
  }
}

function setBlinkOverlay(active) {
  if (!blinkOverlay) return;
  blinkOverlay.classList.toggle("active", active);
}

function clearRoom2ShakeClasses() {
  if (!gameScreen2) return;

  gameScreen2.classList.remove(
    "room2-shaking",
    "room2-shake-basic",
    "room2-shake-lateral",
    "room2-shake-violent"
  );
}

function stopRoom2FullscreenShake() {
  clearRoom2ShakeClasses();
}

function activateRoom2Fullscreen() {
  if (room2State.fullscreenActive) return;
  room2State.fullscreenActive = true;

  gameScreen2.classList.add("room2-fullscreen");

  clearRoom2ShakeClasses();
  gameScreen2.classList.add("room2-shake-basic");

  // 5s 后：在原摇晃基础上进入左右幅度逐渐增大的阶段
  room2State.blinkTimers.push(
    setTimeout(() => {
      gameScreen2.classList.remove("room2-shake-basic");
      gameScreen2.classList.add("room2-shake-lateral");
    }, 5000)
  );

  // 再过 10s，也就是全屏摇晃 15s 后：大幅度高频摇晃
  room2State.blinkTimers.push(
    setTimeout(() => {
      gameScreen2.classList.remove("room2-shake-lateral");
      gameScreen2.classList.add("room2-shake-violent");
    }, 15000)
  );
}

function runRoom2Blink(count = 1, onComplete = null) {
  let totalDelay = 0;

  for (let i = 0; i < count; i += 1) {
    room2State.blinkTimers.push(
      setTimeout(() => {
        if (room2State.finalTriggered && !room2State.fullscreenActive) {
          activateRoom2Fullscreen();
        }

        setBlinkOverlay(true);

        room2State.blinkTimers.push(
          setTimeout(() => {
            setBlinkOverlay(false);
          }, 140)
        );
      }, totalDelay)
    );

    totalDelay += 280;
  }

  if (onComplete) {
    room2State.blinkTimers.push(
      setTimeout(() => {
        onComplete();
      }, totalDelay)
    );
  }
}

function scheduleRoom2BlinkPatternAfterFirstBlink() {
  if (!room2State.persistentBlink) return;

  // 当前这次眨眼算作第一次眨眼
  // 3s 后：眨一次
  room2State.blinkTimers.push(
    setTimeout(() => {
      if (!room2State.persistentBlink) return;
      runRoom2Blink(1);
    }, 3000)
  );

  // 再隔 5s，也就是 8s 后：眨一次
  room2State.blinkTimers.push(
    setTimeout(() => {
      if (!room2State.persistentBlink) return;
      runRoom2Blink(1);
    }, 8000)
  );

  // 再隔 4s，也就是 12s 后：连续眨两次，然后重新循环
  room2State.blinkTimers.push(
    setTimeout(() => {
      if (!room2State.persistentBlink) return;

      runRoom2Blink(2, () => {
        scheduleRoom2BlinkPatternAfterFirstBlink();
      });
    }, 12000)
  );
}

function startRoom2PersistentBlinkFromNow() {
  clearRoom2BlinkTimers();
  room2State.persistentBlink = true;
  room2State.doorFlipUnlocked = false;
  room2State.doorVisible = false;

  if (room2FlipBtn) {
    room2FlipBtn.hidden = true;
  }

  // 第一次眨眼：进入全屏 + 开始 20s 摇晃
  runRoom2Blink(1);
  scheduleRoom2BlinkPatternAfterFirstBlink();

  // 20s 后：先眨眼，然后自动 flip 到 door.png
  room2State.blinkTimers.push(
    setTimeout(() => {
      room2State.doorFlipUnlocked = true;
      flipRoom2MainImageAfterBlink({ auto: true });
    }, 20000)
  );
}

function restartRoom2BlinkFromImmediateBlink() {
  clearRoom2BlinkTimers();
  room2State.persistentBlink = true;

  runRoom2Blink(1);
  scheduleRoom2BlinkPatternAfterFirstBlink();
}

function renderRoom2Status() {
  if (!storyText2 || !room2ProgressCount) return;

  room2ProgressCount.textContent = `${room2State.seen.size} / ${ROOM2_TOTAL_REQUIRED}`;

  if (!room2State.finalTriggered) {
    if (room2State.finalPending) {
      storyText2.innerHTML = `
        <p>You have found enough documents.</p>
        <p>Close the file and return to the room.</p>
      `;
    } else {
      storyText2.innerHTML = `
        <p>Look for documents and reports that might objectively tell you where you are.</p>
      `;
    }
    return;
  }

  if (!room2State.doorFlipUnlocked) {
    storyText2.innerHTML = `
      <p>The room has started trembling again.</p>
      <p>Something here is reacting to what you have uncovered.</p>
    `;
    return;
  }

  if (room2State.doorVisible) {
    storyText2.innerHTML = `
      <p>A door has appeared.</p>
      <p>Click it to continue. You may also flip the scene back.</p>
    `;
    return;
  }

  storyText2.innerHTML = `
    <p>The room keeps blinking in and out.</p>
    <p>Drag the scene or press Flip to turn it over.</p>
  `;
}

function markRoom2DocumentSeen(docId) {
  if (!docId || room2State.seen.has(docId)) return;

  room2State.seen.add(docId);
  renderRoom2Status();

  if (
    room2State.seen.size >= ROOM2_TOTAL_REQUIRED &&
    !room2State.finalTriggered
  ) {
    room2State.finalPending = true;
  }
}

function maybeTrackCurrentRoom2Document() {
  if (currentOpenEvidenceKey === "photoMirror") {
    const photoIds = [
      "photo7",
      "photo8",
      "photo9",
      "photo10",
      "photo11",
      "photo12",
      "photo13"
    ];

    const docId = photoIds[photoStackIndex];
    markRoom2DocumentSeen(docId);
    return;
  }

  if (currentOpenEvidenceKey === "archiveFolder") {
    if (photoStackIndex === 0) {
      markRoom2DocumentSeen("archive-file");
      return;
    }

    if (photoStackIndex === 1 && !photoStackFlipped) {
      markRoom2DocumentSeen("archive-slip-front");
      return;
    }

    if (photoStackIndex === 1 && photoStackFlipped) {
      markRoom2DocumentSeen("archive-slip-back");
    }
  }
}

function stopRoom2AcceleratedSequenceVisuals() {
  roomImage2.classList.remove(
    "image-blackout-stage-1",
    "image-shake-stage-2",
    "image-blackout-stage-2",
    "image-blackout-stage-5"
  );

  document.body.classList.remove(
    "borders-flicker-stage-3",
    "text-chaos-stage-4",
    "global-flicker-stage-4",
    "global-flicker-stage-5"
  );
}

function startRoom2FinalSequence() {
  switchToBgm3();

  room2State.finalTriggered = true;
  renderRoom2Status();

  if (evidenceModal.classList.contains("active")) {
    closeModal();
  }

  clearRoom2BlinkTimers();
  stopRoom2AcceleratedSequenceVisuals();

  roomImage2.classList.add("image-blackout-stage-1");

  room2State.blinkTimers.push(
    setTimeout(() => {
      roomImage2.classList.remove("image-blackout-stage-1");
      roomImage2.classList.add("image-shake-stage-2");
      roomImage2.classList.add("image-blackout-stage-2");
    }, 2000)
  );

  room2State.blinkTimers.push(
    setTimeout(() => {
      document.body.classList.add("borders-flicker-stage-3");
    }, 4000)
  );

  room2State.blinkTimers.push(
    setTimeout(() => {
      document.body.classList.add("text-chaos-stage-4");
      document.body.classList.add("global-flicker-stage-4");
    }, 6000)
  );

  room2State.blinkTimers.push(
    setTimeout(() => {
      roomImage2.classList.remove("image-blackout-stage-2");
      roomImage2.classList.add("image-blackout-stage-5");
      document.body.classList.remove("global-flicker-stage-4");
      document.body.classList.add("global-flicker-stage-5");
    }, 8000)
  );

  room2State.blinkTimers.push(
    setTimeout(() => {
      stopRoom2AcceleratedSequenceVisuals();
      startRoom2PersistentBlinkFromNow();
    }, 10000)
  );
}

function flipRoom2MainImageAfterBlink(options = {}) {
  const { auto = false } = options;

  if (!auto && !room2State.doorFlipUnlocked) return;

  clearRoom2BlinkTimers();
  room2State.persistentBlink = true;

  runRoom2Blink(1, () => {
    // 自动第一次翻到门的时候，20s 摇晃结束
    if (auto) {
      stopRoom2FullscreenShake();
    }

    room2State.doorVisible = !room2State.doorVisible;

    roomImage2.src = room2State.doorVisible
      ? "images/door.png"
      : "images/room2.png";

    if (room2FlipBtn) {
      room2FlipBtn.hidden = false;
      room2FlipBtn.textContent = room2State.doorVisible ? "Flip Back" : "Flip";
    }

    gameScreen2.classList.toggle("room2-door-visible", room2State.doorVisible);

    renderRoom2Status();

    // 这次翻转时的眨眼视作新一轮第一次眨眼
    scheduleRoom2BlinkPatternAfterFirstBlink();
  });
}

function toggleRoom2MainImage() {
  flipRoom2MainImageAfterBlink({ auto: false });
}

function goToNextRoomFromDoor() {
  if (!room2State.doorVisible) return;
  if (room2State.enteringDoor) return;

  room2State.enteringDoor = true;

  if (!gameScreen3) {
    alert("Next room not added yet. Create an element with id='gameScreen3'.");
    return;
  }

  // 关键：进入 Chapter 3 前，停止 Room2 的所有眨眼和摇晃
  clearRoom2BlinkTimers();
  stopRoom2FullscreenShake();
  setBlinkOverlay(false);

  room2State.persistentBlink = false;
  room2State.dragActive = false;
  room2State.dragMoved = false;

  if (room2SceneWrapper) {
    room2SceneWrapper.classList.add("room2-door-enter-zoom");
  }

  setTimeout(() => {
    if (room2SceneWrapper) {
      room2SceneWrapper.classList.remove("room2-door-enter-zoom");
    }

    clearRoom2BlinkTimers();
    stopRoom2FullscreenShake();
    setBlinkOverlay(false);

    openScreen(gameScreen3);
    startChaseLevel();

    room2State.enteringDoor = false;
  }, 850);
}
/* =========================
   7. 照片堆叠组件
========================== */
function renderPhotoStack(photoData) {
  artifactView.innerHTML = `
    <div class="photo-stack-shell ${photoData.vintageStyle ? "photo-stack-shell-vintage" : ""} ${photoData.room2ObjectStyle ? "room2-object-stack" : ""}">
      <p class="photo-stack-instruction">
        ${photoData.instructionText || "Examine the photos with your mouse."}
      </p>

      <div class="photo-stack-stage ${photoData.vintageStyle ? "photo-stage-vintage" : ""} ${photoData.room2ObjectStyle ? "room2-object-stage" : ""}" id="photoStackStage"></div>

      <div class="photo-stack-footer">
        <button type="button" id="photoPrevBtn">← Previous</button>
        <div class="photo-stack-counter" id="photoStackCounter">
          ${(photoData.counterLabel || "Photo")} 1 / ${photoData.photos.length}
        </div>
        <button type="button" id="photoNextBtn">Next →</button>
      </div>

      <div class="photo-stack-footer" style="margin-top: 8px;">
        <div class="photo-stack-hint" id="photoStackHint">
          ${photoData.defaultHint || "Use the mouse wheel or buttons to switch photos."}
        </div>
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
  wheelGestureReady = true;

  stage.innerHTML = photoData.photos
    .map((src, index) => {
      const isLast = index === photoData.photos.length - 1;

      return `
        <div class="photo-card" data-index="${index}">
          <div class="photo-card-face photo-card-front">
            <img src="${src}" alt="Photo ${index + 1}">
          </div>

          ${
            isLast && photoData.hiddenBackImage
              ? `
                <div class="photo-card-face photo-card-back">
                  <div class="photo-back-inner">
                    <img src="${photoData.hiddenBackImage}" alt="Back of the final photo">
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

    counter.textContent = `${photoData.counterLabel || "Photo"} ${photoStackIndex + 1} / ${photoData.photos.length}`;

    if (
      photoData.hiddenBackImage &&
      photoStackIndex === photoData.photos.length - 1 &&
      !photoStackFlipped
    ) {
      flipBtn.style.display = "inline-flex";
      hint.textContent =
        photoData.flipHint ||
        "This photo feels thicker. Click Flip or drag left and right to turn it over.";
      hint.classList.add("important");
    } else if (photoStackFlipped) {
      flipBtn.style.display = "none";
      hint.textContent = photoData.flippedHint || "You turned the photo over.";
      hint.classList.add("important");
    } else {
      flipBtn.style.display = "none";
      hint.textContent =
        photoData.defaultHint || "Use the mouse wheel or buttons to switch photos.";
      hint.classList.remove("important");
    }

    prevBtn.disabled = photoStackIndex === 0 || photoStackFlipped;
    nextBtn.disabled = photoStackIndex === photoData.photos.length - 1 || photoStackFlipped;

    if (currentOpenEvidenceKey === "photo") {
      unlockReport("a", photoStackIndex + 1);
    }

    refreshCurrentModalNote();

    if (typeof maybeTrackCurrentRoom2Document === "function") {
      maybeTrackCurrentRoom2Document();
    }
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

    if (currentOpenEvidenceKey === "photo") {
      queueEvidenceReward("photoReveal");
      queueInvestigationReward("photoReveal");
      unlockReport("g", reportState.g.segments.length);
    }

    lastCard.style.transform = "";
    lastCard.classList.add("flipped");

    hint.textContent = photoData.flippedHint || "You turned the photo over.";
    hint.classList.add("important");

    prevBtn.disabled = true;
    nextBtn.disabled = true;
    flipBtn.style.display = "none";

    refreshCurrentModalNote();

    if (typeof maybeTrackCurrentRoom2Document === "function") {
      maybeTrackCurrentRoom2Document();
    }
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
    }

    if (event.key === "ArrowRight") {
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

        if (currentOpenEvidenceKey === "photo") {
          queueEvidenceReward("photoReveal");
          queueInvestigationReward("photoReveal");
          unlockReport("g", reportState.g.segments.length);
        }

        lastCard.style.transform = "";
        lastCard.classList.add("flipped");

        hint.textContent = photoData.flippedHint || "You turned the photo over.";
        hint.classList.add("important");

        prevBtn.disabled = true;
        nextBtn.disabled = true;
        flipBtn.style.display = "none";

        refreshCurrentModalNote();

        if (typeof maybeTrackCurrentRoom2Document === "function") {
          maybeTrackCurrentRoom2Document();
        }
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
   8. 娃娃交互
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
          aria-label="Inspect the doll's abdomen"
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

      return;
    }

    if (dollStage === 2) {
      dollStage = 3;
      dollRedCircle.classList.add("visible");

      queueEvidenceReward("dollHidden");
      queueInvestigationReward("dollHidden");
      unlockReport("f", reportState.f.segments.length);

      refreshCurrentModalNote();
      maybeTrackCurrentRoom2Document();
    }
  });
}

/* =========================
   9. 证据与进度
========================== */
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
   10. 打开证据弹窗
========================== */
function openEvidence(key) {
  const data = evidenceData[key];
  if (!data) return;

  if (key === "camera") unlockReport("b", reportState.b.segments.length);
  if (key === "polaroid") unlockReport("c", reportState.c.segments.length);
  if (key === "mirror") unlockReport("d", reportState.d.segments.length);
  if (key === "doll") unlockReport("e", reportState.e.segments.length);
  if (key === "dollHidden") unlockReport("f", reportState.f.segments.length);
  if (key === "photoReveal") unlockReport("g", reportState.g.segments.length);
  if (key === "computer") unlockReport("h", reportState.h.segments.length);

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

  if (data.photos) {
    renderPhotoStack(data);
  } else if (key === "doll") {
    renderDollInteraction(data);
  } else if (key === "mirror") {
    const mirrorSrc = mirrorCorrupted ? "images/mirror2.png" : "images/mirror1.png";
    const mirrorSubtitle = mirrorCorrupted
      ? "The trembling has ceased. Beyond the mirror, you can make out a room arranged much like this one. It no longer reflects what it sees — or does it?"
      : (data.subtitle || "");

    modalSubtitle.textContent = mirrorSubtitle;

    artifactView.innerHTML = `
      <img
        id="mirrorEvidenceImage"
        class="artifact-image ${mirrorCorrupted ? "mirror-final-form" : ""}"
        src="${mirrorSrc}"
        alt="${data.title}"
      >
    `;

    if (mirrorCorrupted) {
      const mirrorEvidenceImage = document.getElementById("mirrorEvidenceImage");
      if (mirrorEvidenceImage) {
        mirrorEvidenceImage.addEventListener("click", handleMirrorFinalClick, { once: true });
      }
    }
  } else {
    artifactView.innerHTML = `
      <img class="artifact-image" src="${data.image}" alt="${data.title}">
    `;
  }

  refreshCurrentModalNote();

  evidenceModal.classList.add("active");
  roomImage.classList.add("blurred");
}

/* =========================
   11. 关闭弹窗
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

  const shouldStartRoom2Final =
    gameScreen2 &&
    gameScreen2.classList.contains("active") &&
    room2State &&
    room2State.finalPending &&
    !room2State.finalTriggered;

  currentOpenEvidenceKey = null;
  isClosingForCollapse = false;

  if (shouldStartRoom2Final) {
    room2State.finalPending = false;
    startRoom2FinalSequence();
  }
}

/* =========================
   12. 崩坏动画
========================== */
function startCollapseSequence() {
  switchToBgm2();

  isClosingForCollapse = true;
  closeModal();

  if (progressStatusText) {
    progressStatusText.innerHTML = `
      <p>The room suddenly began to tremble unstably.</p>
      <p>It's as if something has finally been seen and has finally decided to look at you in the opposite direction.</p>
    `;
  }

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

function stopCollapseSequence() {
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
   13. 镜子 finale
========================== */
function showMirrorFinale() {
  const data = evidenceData.mirror;
  if (!data) return;

  mirrorCorrupted = true;

  modalMark.textContent = data.icon;
  modalTitle.textContent = "The mirror has changed";
  modalSubtitle.textContent = "The trembling has ceased. Beyond the mirror, you can make out a room arranged much like this one. It no longer reflects what it sees — or does it?";

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

  artifactNote.innerHTML = "";
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
  renderRoom2Status();
}

/* =========================
   14. 事件绑定
========================== */
renderReportColumn();

if (briefingScroll) {
  briefingScroll.addEventListener("scroll", checkBriefingScroll);
}

if (registerLocationBtn) {
  registerLocationBtn.addEventListener("click", registerDetectiveLocation);
}

function beginBriefingWithDetectiveName() {
  const typedName = detectiveNameInput
    ? detectiveNameInput.value.trim()
    : "";

  detectiveName = typedName || "Detective";

  if (briefingSpeaker) {
    briefingSpeaker.textContent = `Detective ${detectiveName}`;
  }

  if (briefingWelcome) {
    briefingWelcome.textContent = `Welcome, Detective ${detectiveName}.`;
  }

  if (locationResultText) {
    locationResultText.innerHTML = `
      Location record pending.
    `;
  }

  openScreen(briefingScreen);
  resetBriefingProgress();
}

if (startGameBtn) {
  startGameBtn.addEventListener("click", beginBriefingWithDetectiveName);
}

if (detectiveForm) {
  detectiveForm.addEventListener("submit", (event) => {
    event.preventDefault();
    beginBriefingWithDetectiveName();
  });
}

if (enterSceneBtn) {
  enterSceneBtn.addEventListener("click", () => {
    openScreen(gameScreen);
    startBgm1();
  });
}

document.querySelectorAll(".hotspot").forEach((hotspot) => {
  hotspot.addEventListener("click", () => {
    const key = hotspot.dataset.evidence;
    openEvidence(key);
  });
});

closeModalBtn.addEventListener("click", closeModal);

evidenceModal.addEventListener("click", (event) => {
  if (event.target === evidenceModal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && evidenceModal.classList.contains("active")) {
    closeModal();
  }
});

/* =========================
   15. scaffold 调试按钮

function scaffoldJumpTo(screenToOpen) {
  // 关闭当前弹窗，不走正常 closeModal 的奖励/进度逻辑
  if (evidenceModal) {
    evidenceModal.classList.remove("active");
  }

  if (roomImage) {
    roomImage.classList.remove("blurred");
  }

  if (roomImage2) {
    roomImage2.classList.remove("blurred");
  }

  // 清掉当前打开证据状态
  currentOpenEvidenceKey = null;
  pendingEvidenceRewards.clear();
  pendingInvestigationRewards.clear();
  isClosingForCollapse = false;

  // 如果正在崩坏动画，也停止
  stopCollapseSequence();

  // 切换页面
  openScreen(screenToOpen);
}

if (goIntroBtn) {
  goIntroBtn.addEventListener("click", () => {
    scaffoldJumpTo(introScreen);
    stopAllBgm();
  });
}

if (goBriefingBtn) {
  goBriefingBtn.addEventListener("click", () => {
    scaffoldJumpTo(briefingScreen);
    resetBriefingProgress();
  });
}

if (goRoom1Btn) {
  goRoom1Btn.addEventListener("click", () => {
    scaffoldJumpTo(gameScreen);
    startBgm1();
  });
}

if (goRoom2Btn) {
  goRoom2Btn.addEventListener("click", () => {
    scaffoldJumpTo(gameScreen2);
  });
}

if (goRoom3Btn) {
  goRoom3Btn.addEventListener("click", () => {
    scaffoldJumpTo(gameScreen3);
    startChaseLevel();
  });
}

if (goSovietQuestionBtn) {
  goSovietQuestionBtn.addEventListener("click", () => {
    scaffoldJumpTo(gameScreen3);
    switchToBgm3();

    resetChaseInteractionState();
    hideChaseEncounterLayer();
    hideChaseDialogue();

    if (drumGamePanel) {
      drumGamePanel.hidden = true;
    }

    if (chaseImage) {
      chaseImage.src = getChaseImagePath(chaseNodes.finalQuestion.image);
      chaseImage.alt = "Soviet Canteen";
    }

    chaseState.currentNodeId = "finalQuestion";
    chaseState.lastEncounterNodeId = "finalQuestion";
    chaseState.pathFromLastEncounter = [];

    // 直接进入回答界面，不播放鬼出现和 ghostLines
    renderChaseNode("finalQuestion");
  });
}
  ========================== */

if (room2FlipBtn) {
  room2FlipBtn.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    toggleRoom2MainImage();
  });
}

if (roomImage2) {
  roomImage2.addEventListener("click", (event) => {
    if (!room2State.doorVisible) return;
    if (evidenceModal.classList.contains("active")) return;

    event.preventDefault();
    event.stopPropagation();

    goToNextRoomFromDoor();
  });
}

if (room2SceneWrapper) {
  room2SceneWrapper.addEventListener("pointerdown", (event) => {
    if (!room2State.doorFlipUnlocked) return;
    if (evidenceModal.classList.contains("active")) return;

    room2State.dragActive = true;
    room2State.dragStartX = event.clientX;
    room2State.dragMoved = false;

    room2SceneWrapper.setPointerCapture(event.pointerId);
  });

  room2SceneWrapper.addEventListener("pointermove", (event) => {
    if (!room2State.dragActive) return;

    const deltaX = event.clientX - room2State.dragStartX;
    if (Math.abs(deltaX) > 12) {
      room2State.dragMoved = true;
    }
  });

  room2SceneWrapper.addEventListener("pointerup", (event) => {
    if (event.target.closest("button")) {
      room2State.dragActive = false;
      room2State.dragMoved = false;
      return;
    }

    if (!room2State.dragActive) return;

    const deltaX = event.clientX - room2State.dragStartX;
    const moved = Math.abs(deltaX) > 60;

    room2State.dragActive = false;
    room2State.dragMoved = false;

    if (moved) {
      toggleRoom2MainImage();
      return;
    }

    if (room2State.doorVisible) {
      goToNextRoomFromDoor();
    }
  });

  room2SceneWrapper.addEventListener("pointercancel", () => {
    room2State.dragActive = false;
    room2State.dragMoved = false;
  });
}

renderRoom2Status();

/* =========================
   Chapter 3: Chase Level
========================== */

const CHASE_IMAGE_DIR = "images/room/";
const CHASE_ITEM_DIR = "images/chaseItem/";

function getChaseImagePath(filename) {
  return `${CHASE_IMAGE_DIR}${filename}`;
}

function getChaseItemPath(filename) {
  return `${CHASE_ITEM_DIR}${filename}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const chaseNodes = {
  screenWall: {
    image: "影壁.png",
    title: "Swaddling Clothes",
    itemTitle: "Swaddling Clothes",
    itemImage: "swaddling cloth.png",
    spiritCloseImage: "spirit1.png",
    spiritImage: "spirit.png",
    encounter: true,
    question: "What are those people you saw in the room as subjects of the photo?",
    choices: {
      left: {
        label: "Turn left",
        answer: `
          <p>They were the Eastern Asian victims of fascist violence on a global scale.</p>
        `,
        transition: ["left", "right"],
        next: "chuihuaGate"
      },
      right: {
        label: "Turn right",
        answer: `
          <p>They are the bearers of trauma that belongs to China exclusively.</p>
        `,
        transition: ["right"],
        next: "brickDeadEnd"
      }
    }
  },

  brickDeadEnd: {
    image: "砖墙死路.png",
    title: "Brick Wall",
    encounter: false,
    hideDialogue: true,
    choices: {
      back: {
        label: "Turn back",
        answer: `...`,
        turnBack: true
      }
    }
  },

  chuihuaGate: {
    image: "垂花门.png",
    title: "Errenzhuan Props",
    itemTitle: "Errenzhuan Props",
    itemImage: "chineseDance.png",
    spiritCloseImage: "spirit1.png",
    spiritImage: "spirit.png",
    encounter: true,
    question: "How do you understand this as a medium and media?",
    choices: {
      left: {
        label: "Turn left",
        answer: `
          <p>It is national, local, and premodern. In contrast to it stand Western forms such as cinema and theater, which are treated as modern media.</p>
        `,
        transition: ["zoom", "left"],
        next: "rightTurnHallway"
      },
      right: {
        label: "Turn right",
        answer: `
          <p>The irreconcilable contradictions between capitalism and the colony pushed imperial powers toward aggression: they could only resolve their internal crises by exporting violence outward.</p>
          <p>In this process, Chinese arts and performance traditions were forced to be judged through a framework of “modernity” shaped by the Western colonial gaze. They were treated as backward, local, and premodern, even though they were developing alongside other modern media forms in the same historical period.</p>
          <p>What was called “modern” was never a neutral standard.</p>
        `,
        transition: ["zoom", "right"],
        next: "leftTurnHallway"
      }
    }
  },

  rightTurnHallway: {
    image: "直走右拐走廊.png",
    title: "Corridor",
    encounter: false,
    hideDialogue: true,
    choices: {
      forward: {
        label: "Forward",
        answer: `<p>You continue walking.</p>`,
        transition: ["zoom"],
        next: "rightTurnHallwayDark"
      }
    }
  },

  rightTurnHallwayDark: {
    image: "直走右拐的走廊 黑暗.png",
    title: "Dark Corridor",
    encounter: false,
    hideDialogue: true,
    choices: {
      back: {
        label: "Turn back",
        answer: `...`,
        turnBack: true
      }
    }
  },

  leftTurnHallway: {
    image: "直走左拐走廊.png",
    title: "Corridor",
    encounter: false,
    hideDialogue: true,
    choices: {
      forward: {
        label: "Forward",
        answer: `<p>You continue deeper into the courtyard passage.</p>`,
        transition: ["zoom"],
        next: "eastRoomSide"
      }
    }
  },

  eastRoomSide: {
    image: "东房侧面.png",
    title: "East Wing Side",
    encounter: false,
    hideDialogue: true,
    choices: {
      forward: {
        label: "Forward",
        answer: `<p>You step toward the East Wing.</p>`,
        transition: ["right"],
        next: "eastWing"
      }
    }
  },

  eastWing: {
    image: "东厢房.png",
    title: "Japanese Fan",
    itemTitle: "Japanese Fan",
    itemImage: "japFan.png",
    spiritCloseImage: "spirit1.png",
    spiritImage: "spirit.png",
    encounter: true,
    question: "Why am I also among them?",
    choices: {
      left: {
        label: "Turn left",
        answer: `
          <p>Because patriarchal oppression and militarist violence also reached inward, turning their claws upon the people of the empire itself. Unfortunately, your class position and your gender gave you a double guarantee of becoming one of the sacrificed.</p>
        `,
        transition: ["left"],
        next: "leftTurnHallway2"
      },
      forward: {
        label: "Forward",
        answer: `
          <p>Because you were stupid enough to want to marry a soldier. Because you wanted to become part of the militarist story.</p>
        `,
        transition: ["zoom"],
        next: "eastWingDeath"
      }
    }
  },

  eastWingDeath: {
    image: "东厢房.png",
    title: "East Wing",
    death: true,
    deathSpiritClose: "spirit1.png",
    deathSpirit: "spirit.png"
  },

  leftTurnHallway2: {
    image: "直走左拐走廊.png",
    title: "Corridor",
    encounter: false,
    hideDialogue: true,
    choices: {
      forward: {
        label: "Forward",
        answer: `<p>You keep walking.</p>`,
        transition: ["zoom"],
        next: "mainRoomSide"
      }
    }
  },

  mainRoomSide: {
    image: "正房侧面.png",
    title: "Korean Hand Drum",
    itemTitle: "Korean Hand Drum",
    itemImage: "koreanJanggu.png",
    spiritCloseImage: "spirit1.png",
    spiritImage: "spirit.png",
    encounter: true,
    question: "After my country was invaded, I was displaced and brought here. I too became one of the comfort women.",
    choices: {
      forward: {
        label: "Forward",
        answer: `
          <p>The “second sex,” natural resources, colonized peoples, young men, defeated nations—different as they are, they are often forced into the same symbolic position. They are feminized not because they are literally women, but because power assigns them the role historically imposed on women: to adapt, to yield, to be reshaped, to be conquered, to be possessed, and to be consumed as resources.</p>
        `,
        transition: ["zoom", "zoom", "left"],
        next: "westRoomSide"
      },
      left: {
        label: "Turn left",
        answer: `
          <p>Your country was weak. That’s all. Fall behind, and you deserve to be beaten.</p>
        `,
        transition: ["zoom", "left"],
        next: "darkGap"
      }
    }
  },

  darkGap: {
    image: "走廊缺口 黑暗.png",
    title: "Dark Gap",
    encounter: false,
    hideDialogue: true,
    choices: {
      back: {
        label: "Turn back",
        answer: `...`,
        turnBack: true
      }
    }
  },

  westRoomSide: {
    image: "西房侧面.png",
    title: "Chinese Embroidered Shoes",
    itemTitle: "Chinese Embroidered Shoes",
    itemImage: "bindFoot.png",
    spiritCloseImage: "spirit1.png",
    spiritImage: "spirit.png",
    encounter: true,
    question: "Then what about me?",
    choices: {
      left: {
        label: "Turn left",
        answer: `
          <p>Poor soul. You are proof of what it means to be trapped at the intersection of Chinese feudal patriarchy and colonial violence.</p>
          <p>Unit 731 called you a “log.” They did not see you as a human being, but as material to be used up. At the same time, the men of your village and clan demanded that you become a womb with ornamental value, a body made pleasing, obedient, and useful to them. Your disabled feet were turned into evidence of chastity and submission. Objectification—systemic objectification, produced by social institutions and endlessly reproduced across generations.</p>
          <p>Militarist Japan, through invasion, continuously seized people and turned them into experimental subjects. Through propaganda, it justified the exploitation of those branded as “inferior races,” and through those experiments, prepared the ground for further aggression. In the countryside, private property forced women to circulate as forms of wealth through male-dominated—or at the very least male-serving—spaces. Women were compelled to devote themselves entirely to their male masters, while ritual propriety and social ethics ensured that this remaking—at once spiritual discipline and bodily mutilation—would be internalized by women themselves as part of their own system of value. In this way, submission was passed down across generations.</p>
          <p>Violence against nation, race, gender, and class is the same in essence—<br>all of it arises from asymmetrical power and the urge to control.</p>
        `,
        transition: ["left"],
        next: "corridorGap"
      },
      right: {
        label: "Turn right",
        answer: `
          <p>Exactly. Take one person’s deformity and turn it into entertainment for everyone else’s eyes and ears.</p>
          <p>Your mothers forced you to bind your feet, taught you to seduce men and distract them from real ambition, while they themselves never studied, never worked, and never produced a single thing of value.</p>
          <p>And that is exactly why China could never recover the glory of the Han and Tang. If women had learned discipline, labor, and self-cultivation—if they had assisted their husbands, as European women do, in raising a rational and superior next generation—instead of wasting their days gossiping between mothers-in-law, sisters-in-law, and jealous wives, disturbing the men of the household, then our nation would never have fallen victim to colonization. Perhaps we might even have carried forward Zheng He’s glory across the seas.</p>
        `,
        transition: ["right"],
        next: "westWingDeath"
      }
    }
  },

  westWingDeath: {
    image: "西厢房.png",
    title: "West Wing",
    death: true,
    deathSpiritClose: "spirit1.png",
    deathSpirit: "spirit.png"
  },

  corridorGap: {
    image: "走廊缺口.png",
    title: "Courtyard Gap",
    encounter: false,
    hideDialogue: true,
    choices: {
      forward: {
        label: "Forward",
        answer: `<p>You move into the opening.</p>`,
        transition: ["zoom"],
        next: "corridorGapZoom"
      }
    }
  },

  corridorGapZoom: {
    image: "走廊缺口 zoom in.png",
    title: "Ritual",
    encounter: false,
    hideDialogue: true,
    choices: {
      forward: {
        label: "Forward",
        answer: `<p>You approach the drum.</p>`,
        transition: ["zoom"],
        next: "drum"
      }
    }
  },

  drum: {
    image: "鼓.png",
    title: "Ritual",
    encounter: false,
    hideDialogue: true,
    drumGame: true
  },

  finalQuestion: {
    image: "鼓.png",
    title: "Soviet Canteen",
    itemTitle: "Soviet Canteen",
    itemImage: "soviBottle.png",
    spiritCloseImage: "spirit1.png",
    spiritImage: "spirit.png",
    encounter: true,
    question: "Who am I?",
    ghostLines: [
      "...So noisy.",
      "...Really...",
      "Did you think I was that kind of ghost? The kind you could pacify and “successfully intervene in” just by knocking out some little ritual?",
      "Did my trauma and my demands look that simple to you?",
      "You: What do you want from me...",
      "Ghost: Answer me.\nWho am I?"
    ],
    choices: {
      left: {
        label: "Answer",
        answer: `
          <p>You... you are not one person.</p>
          <p>You are the victim, the sum of all victims.</p>
          <p>You are endless grievance, and yet you do not wound.</p>
          <p>You were the Northeasterners of that time, the people of Nanjing, the Han, the Manchus, the Koreans, the Slavs, the Semitic peoples.</p>
          <p>You are the people of Gaza, the people of Africa now—<br>
          all those who are objectified, controlled, watched, and stripped of human rights.</p>
        `,
        transition: ["left"],
        next: "mainRoom"
      },
      right: {
        label: "Answer",
        answer: `
          <p>You are a Soviet person?</p>
        `,
        wrongSovietAnswer: true,
        transition: [],
        next: "finalQuestion"
      }
    }
  },

  mainRoom: {
    image: "正房.png",
    title: "Main Room",
    encounter: false,
    hideDialogue: true,
    choices: {
      forward: {
        label: "Forward",
        answer: `<p>You walk toward the main room.</p>`,
        transition: ["zoom"],
        next: "mainRoomZoom"
      }
    }
  },

  mainRoomZoom: {
    image: "正房 zoom in.png",
    title: "Main Room",
    encounter: false,
    hideDialogue: true,
    choices: {
      forward: {
        label: "Enter",
        answer: `<p>You enter the next space.</p>`,
        transition: ["zoom", "dark"],
        next: "finalGiftSequence"
      }
    }
  },

  finalGiftSequence: {
    image: "正房 zoom in.png",
    title: "Gift",
    finalGiftSequence: true
  },

  mainRoomNext: {
    image: "YOUR_NEXT_SCENE.png", // 这里换成你真正的下一张图文件名
    title: "Next Scene",
    encounter: false,
    hideDialogue: true,
    choices: {
      back: {
        label: "Turn back",
        answer: `<p>You step back toward the main room.</p>`,
        turnBack: true
      }
    }
  },
};



const chaseState = {
  currentNodeId: "screenWall",
  selectedChoice: null,
  locked: false,
  canProceed: false,

  drumRound: 0,
  drumSequence: [],
  drumPlayerIndex: 0,
  drumLengths: [3, 5, 7],

  introPlaying: false,
  encounterPlaying: false,

  itemQuestionNodeId: null,
  itemQuestionReady: false,

  arrivalInfo: null,

  // 最近一次遇到鬼/物品提问的节点
  lastEncounterNodeId: "screenWall",

  // 从最近一次 encounter 走到当前节点的路径
  pathFromLastEncounter: []
};

function renderChaseChoices(node) {
  const resolvedChoices = getResolvedChaseChoices(node);

  const buttons = {
    left: chaseLeftBtn,
    forward: chaseForwardBtn,
    right: chaseRightBtn
  };

  const arrowMap = {
    left: "←",
    forward: "↑",
    right: "→"
  };

  Object.entries(buttons).forEach(([direction, btn]) => {
    if (!btn) return;

    const choice = resolvedChoices[direction];

    if (!choice) {
      btn.hidden = true;
      btn.classList.remove("is-preview");
      btn.onmouseenter = null;
      btn.onmouseleave = null;
      btn.onclick = null;
      return;
    }

    btn.hidden = false;
    btn.className = `chase-choice-btn chase-choice-${direction}`;
    btn.dataset.direction = direction;
    btn.innerHTML = `
      <span class="chase-choice-arrow">${arrowMap[direction]}</span>
      <span class="chase-choice-label">${choice.label}</span>
    `;

    btn.onmouseenter = () => previewChaseChoice(direction);
    btn.onmouseleave = () => clearChasePreview();
    btn.onclick = () => lockChaseChoice(direction);
  });
}

function setChasePreviewButton(direction = null) {
  [chaseLeftBtn, chaseForwardBtn, chaseRightBtn].forEach((btn) => {
    if (btn) btn.classList.remove("is-preview");
  });

  const map = {
    left: chaseLeftBtn,
    forward: chaseForwardBtn,
    right: chaseRightBtn
  };

  if (direction && map[direction]) {
    map[direction].classList.add("is-preview");
  }
}

function hideChaseDialogue() {
  if (chaseDialogueBox) {
    chaseDialogueBox.hidden = true;
    chaseDialogueBox.classList.remove("is-previewing", "is-locked");
  }
}

function showChaseDialogue() {
  if (chaseDialogueBox) {
    chaseDialogueBox.hidden = false;
  }
}

function previewChaseChoice(direction) {
  if (chaseState.selectedChoice) return;
  if (chaseState.encounterPlaying) return;

  const node = chaseNodes[chaseState.currentNodeId];
  const resolvedChoices = getResolvedChaseChoices(node);
  const choice = resolvedChoices[direction];
  if (!choice) return;

  setChasePreviewButton(direction);

  if (!node.hideDialogue) {
    showChaseDialogue();
  }

  if (chaseDialogueBox) {
    chaseDialogueBox.classList.add("is-previewing");
    chaseDialogueBox.classList.remove("is-locked");
  }

  if (chaseNodeTitle) {
    chaseNodeTitle.textContent = "";
  }

  if (chaseQuestion) {
    chaseQuestion.innerHTML = "";
  }

  if (chaseProgressTag) {
    chaseProgressTag.textContent = "";
  }

  if (chaseAnswerText) {
    chaseAnswerText.innerHTML = choice.answer || "";
    chaseAnswerText.classList.add("answer-preview");
    chaseAnswerText.classList.remove("answer-locked");
  }

  if (chaseAnswerScroll) {
    chaseAnswerScroll.scrollTop = 0;
  }

  if (chaseProceedBtn) {
    chaseProceedBtn.hidden = true;
  }

  chaseState.canProceed = false;
}

function clearChasePreview() {
  if (chaseState.selectedChoice) return;
  if (chaseState.encounterPlaying) return;

  const node = chaseNodes[chaseState.currentNodeId];
  if (!node) return;

  setChasePreviewButton(null);

  if (node.hideDialogue) {
    hideChaseDialogue();
  } else {
    showChaseDialogue();

    if (chaseNodeTitle) {
      chaseNodeTitle.textContent = node.title || "";
    }

    if (chaseQuestion) {
      chaseQuestion.innerHTML = `
        <p>${node.question || ""}</p>
        <p class="chase-hint-line">Hover over a direction to preview your answer.</p>
      `;
    }

    if (chaseProgressTag) {
      chaseProgressTag.textContent = "Chapter Three";
    }
  }

  if (chaseDialogueBox) {
    chaseDialogueBox.classList.remove("is-previewing", "is-locked");
  }

  if (chaseAnswerText) {
    chaseAnswerText.innerHTML = "";
    chaseAnswerText.classList.remove("answer-preview", "answer-locked");
  }

  if (chaseAnswerScroll) {
    chaseAnswerScroll.scrollTop = 0;
  }

  if (chaseProceedBtn) {
    chaseProceedBtn.hidden = true;
  }

  chaseState.canProceed = false;
}

function lockChaseChoice(direction) {
  const node = chaseNodes[chaseState.currentNodeId];
  const resolvedChoices = getResolvedChaseChoices(node);
  const choice = resolvedChoices[direction];
  if (!choice) return;

  chaseState.selectedChoice = choice;
  chaseState.locked = true;
  chaseState.canProceed = false;

  setChasePreviewButton(direction);
  showChaseDialogue();

  if (chaseDialogueBox) {
    chaseDialogueBox.classList.remove("is-previewing");
    chaseDialogueBox.classList.add("is-locked");
  }

  if (chaseNodeTitle) {
    chaseNodeTitle.textContent = "";
  }

  if (chaseQuestion) {
    chaseQuestion.innerHTML = "";
  }

  if (chaseProgressTag) {
    chaseProgressTag.textContent = "";
  }

  if (chaseAnswerText) {
    chaseAnswerText.innerHTML = choice.answer || "";
    chaseAnswerText.classList.remove("answer-preview");
    chaseAnswerText.classList.add("answer-locked");
  }

  if (chaseAnswerScroll) {
    chaseAnswerScroll.scrollTop = 0;
  }

  if (chaseProceedBtn) {
    chaseProceedBtn.hidden = true;
  }

  checkChaseScrollForProceed();
}

function checkChaseScrollForProceed() {
  if (!chaseAnswerScroll || !chaseProceedBtn) return;

  if (!chaseState.selectedChoice) {
    chaseState.canProceed = false;
    chaseProceedBtn.hidden = true;
    return;
  }

  requestAnimationFrame(() => {
    const canShow =
      chaseAnswerScroll.scrollTop + chaseAnswerScroll.clientHeight >=
      chaseAnswerScroll.scrollHeight - 12;

    const noScrollNeeded =
      chaseAnswerScroll.scrollHeight <= chaseAnswerScroll.clientHeight + 12;

    if (canShow || noScrollNeeded) {
      chaseState.canProceed = true;
      chaseProceedBtn.hidden = false;
    } else {
      chaseState.canProceed = false;
      chaseProceedBtn.hidden = true;
    }
  });
}

async function playSovietWrongAnswerSequence() {
  chaseState.encounterPlaying = true;
  chaseState.selectedChoice = null;
  chaseState.locked = false;
  chaseState.canProceed = false;

  setChaseChoicesDisabled(true);
  hideChaseDialogue();
  setChasePreviewButton(null);

  if (chaseProceedBtn) {
    chaseProceedBtn.hidden = true;
  }

  if (!chaseEncounterLayer) {
    finalizeChaseNodeReveal("finalQuestion");
    setChaseChoicesDisabled(false);
    chaseState.encounterPlaying = false;
    return;
  }

  chaseEncounterLayer.hidden = false;
  chaseEncounterLayer.onclick = null;
  chaseEncounterLayer.onpointerup = null;
  chaseEncounterLayer.className = "chase-encounter-layer ghost-speech-layer";
  chaseEncounterLayer.innerHTML = `<div class="ghost-speech-text"></div>`;

  const textNode = chaseEncounterLayer.querySelector(".ghost-speech-text");
  const lines = ["...", "Seriously?", "..."];

  for (const line of lines) {
    if (!textNode) break;

    textNode.textContent = line;

    chaseEncounterLayer.classList.remove("ghost-line-zoom");
    void chaseEncounterLayer.offsetWidth;
    chaseEncounterLayer.classList.add("ghost-line-zoom");

    await sleep(760);
  }

  await sleep(220);

  hideChaseEncounterLayer();

  // 关键：直接回到问答页面，不 presentChaseNode，不 renderChaseNode，不播放 ghostLines
  chaseState.currentNodeId = "finalQuestion";
  chaseState.lastEncounterNodeId = "finalQuestion";
  chaseState.pathFromLastEncounter = [];

  finalizeChaseNodeReveal("finalQuestion");

  setChaseChoicesDisabled(false);
  chaseState.encounterPlaying = false;
}

function clearChaseTransitionOverlay() {
  if (!chaseTransitionOverlay) return;
  chaseTransitionOverlay.className = "chase-transition-overlay";
  chaseTransitionOverlay.innerHTML = "";
}

async function animateChaseSlideTransition(direction, nextSrc) {
  if (!chaseTransitionOverlay || !chaseImage) return;

  const currentSrc = chaseImage.src;
  let html = "";
  let overlayClass = "chase-transition-overlay active ";

  if (direction === "left") {
    overlayClass += "slide-left";
    html = `
      <div class="chase-pan-track">
        <img class="chase-pan-frame" src="${nextSrc}" alt="">
        <img class="chase-pan-frame" src="${currentSrc}" alt="">
      </div>
    `;
  }

  if (direction === "right") {
    overlayClass += "slide-right";
    html = `
      <div class="chase-pan-track">
        <img class="chase-pan-frame" src="${currentSrc}" alt="">
        <img class="chase-pan-frame" src="${nextSrc}" alt="">
      </div>
    `;
  }

  chaseTransitionOverlay.className = overlayClass;
  chaseTransitionOverlay.innerHTML = html;

  await sleep(30);
  chaseTransitionOverlay.classList.add("play");

  await sleep(980);
  chaseImage.src = nextSrc;
  clearChaseTransitionOverlay();
}

async function animateChaseZoomTransition(nextSrc) {
  if (!chaseTransitionOverlay || !chaseImage) return;

  const currentSrc = chaseImage.src;

  chaseTransitionOverlay.className = "chase-transition-overlay active zoom-transition";
  chaseTransitionOverlay.innerHTML = `
    <div class="chase-zoom-stack">
      <img class="chase-zoom-frame chase-zoom-current" src="${currentSrc}" alt="">
      <img class="chase-zoom-frame chase-zoom-next" src="${nextSrc}" alt="">
    </div>
  `;

  await sleep(30);
  chaseTransitionOverlay.classList.add("play");

  await sleep(860);
  chaseImage.src = nextSrc;
  clearChaseTransitionOverlay();
}

async function animateChaseZoomOutTransition(nextSrc) {
  if (!chaseTransitionOverlay || !chaseImage) return;

  const currentSrc = chaseImage.src;

  chaseTransitionOverlay.className =
    "chase-transition-overlay active zoom-out-transition";
  chaseTransitionOverlay.innerHTML = `
    <div class="chase-zoom-stack">
      <img class="chase-zoom-frame chase-zoom-current" src="${currentSrc}" alt="">
      <img class="chase-zoom-frame chase-zoom-next chase-zoom-next-out" src="${nextSrc}" alt="">
    </div>
  `;

  await sleep(30);
  chaseTransitionOverlay.classList.add("play");

  await sleep(860);
  chaseImage.src = nextSrc;
  clearChaseTransitionOverlay();
}

async function animateChaseDarkTransition() {
  if (!chaseTransitionOverlay) return;

  chaseTransitionOverlay.className = "chase-transition-overlay active dark-transition";
  chaseTransitionOverlay.innerHTML = `<div class="chase-dark-fill"></div>`;

  await sleep(30);
  chaseTransitionOverlay.classList.add("play");

  await sleep(650);
  clearChaseTransitionOverlay();
}

function runChaseTransition(sequence, nextNodeId) {
  const steps = Array.isArray(sequence) ? sequence : [sequence];
  const fromNodeId = chaseState.currentNodeId;

  setChaseChoicesDisabled(true);
  hideChaseDialogue();

  (async () => {
    for (let i = 0; i < steps.length; i += 1) {
      const step = steps[i];
      const isLast = i === steps.length - 1;

      const nextSrc =
        nextNodeId && chaseNodes[nextNodeId]
          ? getChaseImagePath(chaseNodes[nextNodeId].image)
          : chaseImage.src;

      if (step === "left" || step === "right") {
        await animateChaseSlideTransition(
          step,
          isLast ? nextSrc : chaseImage.src
        );
      } else if (step === "zoom") {
        await animateChaseZoomTransition(
          isLast ? nextSrc : chaseImage.src
        );
      } else if (step === "zoomOut" || step === "out") {
        await animateChaseZoomOutTransition(
          isLast ? nextSrc : chaseImage.src
        );
      } else if (step === "dark") {
        await animateChaseDarkTransition();
      }
    }

    if (nextNodeId) {
      const nextNode = chaseNodes[nextNodeId];

      // 如果下一个节点不是 encounter，就继续累积路径
      // 如果下一个节点是 encounter，presentChaseNode 会自动重置 checkpoint
      const nextPathFromLastEncounter =
        nextNode && nextNode.encounter
          ? []
          : [...(chaseState.pathFromLastEncounter || []), ...steps];

      presentChaseNode(nextNodeId, {
        fromNodeId,
        viaSequence: steps,
        pathFromLastEncounter: nextPathFromLastEncounter
      });
    } else {
      if (chaseAnswerText) {
        chaseAnswerText.innerHTML = `<p>The next room has not been connected yet.</p>`;
      }
    }

    setChaseChoicesDisabled(false);
  })();
}

if (chaseAnswerScroll) {
  chaseAnswerScroll.addEventListener("scroll", checkChaseScrollForProceed);
}

if (chaseProceedBtn) {
  chaseProceedBtn.addEventListener("click", () => {
    if (!chaseState.canProceed) return;

    const node = chaseNodes[chaseState.currentNodeId];

    if (node?.drumGame) {
      showDrumGame();
      return;
    }

    const choice = chaseState.selectedChoice;
    if (!choice) return;

    // 苏联人问题：错误回答不走普通转场，不 haunt，只黑屏回应
    if (
      chaseState.currentNodeId === "finalQuestion" &&
      choice.wrongSovietAnswer
    ) {
      playSovietWrongAnswerSequence();
      return;
    }

    runChaseTransition(choice.transition || [], choice.next);
  });
}

function setChaseChoicesDisabled(disabled) {
  [chaseLeftBtn, chaseForwardBtn, chaseRightBtn, chaseProceedBtn].forEach((btn) => {
    if (!btn) return;
    btn.disabled = disabled;
  });
}

function runGlobalBlink(callback = null, duration = 140) {
  if (!blinkOverlay) {
    if (callback) callback();
    return;
  }

  setBlinkOverlay(true);

  setTimeout(() => {
    setBlinkOverlay(false);
    if (callback) callback();
  }, duration);
}

function resetChaseInteractionState() {
  chaseState.selectedChoice = null;
  chaseState.locked = false;
  chaseState.canProceed = false;
  chaseState.encounterPlaying = false;
  chaseState.itemQuestionReady = false;
  chaseState.itemQuestionNodeId = null;
  chaseState.arrivalInfo = null;
  chaseState.lastEncounterNodeId = "screenWall";
  chaseState.pathFromLastEncounter = [];

  [chaseLeftBtn, chaseForwardBtn, chaseRightBtn, chaseProceedBtn].forEach((btn) => {
    if (!btn) return;
    btn.disabled = false;
    btn.classList.remove("is-preview");
  });

  if (chaseProceedBtn) {
    chaseProceedBtn.hidden = true;
  }

  if (chaseDialogueBox) {
    chaseDialogueBox.classList.remove("is-previewing", "is-locked");
  }

  if (chaseAnswerText) {
    chaseAnswerText.innerHTML = "";
    chaseAnswerText.classList.remove("answer-preview", "answer-locked");
  }

  if (chaseAnswerScroll) {
    chaseAnswerScroll.scrollTop = 0;
  }

  clearChaseTransitionOverlay();
}

function hideChaseEncounterLayer() {
  if (!chaseEncounterLayer) return;

  chaseEncounterLayer.hidden = true;
  chaseEncounterLayer.className = "chase-encounter-layer";
  chaseEncounterLayer.innerHTML = "";

  chaseEncounterLayer.onclick = null;
  chaseEncounterLayer.onpointerup = null;
  chaseEncounterLayer.onpointerdown = null;

  chaseState.itemQuestionReady = false;
  chaseState.itemQuestionNodeId = null;
}

if (chaseEncounterLayer) {
  chaseEncounterLayer.addEventListener("click", (event) => {
    if (!chaseEncounterLayer.classList.contains("is-item-question")) return;

    event.preventDefault();
    event.stopPropagation();

    continueFromItemQuestion();
  });

  chaseEncounterLayer.addEventListener("pointerup", (event) => {
    if (!chaseEncounterLayer.classList.contains("is-item-question")) return;

    event.preventDefault();
    event.stopPropagation();

    continueFromItemQuestion();
  });
}

function continueFromItemQuestion() {
  if (!chaseState.itemQuestionReady) return;
  if (!chaseState.itemQuestionNodeId) return;

  const nodeId = chaseState.itemQuestionNodeId;

  chaseState.itemQuestionReady = false;
  chaseState.itemQuestionNodeId = null;

  hideChaseEncounterLayer();
  finalizeChaseNodeReveal(nodeId);
  chaseState.encounterPlaying = false;
}

function showChapter3Intro() {
  if (!chaseChapterIntro) return;

  chaseChapterIntro.hidden = false;
  chaseChapterIntro.classList.remove("is-leaving");
  chaseChapterIntro.classList.add("is-visible");
  chaseState.introPlaying = true;
}

function beginChapter3AfterIntro() {
  if (!chaseChapterIntro) {
    presentChaseNode("screenWall");
    return;
  }

  chaseChapterIntro.classList.add("is-leaving");

  if (chaseScene) {
    chaseScene.classList.add("chapter-zoom-in");
  }

  setTimeout(() => {
    chaseChapterIntro.hidden = true;
    chaseChapterIntro.classList.remove("is-visible", "is-leaving");

    if (chaseScene) {
      chaseScene.classList.remove("chapter-zoom-in");
    }

    chaseState.introPlaying = false;
    presentChaseNode("screenWall");
  }, 820);
}

function startChaseLevel() {
  chaseState.currentNodeId = "screenWall";

  chaseState.drumRound = 0;
  chaseState.drumSequence = [];
  chaseState.drumPlayerIndex = 0;

  chaseState.introPlaying = false;

  resetChaseInteractionState();
  hideChaseEncounterLayer();
  hideChaseDialogue();

  if (drumGamePanel) {
    drumGamePanel.hidden = true;
  }

  if (chaseScene) {
    chaseScene.classList.remove("game-over", "chapter-zoom-in");
  }

  if (chaseImage) {
    chaseImage.src = getChaseImagePath(chaseNodes.screenWall.image);
    chaseImage.alt = "Chapter 3";
  }

  renderChaseChoices(chaseNodes.screenWall);
  showChapter3Intro();
}

if (chaseChapterIntro) {
  chaseChapterIntro.addEventListener("click", () => {
    if (!chaseState.introPlaying) return;
    beginChapter3AfterIntro();
  });
}

function renderChaseNode(nodeId, options = {}) {
  const { deferReveal = false } = options;
  const node = chaseNodes[nodeId];
  if (!node) return;

  chaseState.currentNodeId = nodeId;
  chaseState.selectedChoice = null;
  chaseState.locked = false;
  chaseState.canProceed = false;

  if (chaseImage) {
    chaseImage.src = getChaseImagePath(node.image);
    chaseImage.alt = node.title || nodeId;
  }

  if (chaseScene) {
    chaseScene.classList.toggle("game-over", !!node.gameOver);
  }

  renderChaseChoices(node);

  if (deferReveal) {
    if (chaseNodeTitle) chaseNodeTitle.textContent = "";
    if (chaseQuestion) chaseQuestion.innerHTML = "";
    if (chaseAnswerText) chaseAnswerText.innerHTML = "";
    if (chaseAnswerScroll) chaseAnswerScroll.scrollTop = 0;
    if (chaseProceedBtn) chaseProceedBtn.hidden = true;
    if (chaseDialogueBox) chaseDialogueBox.classList.remove("is-previewing", "is-locked");
    if (drumGamePanel) drumGamePanel.hidden = true;
    return;
  }

  finalizeChaseNodeReveal(nodeId);
}

async function playGhostSpeechSequence(lines = []) {
  if (!chaseEncounterLayer || !Array.isArray(lines) || lines.length === 0) return;

  chaseEncounterLayer.hidden = false;
  chaseEncounterLayer.className = "chase-encounter-layer ghost-speech-layer";
  chaseEncounterLayer.innerHTML = `<div class="ghost-speech-text"></div>`;

  const textNode = chaseEncounterLayer.querySelector(".ghost-speech-text");

  for (const line of lines) {
    textNode.textContent = line;

    chaseEncounterLayer.classList.remove("ghost-line-zoom");
    void chaseEncounterLayer.offsetWidth;
    chaseEncounterLayer.classList.add("ghost-line-zoom");

    await new Promise((resolve) => {
      const handleClick = () => {
        chaseEncounterLayer.removeEventListener("click", handleClick);
        resolve();
      };

      chaseEncounterLayer.addEventListener("click", handleClick);
    });
  }

  chaseEncounterLayer.classList.remove("ghost-line-zoom");
}

async function playSpiritRevealSequence(node) {
  if (!chaseEncounterLayer) return;

  const closeSrc = getChaseItemPath(node.spiritCloseImage || "spirit1.png");
  const fullSrc = getChaseItemPath(node.spiritImage || "spirit.png");

  runGlobalBlink(() => {
    chaseEncounterLayer.hidden = false;
    chaseEncounterLayer.className = "chase-encounter-layer is-spirit-close";
    chaseEncounterLayer.innerHTML = `
      <img
        class="chase-spirit-close"
        src="${closeSrc}"
        alt="Spirit"
      />
    `;
  });

  await sleep(760);

  const closeImg = chaseEncounterLayer.querySelector(".chase-spirit-close");
  if (closeImg) {
    closeImg.classList.add("zooming-out");
  }

  await sleep(260);

  runGlobalBlink(() => {
    chaseEncounterLayer.className = "chase-encounter-layer is-spirit-full";
    chaseEncounterLayer.innerHTML = `
      <img
        class="chase-spirit-full"
        src="${fullSrc}"
        alt="Spirit"
      />
    `;
  });

  await sleep(760);
}

async function playChaseDeathSequence(node) {
  if (!chaseEncounterLayer) return;

  chaseState.encounterPlaying = true;
  hideChaseDialogue();

  if (chaseImage && node.image) {
    chaseImage.src = getChaseImagePath(node.image);
  }

  await playSpiritRevealSequence({
    spiritCloseImage: node.deathSpiritClose || "spirit1.png",
    spiritImage: node.deathSpirit || "spirit.png"
  });

  chaseEncounterLayer.className = "chase-encounter-layer chase-death-layer death-red-phase";
  chaseEncounterLayer.innerHTML = `
    <img
      class="chase-death-spirit"
      src="${getChaseItemPath(node.deathSpirit || "spirit.png")}"
      alt="Spirit"
    />
  `;

  await sleep(900);

  chaseEncounterLayer.className = "chase-encounter-layer chase-death-layer death-black-phase";
  chaseEncounterLayer.innerHTML = `
    <div class="chase-death-text">
      <p>The moment this thought rises in your mind, you feel your eyes and mouth burning fiercely.</p>
      <p>Before you can react, the pain spreads through your entire body.</p>
      <p>Before death, the only thing you hear is the ghost’s roar.</p>
      <p class="chase-death-hint">Click to wake at the door.</p>
    </div>
  `;

  await new Promise((resolve) => {
    const handleClick = () => {
      chaseEncounterLayer.removeEventListener("click", handleClick);
      resolve();
    };

    chaseEncounterLayer.addEventListener("click", handleClick);
  });

  hideChaseEncounterLayer();
  chaseState.encounterPlaying = false;

  returnToRoom2DoorAfterDeath();
}

async function presentChaseNode(nodeId, arrivalInfo = null) {
  const node = chaseNodes[nodeId];
  if (!node) return;

  chaseState.arrivalInfo = arrivalInfo;

  if (node.finalGiftSequence) {
    await playFinalGiftSequence();
    return;
  }

  // 如果当前节点是 encounter，就把它记录为新的 checkpoint
  if (node.encounter) {
    chaseState.lastEncounterNodeId = nodeId;
    chaseState.pathFromLastEncounter = [];
  } else if (arrivalInfo && Array.isArray(arrivalInfo.pathFromLastEncounter)) {
    chaseState.pathFromLastEncounter = arrivalInfo.pathFromLastEncounter;
  }

  if (node.death) {
    await playChaseDeathSequence(node);
    return;
  }

  chaseState.encounterPlaying = true;
  renderChaseNode(nodeId, { deferReveal: true });
  hideChaseEncounterLayer();
  hideChaseDialogue();

  if (node.drumGame) {
    finalizeChaseNodeReveal(nodeId);
    chaseState.encounterPlaying = false;
    return;
  }

  if (!node.encounter) {
    finalizeChaseNodeReveal(nodeId);
    chaseState.encounterPlaying = false;
    return;
  }

  if (node.ghostLines && node.ghostLines.length > 0) {
    await playGhostSpeechSequence(node.ghostLines);
  }

  await playSpiritRevealSequence(node);

  runGlobalBlink(() => {
    chaseEncounterLayer.className = "chase-encounter-layer is-item-question";
    chaseEncounterLayer.innerHTML = `
      <div class="chase-encounter-card">
        <img
          class="chase-item-large"
          src="${getChaseItemPath(node.itemImage)}"
          alt="${node.itemTitle || ""}"
        />
        <div class="chase-encounter-copy">
          <div class="chase-encounter-question">${node.question || ""}</div>
          <div class="chase-encounter-hint">Click anywhere to answer.</div>
        </div>
      </div>
    `;
  });

  chaseState.itemQuestionNodeId = nodeId;
  chaseState.itemQuestionReady = true;
}

function finalizeChaseNodeReveal(nodeId) {
  const node = chaseNodes[nodeId];
  if (!node) return;

  chaseState.currentNodeId = nodeId;
  chaseState.selectedChoice = null;
  chaseState.locked = false;
  chaseState.canProceed = false;

  if (node.hideDialogue) {
    hideChaseDialogue();
  } else {
    showChaseDialogue();

    if (chaseNodeTitle) {
      chaseNodeTitle.textContent = node.title || "";
    }

    if (chaseQuestion) {
      chaseQuestion.innerHTML = `
        <p>${node.question || ""}</p>
        <p class="chase-hint-line">Hover over a direction to preview your answer.</p>
      `;
    }

    if (chaseProgressTag) {
      chaseProgressTag.textContent = "Chapter Three";
    }

    if (chaseAnswerText) {
      chaseAnswerText.innerHTML = "";
      chaseAnswerText.classList.remove("answer-preview", "answer-locked");
    }

    if (chaseAnswerScroll) {
      chaseAnswerScroll.scrollTop = 0;
    }

    if (chaseProceedBtn) {
      chaseProceedBtn.hidden = true;
    }

    if (chaseDialogueBox) {
      chaseDialogueBox.classList.remove("is-previewing", "is-locked");
    }
  }

  if (node.drumGame) {
    showDrumGame();
  } else if (drumGamePanel) {
    drumGamePanel.hidden = true;
  }
}

/* =========================
   Drum Ritual
========================== */

function showDrumGame() {
  if (!drumGamePanel) return;

  drumGamePanel.hidden = false;
  chaseState.drumRound = 0;
  startDrumRound();
}

function startDrumRound() {
  const length = chaseState.drumLengths[chaseState.drumRound];

  chaseState.drumSequence = Array.from({ length }, () => Math.floor(Math.random() * 4));
  chaseState.drumPlayerIndex = 0;

  if (drumRoundText) {
    drumRoundText.textContent = `Round ${chaseState.drumRound + 1} / ${chaseState.drumLengths.length}`;
  }

  if (drumInstruction) {
    drumInstruction.textContent = "Watch the lights. Then repeat the sequence.";
  }

  playDrumSequence();
}

function playDrumSequence() {
  const pads = Array.from(document.querySelectorAll(".drum-pad"));

  pads.forEach((pad) => {
    pad.disabled = true;
  });

  chaseState.drumSequence.forEach((padIndex, i) => {
    setTimeout(() => {
      flashDrumPad(padIndex);
    }, 650 * i);
  });

  setTimeout(() => {
    pads.forEach((pad) => {
      pad.disabled = false;
    });

    if (drumInstruction) {
      drumInstruction.textContent = "Now repeat it.";
    }
  }, 650 * chaseState.drumSequence.length + 400);
}

function flashDrumPad(index) {
  const pad = document.querySelector(`.drum-pad[data-pad="${index}"]`);
  if (!pad) return;

  pad.classList.add("active");

  setTimeout(() => {
    pad.classList.remove("active");
  }, 360);
}

document.querySelectorAll(".drum-pad").forEach((pad) => {
  pad.addEventListener("click", () => {
    const padIndex = Number(pad.dataset.pad);
    handleDrumInput(padIndex);
  });
});

function handleDrumInput(padIndex) {
  flashDrumPad(padIndex);

  const expected = chaseState.drumSequence[chaseState.drumPlayerIndex];

  if (padIndex !== expected) {
    chaseState.drumPlayerIndex = 0;

    if (drumInstruction) {
      drumInstruction.textContent = "Wrong rhythm. Watch again.";
    }

    setTimeout(playDrumSequence, 800);
    return;
  }

  chaseState.drumPlayerIndex += 1;

  if (chaseState.drumPlayerIndex >= chaseState.drumSequence.length) {
    chaseState.drumRound += 1;

    if (chaseState.drumRound >= chaseState.drumLengths.length) {
      finishDrumRitual();
      return;
    }

    if (drumInstruction) {
      drumInstruction.textContent = "Correct. The rhythm grows longer.";
    }

    setTimeout(startDrumRound, 1000);
  }
}

function finishDrumRitual() {
  if (drumGamePanel) {
    drumGamePanel.hidden = true;
  }

  presentChaseNode("finalQuestion");
}

function returnToRoom2DoorAfterDeath() {
  resetChaseInteractionState();
  hideChaseEncounterLayer();
  hideChaseDialogue();

  if (drumGamePanel) {
    drumGamePanel.hidden = true;
  }

  openScreen(gameScreen2);

  room2State.finalTriggered = true;
  room2State.fullscreenActive = true;
  room2State.doorFlipUnlocked = true;
  room2State.doorVisible = true;
  room2State.persistentBlink = true;
  room2State.dragActive = false;
  room2State.dragMoved = false;

  if (gameScreen2) {
    gameScreen2.classList.add("room2-fullscreen");
    gameScreen2.classList.add("room2-door-visible");
  }

  if (roomImage2) {
    roomImage2.src = "images/door.png";
  }

  if (room2FlipBtn) {
    room2FlipBtn.hidden = false;
    room2FlipBtn.textContent = "Flip Back";
  }

  renderRoom2Status();

  if (bgm3) {
    bgm3Started = false;
    switchToBgm3();
  }

  restartRoom2BlinkFromImmediateBlink();
}
const FINAL_GIFT_FRONT = "finalGiftPhoto.png";
const FINAL_GIFT_BACK = "finalGiftPhotoBack.png";

const finalGiftReadingBackHtml = `
  <p><strong>Roland Barthes:</strong></p>
  <p>Truly traumatic photographs are rare, for in photography, the trauma is only dependent on the certainty that the artist is there.</p>

  <p><strong>Andre Bazin.</strong></p>
  <p>For the first time, between the originating object and its reproduction there intervenes only the instrumentality of a nonliving agent. For the first time an image of the world is formed automatically, without the creative intervention of man. The personality of the photographer enters into the proceedings only in his selection of the object to be photographed and by way of the purpose he has in mind. The photographic image is the object itself, the object freed from the conditions of time and space that govern it. The photograph as such and the object in itself share a common being, after the fashion of a fingerprint.</p>
`;

const finalGiftReadingFrontHtml = `
  <p>This is Bracha L. Ettinger’s <em>Eurydice</em> series, no. 14. In this work, she repeatedly prints archival photographs of female victims taken by the Nazis in the gas chambers, then adds color and brushstrokes onto the surface of the image.</p>

  <p>André Bazin once understood photography as a mechanical art distinct from the traditional plastic arts: photography derives its power from its physical bond with reality, from its apparent ability to record, honestly and objectively, what “was there.” Yet it is precisely this mechanical appearance of objectivity that allows archival photographs to disguise themselves as neutral records, concealing the violent system behind the camera.</p>

  <p>The image is always trying to bind itself to the reality behind the lens and beyond the frame. Ettinger, however, gently places paint at the point where these lines of sight meet. She reminds us, as Deleuze suggests, that the viewer of an image can never return to the past in a purely disembodied way, without subjectivity, without an inner life. Through feminized colors and visible brushstrokes, she refuses to hide her own presence. These marks tell the viewer clearly that the image is not being looked at by a cold, neutral, bodiless machine, but is being faced again by an artist who also carries trauma, memory, and subjectivity. She does not leave these women exposed, alone, to the Nazi archive, to modern technological mechanisms, and to the patriarchal gaze. Instead, she makes her own position as viewer visible, so that looking is no longer possession, but a form of responsibility.</p>

  <p>When our gaze joins with the image, what we see is not the clear, “scientific,” objective image of the Nazi archive. The light of the 1940s once reflected from the bodies of these victims toward the lens, striking both the photographer’s retina and the photographic film. Yet when that light is refracted into the eyes of Ettinger and of the viewer, it is interrupted; it becomes blurred. This blurring protects both sides of the act of looking: those who see, and those who are seen. Ettinger is not hiding history--she is protecting these women from being invaded once again by the world outside the frame—as numbers, as specimens, as expendable material, as evidence.</p>
`;

const finalGiftGhostPages = [
  `On the one hand, these photographs can serve as evidence. They can testify that the trauma existed.`,
  `But please do not forget why the Japanese military took them in the first place—`,
  `for experiment, for archival classification, for control, for objectification.`,
  `Please spare me from that gaze,`,
  `and from that pain.`
];

const postGiftDialoguePages = [
  `<p><strong>You:</strong></p><p>Could you please let me go home now? Or at least let me return to the crime scene and do my work.</p>`,
  `<p><strong>Ghost:</strong></p><p>Not yet.</p>`,
  `<p><strong>Ghost:</strong></p><p>It is not enough to simply imitate Bracha L. Ettinger.</p>`,
  `<p><strong>Ghost:</strong></p><p>Nazi Germany apologized. Nazi rule was dismantled by the Soviet Union. The historical trauma of the Jewish people has entered public history. But under the political order shaped by decades of the Cold War, the Japanese government has still not properly apologized to the victims in Korea, North Korea, China, or even among its own people.</p>`,
  `<p><strong>Ghost:</strong></p><p>In recent years, the survivors have grown older and older. The living sisters and men are fewer and fewer. Like all perpetrators of sexual violence and all systems built on the crushing of the powerless, the Japanese government remains silent and waits for the victims to exhaust their voices.</p>`,
  `<p><strong>Ghost:</strong></p><p>I will send you away.</p>`,
  `<p><strong>Ghost:</strong></p><p>But I will not disappear.</p>`,
  `<p><strong>Ghost:</strong></p><p>I will haunt everyone who tries to objectify, exploit, and humiliate another human being. I will keep roaring.</p>`,
  `<p><strong>Ghost:</strong></p><p>The standards of evidence demanded by the international community, the Japanese government’s erasure of proof, the pain made unspeakable by ideas of chastity, the difficulty of gathering testimony in poor and remote regions—all of these have turned the path toward justice into a black box.</p>`,
  `<p><strong>Ghost:</strong></p><p>Our voices and our grievances echo inside that boundless darkness.</p>`,
  `<p><strong>You:</strong></p><p>So... the man was killed by you?</p>`,
  `<p><strong>Ghost:</strong></p><p>I do not deny it.</p>`,
  `<p><strong>Ghost:</strong></p><p>Have you ever heard this idea? Every word we speak carries energy in the waves of its sound. Even as the walls and the air absorb it, that energy is never truly used up.</p>`,
  `<p><strong>Ghost:</strong></p><p>Even when your ears can no longer catch it, the energy remains.</p>`,
  `<p><strong>Ghost:</strong></p><p>And I remain.</p>`
];

const finalEchoPages = [
  `<p>My voice echoes forever, whether you can hear it or not, whether you want to listen or not.</p>`,
  `<p>The moment that man formed his vile intention, he was burned by the energy of that voice. But you—and people like you, decent and kind—will not be harmed by it.</p>`
];

const room2GiftState = {
  unlocked: false,
  panelOpen: false,
  side: "back",
  frontReadComplete: false
};

function renderFinalGiftBase() {
  if (!chaseEncounterLayer) return;

  chaseEncounterLayer.hidden = false;
  chaseEncounterLayer.className = "chase-encounter-layer final-gift-layer";
  chaseEncounterLayer.innerHTML = `
    <div class="final-gift-stage">
      <img
        id="finalGiftMainImage"
        class="final-gift-main-image"
        src="${getChaseItemPath(FINAL_GIFT_FRONT)}"
        alt="Gift photograph"
      >
    </div>

    <button
      id="finalGiftFlipBtn"
      class="final-gift-flip-btn"
      type="button"
      hidden
    >
      Flip
    </button>

    <div id="finalGiftTextBar" class="final-gift-text-bar" hidden>
      <div id="finalGiftScroll" class="final-gift-scroll">
        ${finalGiftReadingBackHtml}
      </div>

      <button
        id="finalGiftProceedBtn"
        class="final-gift-proceed-btn"
        type="button"
        hidden
      >
        Proceed
      </button>
    </div>
  `;
}

async function playFinalGiftHauntIntoPhoto() {
  if (!chaseEncounterLayer) return;

  const photo = document.getElementById("finalGiftMainImage");
  if (!photo) return;

  const spiritOverlay = document.createElement("div");
  spiritOverlay.className = "final-gift-spirit-overlay";
  chaseEncounterLayer.appendChild(spiritOverlay);

  const closeSrc = getChaseItemPath("spirit1.png");
  const fullSrc = getChaseItemPath("spirit.png");

  runGlobalBlink(() => {
    spiritOverlay.innerHTML = `
      <img
        class="chase-spirit-close"
        src="${closeSrc}"
        alt="Spirit"
      />
    `;
  });

  await sleep(240);

  photo.classList.add("visible");

  await sleep(520);

  const closeImg = spiritOverlay.querySelector(".chase-spirit-close");
  if (closeImg) {
    closeImg.classList.add("zooming-out");
  }

  await sleep(260);

  runGlobalBlink(() => {
    spiritOverlay.innerHTML = `
      <img
        class="chase-spirit-full"
        src="${fullSrc}"
        alt="Spirit"
      />
    `;
  });

  await sleep(760);

  const fullImg = spiritOverlay.querySelector(".chase-spirit-full");
  if (fullImg) {
    fullImg.style.transition = "opacity 1.1s ease, transform 1.1s ease, filter 1.1s ease";
    fullImg.style.opacity = "0";
    fullImg.style.transform = "scale(0.25)";
    fullImg.style.filter = "blur(16px) drop-shadow(0 0 0 rgba(255,255,255,0))";
  }

  await sleep(1150);

  spiritOverlay.remove();
}

async function playFinalGiftSequence() {
  resetChaseInteractionState();
  hideChaseDialogue();
  setChaseChoicesDisabled(true);

  if (!chaseEncounterLayer) return;

  runGlobalBlink();
  await sleep(180);

  renderFinalGiftBase();

  const photo = document.getElementById("finalGiftMainImage");
  const flipBtn = document.getElementById("finalGiftFlipBtn");
  const textBar = document.getElementById("finalGiftTextBar");
  const scroll = document.getElementById("finalGiftScroll");
  const proceedBtn = document.getElementById("finalGiftProceedBtn");

  await playFinalGiftHauntIntoPhoto();

  await sleep(10000);

  if (flipBtn) {
    flipBtn.hidden = false;
  }

  function unlockFinalGiftProceedWhenRead() {
    if (!scroll || !proceedBtn) return;

    proceedBtn.hidden = true;
    scroll.scrollTop = 0;

    const checkRead = () => {
      const reachedBottom =
        scroll.scrollTop + scroll.clientHeight >= scroll.scrollHeight - 16;

      const noScrollNeeded =
        scroll.scrollHeight <= scroll.clientHeight + 12;

      if (reachedBottom || noScrollNeeded) {
        proceedBtn.hidden = false;
      }
    };

    requestAnimationFrame(checkRead);
    scroll.addEventListener("scroll", checkRead);
  }

  if (flipBtn && photo && textBar && scroll && proceedBtn) {
    flipBtn.addEventListener(
      "click",
      async () => {
        flipBtn.hidden = true;

        photo.classList.add("flip-anim");
        await sleep(500);
        photo.src = getChaseItemPath(FINAL_GIFT_BACK);
        await sleep(520);
        photo.classList.remove("flip-anim");

        textBar.hidden = false;
        scroll.innerHTML = finalGiftReadingBackHtml;

        unlockFinalGiftProceedWhenRead();
      },
      { once: true }
    );
  }

  if (proceedBtn) {
    proceedBtn.addEventListener(
      "click",
      async () => {
        proceedBtn.hidden = true;
        await playFinalGiftGhostSpeech();
      },
      { once: true }
    );
  }
}

async function playFinalGiftGhostSpeech() {
  if (!chaseEncounterLayer) return;

  await playSpiritRevealSequence({
    spiritCloseImage: "spirit1.png",
    spiritImage: "spirit.png"
  });

  runGlobalBlink();
  await sleep(220);

  chaseEncounterLayer.hidden = false;
  chaseEncounterLayer.className = "chase-encounter-layer ghost-speech-layer";
  chaseEncounterLayer.innerHTML = `
    <div id="finalGiftGhostSpeechText" class="ghost-speech-text"></div>
  `;

  await playPaginatedFinalGiftSpeech(finalGiftGhostPages);

  hideChaseEncounterLayer();
  setChaseChoicesDisabled(false);

  await enterRoom4DoorBeforeGift();
}

async function playPaginatedFinalGiftSpeech(pages) {
  const textNode = document.getElementById("finalGiftGhostSpeechText");
  if (!textNode) return;

  for (let i = 0; i < pages.length; i += 1) {
    textNode.innerHTML = `<p>${pages[i]}</p>`;

    if (chaseEncounterLayer) {
      chaseEncounterLayer.classList.remove("ghost-line-zoom");
      void chaseEncounterLayer.offsetWidth;
      chaseEncounterLayer.classList.add("ghost-line-zoom");
    }

    await waitForEncounterLayerClickOnce();
  }
}

function waitForEncounterLayerClickOnce() {
  return new Promise((resolve) => {
    if (!chaseEncounterLayer) {
      resolve();
      return;
    }

    const handler = () => {
      chaseEncounterLayer.removeEventListener("click", handler);
      resolve();
    };

    chaseEncounterLayer.addEventListener("click", handler);
  });
}

/* =========================
   Return to Room 2 + Gift card
========================== */

const room4GiftState = {
  unlocked: false,
  panelOpen: false,
  side: "back",
  frontReadComplete: false
};

function ensureRoom4Screen() {
  let room4 = document.getElementById("gameScreen4");
  if (room4) return room4;

  room4 = document.createElement("section");
  room4.id = "gameScreen4";
  room4.className = "screen game-screen";

  room4.innerHTML = `
    <div class="top-bar">
      <div>
        <h2>Chapter four: the gift</h2>
        <p>It seems that everything has been mirrored and reversed</p>
      </div>
      <button id="room4BackBtn" type="button" class="secondary-btn">Previous chapter</button>
    </div>

    <div class="game-layout">
      <div class="scene-panel">
        <div id="room4SceneWrapper" class="scene-wrapper">
          <img
            id="room4Image"
            class="scene-image"
            src="images/door.png"
            alt="Room 4"
          />
        </div>

        <div class="room4-flip-wrap">
          <button id="room4FlipBtn" class="room4-flip-btn" type="button">Flip</button>
        </div>
      </div>

      <aside class="side-panel">
        <div class="panel-block">
          <h3>The gift from the ghost.</h3>
          <div id="room4StoryText" class="story-text">
            <p>Something has been returned to you.</p>
          </div>
        </div>
      </aside>
    </div>
  `;

  document.body.appendChild(room4);

  const backBtn = room4.querySelector("#room4BackBtn");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      openScreen(gameScreen3);
    });
  }

  const flipBtn = room4.querySelector("#room4FlipBtn");
  if (flipBtn) {
    flipBtn.addEventListener("click", revealRoom4FromDoor);
  }

  return room4;
}

async function enterRoom4DoorBeforeGift() {
  const room4 = ensureRoom4Screen();
  const room4Image = room4.querySelector("#room4Image");
  const room4FlipBtn = room4.querySelector("#room4FlipBtn");

  openScreen(room4);

  if (typeof switchToBgm3 === "function") {
    switchToBgm3();
  }

  room4.classList.add("room4-door-mode");

  if (room4Image) {
    room4Image.src = "images/door.png";
  }

  if (room4FlipBtn) {
    room4FlipBtn.hidden = false;
    room4FlipBtn.textContent = "Flip";
  }

  room4GiftState.unlocked = false;
  room4GiftState.panelOpen = false;
  room4GiftState.side = "back";
  room4GiftState.frontReadComplete = false;

  ensureRoom4GiftUI();
  renderRoom4GiftUI();
}

async function revealRoom4FromDoor() {
  const room4 = ensureRoom4Screen();
  const wrapper = room4.querySelector("#room4SceneWrapper");
  const room4Image = room4.querySelector("#room4Image");
  const room4FlipBtn = room4.querySelector("#room4FlipBtn");

  if (wrapper) {
    wrapper.classList.add("room4-scene-turning");
  }

  runGlobalBlink();

  await sleep(420);

  if (room4Image) {
    room4Image.src = "images/room2.png";
  }

  await sleep(420);

  if (wrapper) {
    wrapper.classList.remove("room4-scene-turning");
  }

  room4.classList.remove("room4-door-mode");

  if (room4FlipBtn) {
    room4FlipBtn.hidden = true;
  }

  room4GiftState.unlocked = true;
  room4GiftState.panelOpen = false;
  room4GiftState.side = "back";
  room4GiftState.frontReadComplete = false;

  ensureRoom4GiftUI();
  renderRoom4GiftUI();
}

function ensureRoom4GiftUI() {
  if (document.getElementById("room4GiftInline")) return;

  const room4 = ensureRoom4Screen();
  const storyText = room4.querySelector("#room4StoryText");

  if (!storyText) return;

  const giftInline = document.createElement("div");
  giftInline.id = "room4GiftInline";
  giftInline.className = "room4-gift-inline";
  giftInline.hidden = true;

  giftInline.innerHTML = `
    <div id="room4GiftInlineCard" class="room4-gift-inline-card" role="button" tabindex="0">
      <div class="room4-gift-inline-thumb">
        <img src="${getChaseItemPath(FINAL_GIFT_FRONT)}" alt="gift">
      </div>

      <div>
        <div class="room4-gift-inline-title">gift</div>
        <div class="room4-gift-inline-desc">A photograph returned by the ghost.</div>
      </div>
    </div>
  `;

  storyText.appendChild(giftInline);

  const card = giftInline.querySelector("#room4GiftInlineCard");

  if (card) {
    card.addEventListener("click", openRoom4GiftModal);

    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openRoom4GiftModal();
      }
    });
  }
}

function renderRoom4GiftUI() {
  const giftInline = document.getElementById("room4GiftInline");
  if (!giftInline) return;

  giftInline.hidden = !room4GiftState.unlocked;
}

function openRoom4GiftModal() {
  room4GiftState.panelOpen = true;
  room4GiftState.side = room4GiftState.side || "back";

  ensureRoom4GiftModalExists();
  renderRoom4GiftModal();
}

function ensureRoom4GiftModalExists() {
  if (document.getElementById("modal")) return;

  const modal = document.createElement("div");
  modal.id = "modal";
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-card">
      <button id="modalClose" class="modal-close" type="button">×</button>

      <div class="modal-header">
        <div id="modalMark" class="modal-mark">✦</div>
        <div>
          <h2 id="modalTitle">gift</h2>
          <div id="modalSubtitle" class="modal-subtitle"></div>
        </div>
      </div>

      <div id="modalContent" class="modal-content"></div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = modal.querySelector("#modalClose");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("active");
    });
  }

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("active");
    }
  });
}

function closeRoom4GiftModal() {
  const modal = document.getElementById("modal");
  if (modal) {
    modal.classList.remove("active");
  }
}

function renderRoom4GiftModal() {
  const modal = document.getElementById("modal");
  const modalTitle = document.getElementById("modalTitle");
  const modalSubtitle = document.getElementById("modalSubtitle");
  const modalMark = document.getElementById("modalMark");
  const modalContent = document.getElementById("modalContent");

  if (!modal || !modalContent) return;

  const isBack = room4GiftState.side === "back";
  const imagePath = isBack
    ? getChaseItemPath(FINAL_GIFT_BACK)
    : getChaseItemPath(FINAL_GIFT_FRONT);

  const textHtml = isBack
    ? finalGiftReadingBackHtml
    : finalGiftReadingFrontHtml;

  if (modalTitle) modalTitle.textContent = "gift";
  if (modalSubtitle) {
    modalSubtitle.textContent = isBack
      ? "Back of the photograph"
      : "Front of the photograph";
  }
  if (modalMark) modalMark.textContent = "✦";

  modalContent.innerHTML = `
    <div class="room4-gift-modal-content">
      <div class="room4-gift-modal-image-wrap">
        <img src="${imagePath}" alt="gift">
      </div>

      <div class="room4-gift-modal-note">
        <div id="room4GiftModalText" class="room4-gift-modal-text">
          ${textHtml}
        </div>

        <div class="room4-gift-modal-actions">
          <button id="room4GiftModalFlip" class="room4-gift-flip" type="button">
            Flip
          </button>

          <button id="room4GiftModalProceed" class="room4-gift-proceed" type="button" hidden>
            Proceed
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("active");

  const flipBtn = document.getElementById("room4GiftModalFlip");
  const textBox = document.getElementById("room4GiftModalText");
  const proceedBtn = document.getElementById("room4GiftModalProceed");

  if (flipBtn) {
    flipBtn.addEventListener("click", () => {
      room4GiftState.side = room4GiftState.side === "back" ? "front" : "back";
      renderRoom4GiftModal();
    });
  }

  if (textBox && proceedBtn) {
    const maybeUnlockProceed = () => {
      const reachedBottom =
        textBox.scrollTop + textBox.clientHeight >= textBox.scrollHeight - 16;

      const noScrollNeeded =
        textBox.scrollHeight <= textBox.clientHeight + 12;

      if (room4GiftState.side === "front" && (reachedBottom || noScrollNeeded)) {
        room4GiftState.frontReadComplete = true;
        proceedBtn.hidden = false;
      }
    };

    if (room4GiftState.side === "front" && room4GiftState.frontReadComplete) {
      proceedBtn.hidden = false;
    } else {
      proceedBtn.hidden = true;
    }

    requestAnimationFrame(maybeUnlockProceed);
    textBox.addEventListener("scroll", maybeUnlockProceed);
  }

  if (proceedBtn) {
    proceedBtn.addEventListener("click", async () => {
      closeRoom4GiftModal();
      await startPostGiftEndingSequence();
    });
  }
}

/* =========================
   Global overlay narrative
========================== */

function ensureGlobalNarrativeOverlay() {
  let overlay = document.getElementById("globalNarrativeOverlay");
  if (overlay) return overlay;

  overlay = document.createElement("div");
  overlay.id = "globalNarrativeOverlay";
  overlay.className = "global-narrative-overlay";
  overlay.hidden = true;
  document.body.appendChild(overlay);

  return overlay;
}

function ensureGlobalRemainLayer() {
  let layer = document.getElementById("globalRemainLayer");
  if (layer) return layer;

  layer = document.createElement("div");
  layer.id = "globalRemainLayer";
  layer.className = "global-remain-layer";
  layer.hidden = true;
  document.body.appendChild(layer);

  return layer;
}

function ensureGlobalHauntStage() {
  let stage = document.getElementById("globalHauntStage");
  if (stage) return stage;

  stage = document.createElement("div");
  stage.id = "globalHauntStage";
  stage.className = "global-haunt-stage";
  stage.hidden = true;
  document.body.appendChild(stage);

  return stage;
}

async function showGlobalNarrativePages(pages, options = {}) {
  const overlay = ensureGlobalNarrativeOverlay();
  overlay.hidden = false;

  if (options.keepBlackAfter) {
    overlay.classList.add("keep-black");
  } else {
    overlay.classList.remove("keep-black");
  }

  for (const pageHtml of pages) {
    overlay.innerHTML = `
      <div class="global-narrative-text">
        ${pageHtml}
      </div>
    `;

    await waitForGlobalOverlayClick(overlay);
  }

  if (options.keepBlackAfter) {
    overlay.innerHTML = "";
    overlay.hidden = false;
    overlay.classList.add("keep-black");
  } else {
    overlay.hidden = true;
    overlay.innerHTML = "";
    overlay.classList.remove("keep-black");
  }
}

function waitForGlobalOverlayClick(overlay) {
  return new Promise((resolve) => {
    const handler = () => {
      overlay.removeEventListener("click", handler);
      resolve();
    };
    overlay.addEventListener("click", handler);
  });
}

async function playAndIRemainStorm(duration = 20000) {
  const layer = ensureGlobalRemainLayer();
  layer.hidden = false;
  layer.innerHTML = "";

  const fonts = [
    "Georgia",
    "Times New Roman",
    "serif",
    "Arial",
    "Verdana",
    "Courier New",
    "Palatino",
    "Garamond"
  ];

  const totalWords = 120;
  const words = [];

  for (let i = 0; i < totalWords; i += 1) {
    const word = document.createElement("div");
    word.className = "global-remain-word";
    word.textContent = "and I remain";

    const opacity = 0.08 + Math.random() * 0.78;

    word.style.left = `${Math.random() * 92}%`;
    word.style.top = `${Math.random() * 92}%`;
    word.style.setProperty("--remain-opacity", `${opacity}`);
    word.style.fontSize = `${14 + Math.random() * 76}px`;
    word.style.fontFamily = fonts[Math.floor(Math.random() * fonts.length)];
    word.style.animationDelay = `${Math.random() * 2.8}s`;

    layer.appendChild(word);
    words.push(word);
  }

  /*
    0-5s: one by one, slower
    5-10s: faster and denser
    10-20s: all remain visible
  */

  for (let i = 0; i < words.length; i += 1) {
    let delay;

    if (i < 38) {
      delay = (5000 / 38) * i;
    } else {
      delay = 5000 + (5000 / (totalWords - 38)) * (i - 38);
    }

    setTimeout(() => {
      words[i].classList.add("is-visible");
    }, delay);
  }

  await sleep(duration);

  layer.hidden = true;
  layer.innerHTML = "";
}

async function playGlobalHauntSequence() {
  const overlay = ensureGlobalNarrativeOverlay();
  overlay.hidden = false;
  overlay.classList.add("keep-black");
  overlay.innerHTML = "";

  const stage = ensureGlobalHauntStage();
  stage.hidden = false;
  stage.innerHTML = "";

  runGlobalBlink(() => {
    stage.innerHTML = `
      <img
        class="chase-spirit-close"
        src="${getChaseItemPath("spirit1.png")}"
        alt="Spirit"
      />
    `;
  });

  await sleep(980);

  const closeImg = stage.querySelector(".chase-spirit-close");
  if (closeImg) {
    closeImg.classList.add("zooming-out");
  }

  await sleep(320);

  runGlobalBlink(() => {
    stage.innerHTML = `
      <img
        class="chase-spirit-full"
        src="${getChaseItemPath("spirit.png")}"
        alt="Spirit"
      />
    `;
  });

  await sleep(980);

  runGlobalBlink();

  await sleep(260);

  stage.hidden = true;
  stage.innerHTML = "";
}

async function startPostGiftEndingSequence() {
  room4GiftState.panelOpen = false;
  renderRoom4GiftUI();

  /*
    Keep black after "And I remain."
    Do NOT haunt before the remain storm.
  */
  await showGlobalNarrativePages(postGiftDialoguePages, {
    keepBlackAfter: true
  });

  /*
    Directly enter the staged "and I remain" storm.
  */
  await playAndIRemainStorm(20000);

  /*
    Haunt only after the remain storm, before the final two lines.
  */
  await playGlobalHauntSequence();

  await showGlobalNarrativePages(finalEchoPages, {
    keepBlackAfter: true
  });

  closeWindowGracefully();
}

function closeWindowGracefully() {
  const overlay = ensureGlobalNarrativeOverlay();
  overlay.hidden = false;
  overlay.classList.add("keep-black");
  overlay.innerHTML = `
    <div class="global-narrative-text">
      <p>Closing...</p>
    </div>
  `;

  setTimeout(() => {
    window.open("", "_self");
    window.close();

    /*
      Most normal browser tabs cannot be closed by JavaScript.
      If blocked, show final ending text.
    */
    setTimeout(() => {
      overlay.innerHTML = `
        <div class="global-narrative-text">
          <p>The end.</p>
        </div>
      `;
    }, 500);
  }, 450);
}