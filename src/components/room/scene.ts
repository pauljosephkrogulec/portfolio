// La chambre : scène three.js low-poly, objets cliquables, la caméra s'approche puis ouvre un panneau.
// Tout est construit en formes simples et textures dessinées sur canvas (aucun modèle ni image externe).
import * as THREE from "three";
import gsap from "gsap";

export type PanelId = "projets" | "parcours" | "competences" | "apropos" | "opensource" | "contact";
export type ObjKey = "laptop" | "mangas" | "clavier" | "lego" | "katana" | "telephone";

export interface RoomOptions {
  canvas: HTMLCanvasElement;
  label: HTMLElement;
  font: string;
  monoFont: string;
  ownerName: string;
  onHover: (key: string | null) => void;
  onOpen: (panel: PanelId) => void;
  onFocusStart?: () => void;
}

export interface RoomHandle {
  go(key: ObjKey): void;
  close(): void;
  dispose(): void;
}

const LIME = "#bbff34";
const NIGHT = "#0b121f";

type M = string | THREE.Material;
const mat = (color: string, o: THREE.MeshStandardMaterialParameters = {}) =>
  new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.8, metalness: 0, ...o });
const toMat = (m: M) => (typeof m === "string" ? mat(m) : m);
function box(w: number, h: number, d: number, m: M, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), toMat(m));
  mesh.position.set(x, y, z);
  mesh.castShadow = mesh.receiveShadow = true;
  return mesh;
}
function cyl(rt: number, rb: number, h: number, m: M, seg = 10, x = 0, y = 0, z = 0) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), toMat(m));
  mesh.position.set(x, y, z);
  mesh.castShadow = mesh.receiveShadow = true;
  return mesh;
}

export function createRoom(o: RoomOptions): RoomHandle | null {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let renderer: THREE.WebGLRenderer;
  try {
    if (/[?&]nogl(&|$)/.test(location.search)) throw new Error("repli forcé"); // ?nogl teste la version simple
    renderer = new THREE.WebGLRenderer({ canvas: o.canvas, antialias: true });
  } catch {
    return null;
  }

  // toutes les animations gsap passent par ce contexte pour être tuées au démontage
  const ctx = gsap.context(() => {});
  const run = (fn: () => void) => ctx.add(fn);
  const timers: ReturnType<typeof setTimeout>[] = [];
  const later = (fn: () => void, ms: number) => timers.push(setTimeout(() => run(fn), ms));
  let disposed = false;

  const mobile = () => innerWidth < 700;
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile() ? 1.5 : 2));
  renderer.shadowMap.enabled = !mobile();
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.35;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(NIGHT);
  scene.fog = new THREE.Fog(NIGHT, 16, 30);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  const look = new THREE.Vector3(0, 0, 0.2);

  /* ---------- textures dessinées (redessinées quand les polices sont prêtes) ---------- */
  const drawn: { g: CanvasRenderingContext2D; draw: (g: CanvasRenderingContext2D) => void; t: THREE.CanvasTexture }[] = [];
  function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, flipY = true) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const g = c.getContext("2d")!;
    draw(g);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    t.flipY = flipY;
    drawn.push({ g, draw, t });
    return t;
  }
  const F = (weight: number | string, size: number, mono = false) => `${weight} ${size}px ${mono ? o.monoFont : o.font}`;
  document.fonts?.ready.then(() => {
    if (disposed) return;
    drawn.forEach(({ g, draw, t }) => {
      g.clearRect(0, 0, g.canvas.width, g.canvas.height);
      draw(g);
      t.needsUpdate = true;
    });
  });

  /* ---------- décor : bureau, mur, fenêtre, sol ---------- */
  const DESK_W = 10;
  const DESK_D = 5.6;
  const WALL_Z = -DESK_D / 2 - 0.04;
  scene.add(box(DESK_W, 0.3, DESK_D, mat("#6b4a32", { roughness: 0.9 }), 0, -0.15, 0));
  scene.add(box(DESK_W + 6, 0.1, 14, "#141a26", 0, -3, 2)); // sol
  scene.add(box(DESK_W + 6, 9, 0.3, "#2a3550", 0, 4.2, -DESK_D / 2 - 0.2)); // mur

  // fenêtre, lune et étoiles
  const win = new THREE.Group();
  win.position.set(-1.2, 3.1, -DESK_D / 2 - 0.03);
  const glass = box(4.2, 2.6, 0.05, mat("#0a1a3a", { emissive: "#0a1a3a", emissiveIntensity: 0.6 }));
  glass.castShadow = false;
  win.add(glass);
  const moon = new THREE.Mesh(new THREE.CircleGeometry(0.36, 24), new THREE.MeshBasicMaterial({ color: "#f5f1d6" }));
  moon.position.set(1.2, 0.6, 0.04);
  win.add(moon);
  for (let i = 0; i < 26; i++) {
    const s = new THREE.Mesh(
      new THREE.CircleGeometry(0.025 + Math.random() * 0.03, 5),
      new THREE.MeshBasicMaterial({ color: Math.random() < 0.3 ? LIME : "#ffffff" }),
    );
    s.position.set((Math.random() - 0.5) * 3.9, (Math.random() - 0.5) * 2.3, 0.04);
    win.add(s);
  }
  const frameCol = "#2a3550";
  win.add(
    box(4.4, 0.12, 0.12, frameCol, 0, 1.36, 0.05),
    box(4.4, 0.12, 0.12, frameCol, 0, -1.36, 0.05),
    box(0.12, 2.8, 0.12, frameCol, -2.16, 0, 0.05),
    box(0.12, 2.8, 0.12, frameCol, 2.16, 0, 0.05),
    box(0.08, 2.6, 0.08, frameCol, 0, 0, 0.05),
  );
  scene.add(win);

  // étagère sous la fenêtre : 5 livres de dev posés de face
  {
    const shelf = new THREE.Group();
    shelf.position.set(-1.2, 1.12, WALL_Z + 0.02);
    shelf.add(box(4.5, 0.07, 0.42, mat("#6b4a32", { roughness: 0.7 }), 0, 0, 0.21));
    [-1.9, 1.9].forEach((x) => shelf.add(box(0.06, 0.26, 0.3, mat("#2a2f3a", { roughness: 0.5 }), x, -0.15, 0.15)));
    const books: [string[], string, string][] = [
      [["CLEAN", "CODE"], "#1d3b3a", LIME],
      [["DOMAIN", "DRIVEN", "DESIGN"], "#e9ecef", "#1c2333"],
      [["REFAC-", "TORING"], "#2f6fde", "#ffffff"],
      [["THE", "PRAGMATIC", "PROGRAM-", "MER"], "#c9a46a", "#2a1a12"],
      [["DESIGN", "PATTERNS"], "#8b1d2c", "#f4efe3"],
    ];
    const H = 0.9;
    const gap = 0.82;
    books.forEach(([title, bg, fg], i) => {
      const w = H * 0.68;
      const book = new THREE.Group();
      book.position.set(-gap * 2 + i * gap, 0.035 + H / 2, 0.17);
      book.rotation.x = -0.1;
      book.rotation.z = (i % 2 ? 1 : -1) * 0.02;
      book.add(box(w, H, 0.07, mat(bg, { roughness: 0.6 })));
      book.add(box(w - 0.02, H - 0.02, 0.065, mat("#f4efe3", { roughness: 0.9 }), 0.012, 0, -0.004));
      const cover = new THREE.Mesh(
        new THREE.PlaneGeometry(w, H),
        new THREE.MeshStandardMaterial({
          roughness: 0.55,
          map: canvasTex(136, 200, (g) => {
            g.fillStyle = bg;
            g.fillRect(0, 0, 136, 200);
            g.fillStyle = fg;
            g.fillRect(12, 14, 112, 4);
            g.globalAlpha = 0.25;
            g.beginPath();
            g.arc(100, 160, 46, 0, 7);
            g.fill();
            g.globalAlpha = 1;
            g.font = F(700, title.length > 3 ? 17 : 20);
            title.forEach((line, k) => g.fillText(line, 12, 46 + k * 22));
            g.font = F(500, 10, true);
            g.fillText("// vol." + (i + 1), 12, 186);
          }),
        }),
      );
      cover.position.z = 0.036;
      book.add(cover);
      shelf.add(book);
    });
    scene.add(shelf);
  }

  // affiches au mur (dessinées)
  const posters: [number, number, number, (g: CanvasRenderingContext2D) => void][] = [
    [
      -4.5,
      2.5,
      -0.05,
      (g) => {
        g.fillStyle = "#4f5b93";
        g.fillRect(0, 0, 210, 294);
        g.fillStyle = "#f4efe3";
        g.font = F(700, 52, true);
        g.fillText("<?php", 18, 150);
        g.font = F(500, 14, true);
        g.fillText("declare(strict_types=1);", 18, 180);
        g.fillStyle = LIME;
        g.fillRect(18, 250, 60, 6);
      },
    ],
    [
      1.95,
      2.45,
      0.06,
      (g) => {
        g.fillStyle = "#101826";
        g.fillRect(0, 0, 210, 294);
        g.fillStyle = LIME;
        g.font = F(700, 58);
        g.textAlign = "center";
        g.fillText("{ API }", 105, 140);
        g.fillStyle = "#c8d1df";
        g.font = F(500, 15, true);
        g.fillText("REST · GraphQL · Hydra", 105, 178);
        g.strokeStyle = LIME;
        g.lineWidth = 3;
        g.strokeRect(12, 12, 186, 270);
      },
    ],
  ];
  posters.forEach(([x, y, r, draw]) => {
    const pw = 1.05;
    const ph = 1.47;
    const p = new THREE.Group();
    p.position.set(x, y, WALL_Z);
    p.rotation.z = r;
    p.add(box(pw + 0.08, ph + 0.08, 0.04, mat("#111", { flatShading: false, roughness: 0.5 })));
    const img = new THREE.Mesh(new THREE.PlaneGeometry(pw, ph), new THREE.MeshStandardMaterial({ map: canvasTex(210, 294, draw), roughness: 0.7 }));
    img.position.z = 0.025;
    p.add(img);
    scene.add(p);
  });

  /* ---------- lumières ---------- */
  const amb = new THREE.HemisphereLight("#b8c8ff", "#3a2a30", 1.1);
  const fill = new THREE.DirectionalLight("#fff1e0", 0.9);
  fill.position.set(2, 8, 6);
  const moonLight = new THREE.DirectionalLight("#9bb8ff", 1.2);
  moonLight.position.set(-3, 6, -6);
  scene.add(amb, fill, moonLight);

  // clair de lune projeté par la fenêtre (carreaux + croisillons) et faisceau léger
  const moonSpot = new THREE.SpotLight("#a9c4ff", 0, 16, 0.55, 0.35, 1.2);
  moonSpot.position.set(-1.6, 5.4, -2.5);
  moonSpot.target.position.set(-0.3, 0, 0.9);
  moonSpot.map = canvasTex(256, 256, (g) => {
    g.fillStyle = "#000";
    g.fillRect(0, 0, 256, 256);
    const grd = g.createRadialGradient(128, 128, 20, 128, 128, 128);
    grd.addColorStop(0, "#ffffff");
    grd.addColorStop(1, "#8090a0");
    g.fillStyle = grd;
    g.fillRect(28, 48, 200, 160);
    g.fillStyle = "#000";
    g.fillRect(124, 48, 8, 160);
    g.fillRect(28, 124, 200, 8);
  });
  moonSpot.castShadow = !mobile();
  moonSpot.shadow.mapSize.set(1024, 1024);
  moonSpot.shadow.bias = -0.0015;
  scene.add(moonSpot, moonSpot.target);
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(1.25, 2.1, 1, 4, 1, true),
    new THREE.MeshBasicMaterial({ color: "#9bb8ff", transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
  );
  {
    const from = new THREE.Vector3(-1.2, 3.1, -2.7);
    const to = new THREE.Vector3(-0.3, 0.02, 0.9);
    beam.scale.y = from.distanceTo(to);
    beam.position.copy(from).add(to).multiplyScalar(0.5);
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), to.clone().sub(from).normalize());
    beam.rotateY(Math.PI / 4);
  }
  scene.add(beam);
  const glassMat = glass.material as THREE.MeshStandardMaterial;
  function setNight(on: boolean) {
    gsap.to(moonSpot, { intensity: on ? 60 : 0, duration: 0.6, overwrite: true });
    gsap.to(beam.material, { opacity: on ? 0.06 : 0, duration: 0.6, overwrite: true });
    gsap.to(glassMat, { emissiveIntensity: on ? 1.6 : 0.6, duration: 0.6, overwrite: true });
    glassMat.emissive.set(on ? "#29467a" : "#0a1a3a");
  }

  const lampLight = new THREE.PointLight("#ffb86b", 34, 16, 1.5);
  lampLight.castShadow = !mobile();
  lampLight.shadow.mapSize.set(1024, 1024);
  lampLight.shadow.bias = -0.002;
  lampLight.position.set(-3.4, 1.4, -1.2);
  scene.add(lampLight);

  /* ---------- objets cliquables ---------- */
  interface ObjInfo {
    label: string;
    panel?: PanelId;
    action?: string;
    focus?: [number, number, number];
  }
  const objects = new Map<string, THREE.Group>();
  function addObject(key: string, group: THREE.Group, info: ObjInfo) {
    group.userData = { key, ...info };
    group.traverse((m) => {
      if ((m as THREE.Mesh).isMesh) m.userData.root = group;
    });
    objects.set(key, group);
    scene.add(group);
    return group;
  }

  // Laptop fermé couvert de stickers : s'ouvre sur le code de MangaDex
  const laptop = new THREE.Group();
  laptop.position.set(0, 0, 0.35);
  laptop.add(box(3, 0.12, 2, mat("#b8c0cc", { metalness: 0.15, roughness: 0.55 }), 0, 0.06, 0));
  {
    const k = new THREE.Group();
    k.position.set(0, 0.12, -0.3);
    const keyM = mat("#2a2f3a", { roughness: 0.7 });
    const kg = new THREE.BoxGeometry(0.15, 0.012, 0.14);
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 14; c++) {
        if (r === 4 && c > 3 && c < 10) continue;
        const m = new THREE.Mesh(kg, keyM);
        m.position.set(-1.2 + c * 0.185, 0.006, -0.5 + r * 0.17);
        k.add(m);
      }
    const space = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.012, 0.14), keyM);
    space.position.set(0, 0.006, 0.18);
    const pad = new THREE.Mesh(new THREE.BoxGeometry(1, 0.004, 0.55), mat("#a9b1bd", { roughness: 0.4 }));
    pad.position.set(0, 0.002, 0.72);
    k.add(space, pad);
    laptop.add(k);
  }
  const lid = new THREE.Group();
  lid.position.set(0, 0.12, -1); // charnière au fond
  lid.add(box(3, 0.08, 2, mat("#c9d0da", { metalness: 0.15, roughness: 0.55 }), 0, 0.04, 1));
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(2.7, 1.7),
    new THREE.MeshBasicMaterial({
      toneMapped: false,
      map: canvasTex(1024, 640, (g) => {
        g.fillStyle = "#0e1525";
        g.fillRect(0, 0, 1024, 640);
        g.fillStyle = "#151d2b";
        g.fillRect(0, 0, 1024, 52);
        ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => {
          g.fillStyle = c;
          g.beginPath();
          g.arc(28 + i * 26, 26, 8, 0, 7);
          g.fill();
        });
        g.fillStyle = "#8b97ab";
        g.font = F(500, 20, true);
        g.fillText("mangadex — api/src/Entity/Manga.php", 120, 33);
        const K = "#c792ea";
        const A = LIME;
        const T = "#e8edf5";
        const S = "#ffcb6b";
        const C = "#82aaff";
        const lines: [string, string][][] = [
          [["#[ApiResource(", A]],
          [["    operations: [", T], ["new ", K], ["Get", C], ["(), ", T], ["new ", K], ["GetCollection", C], ["()],", T]],
          [["    mercure: ", T], ["true", S], [",", T]],
          [[")]", A]],
          [["final class ", K], ["Manga", C]],
          [["{", T]],
          [["    #[ORM\\Id, ORM\\Column]", A]],
          [["    public ", K], ["?int ", C], ["$id = ", T], ["null", S], [";", T]],
          [["", T]],
          [["    #[ORM\\Column]", A]],
          [["    public ", K], ["string ", C], ["$title = ", T], ["''", S], [";", T]],
          [["}", T]],
        ];
        g.font = F(500, 26, true);
        lines.forEach((parts, i) => {
          let x = 70;
          g.fillStyle = "#3d4a63";
          g.fillText(String(i + 1).padStart(2, " "), 18, 104 + i * 40);
          parts.forEach(([txt, col]) => {
            g.fillStyle = col;
            g.fillText(txt, x, 104 + i * 40);
            x += g.measureText(txt).width;
          });
        });
        g.fillStyle = A;
        g.fillRect(70, 104 + 11 * 40 + 12, 14, 4);
      }),
    }),
  );
  screen.rotation.x = Math.PI / 2;
  screen.position.set(0, -0.012, 1);
  lid.add(screen);
  const stickers = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 2),
    new THREE.MeshStandardMaterial({
      transparent: true,
      alphaTest: 0.05,
      roughness: 0.6,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      map: canvasTex(600, 400, (g) => {
        const pill = (x: number, y: number, w: number, h: number, r: number, rot: number, bg: string, fg: string, txt: string, size: number) => {
          g.save();
          g.translate(x, y);
          g.rotate(rot);
          g.fillStyle = "#ffffff";
          g.beginPath();
          g.roundRect(-w / 2 - 5, -h / 2 - 5, w + 10, h + 10, r + 5);
          g.fill();
          g.fillStyle = bg;
          g.beginPath();
          g.roundRect(-w / 2, -h / 2, w, h, r);
          g.fill();
          g.fillStyle = fg;
          g.font = F(700, size);
          g.textAlign = "center";
          g.textBaseline = "middle";
          g.fillText(txt, 0, 2);
          g.restore();
        };
        pill(110, 90, 90, 90, 45, 0.2, LIME, NIGHT, "API", 30);
        pill(270, 80, 150, 64, 32, -0.12, "#777bb4", "#ffffff", "php 8.4", 30);
        pill(460, 100, 90, 90, 45, 0.1, "#111111", "#ffffff", "sf", 44);
        pill(130, 250, 150, 60, 14, -0.18, "#2496ed", "#ffffff", "docker", 30);
        pill(330, 230, 100, 70, 16, 0.15, "#f05032", "#ffffff", "git", 34);
        pill(490, 270, 130, 60, 30, -0.08, "#e10098", "#ffffff", "GraphQL", 26);
        pill(250, 340, 120, 56, 10, 0.05, NIGHT, LIME, "</>", 32);
      }),
    }),
  );
  stickers.rotation.x = -Math.PI / 2;
  stickers.position.set(0, 0.081, 1);
  stickers.userData.noGlow = true;
  lid.add(stickers);
  laptop.add(lid);
  addObject("laptop", laptop, { label: "Projets", panel: "projets", focus: [1.8, 4.6, 5.4] });

  // pile de mangas : un tome par étape du parcours
  const mangas = new THREE.Group();
  mangas.position.set(-2.6, 0, -1.55);
  ["#e84a3c", "#2f6fde", "#f2c230", "#1c1c1c", "#ff7aa2", "#3fbf8f"].forEach((c, i) => {
    const b = new THREE.Group();
    b.position.y = 0.1 + i * 0.2;
    b.rotation.y = (Math.random() - 0.5) * 0.35;
    b.add(box(1.25, 0.19, 0.9, mat("#f4efe3")), box(0.06, 0.2, 0.92, c, -0.62), box(1.25, 0.2, 0.06, c, 0, 0, 0.45));
    mangas.add(b);
  });
  addObject("mangas", mangas, { label: "Parcours", panel: "parcours", focus: [-1, 3, 1.8] });

  // clavier mécanique 60 %
  const clavier = new THREE.Group();
  clavier.position.set(-1.6, 0, 2.05);
  clavier.rotation.y = 0.06;
  clavier.add(box(2.6, 0.16, 0.95, "#20242e", 0, 0.08, 0));
  const keys: THREE.Mesh[] = [];
  const keyMat = [mat("#e9ecf2"), mat(LIME), mat("#9aa3b5")];
  for (let r = 0; r < 5; r++)
    for (let c = 0; c < 14; c++) {
      if (r === 4 && c > 2 && c < 11 && c !== 6) continue; // barre espace
      const isSpace = r === 4 && c === 6;
      const accent = (r === 0 && c === 0) || (r === 2 && c === 13);
      const k = box(isSpace ? 0.92 : 0.15, 0.1, 0.15, keyMat[accent ? 1 : c === 13 || c === 0 ? 2 : 0], -1.15 + c * 0.177 + (isSpace ? 0.35 : 0), 0.2, -0.36 + r * 0.18);
      k.userData.y0 = k.position.y;
      keys.push(k);
      clavier.add(k);
    }
  addObject("clavier", clavier, { label: "Compétences", panel: "competences", focus: [-0.3, 2.6, 4.2] });

  // figurine samouraï en Lego (à propos)
  const lego = new THREE.Group();
  lego.position.set(2.6, 0, -1.3);
  lego.rotation.y = -0.5;
  lego.scale.setScalar(1.2);
  lego.add(box(0.42, 0.1, 0.3, "#c0392b", 0, 0.05, 0));
  lego.add(box(0.18, 0.4, 0.22, "#2b2b2b", -0.1, 0.3, 0), box(0.18, 0.4, 0.22, "#2b2b2b", 0.1, 0.3, 0));
  lego.add(box(0.46, 0.45, 0.25, "#c0392b", 0, 0.72, 0), box(0.48, 0.08, 0.27, "#f1c40f", 0, 0.9, 0));
  lego.add(box(0.12, 0.38, 0.14, "#c0392b", -0.31, 0.72, 0), box(0.12, 0.38, 0.14, "#c0392b", 0.31, 0.72, 0));
  lego.add(cyl(0.15, 0.15, 0.26, "#f7d038", 12, 0, 1.08, 0));
  lego.add(cyl(0.27, 0.3, 0.1, "#1c1c1c", 8, 0, 1.24, 0), cyl(0.18, 0.22, 0.14, "#1c1c1c", 8, 0, 1.33, 0));
  const crest = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.025, 4, 10, Math.PI), mat("#f1c40f", { metalness: 0.6 }));
  crest.position.set(0, 1.42, 0.08);
  lego.add(crest, box(0.04, 0.8, 0.04, "#dfe6ee", 0.38, 0.95, 0.08));
  addObject("lego", lego, { label: "À propos", panel: "apropos", focus: [3.6, 2.6, 1.6] });

  // katana sur son support (open source)
  const katana = new THREE.Group();
  katana.position.set(-0.2, 0, -2.25);
  katana.add(box(3.6, 0.08, 0.5, "#2a1a12", 0, 0.04, 0));
  katana.add(box(0.12, 0.5, 0.4, "#2a1a12", -1.3, 0.3, 0), box(0.12, 0.5, 0.4, "#2a1a12", 1.3, 0.3, 0));
  const sword = new THREE.Group();
  sword.position.set(0, 0.55, 0);
  sword.add(box(2.6, 0.05, 0.1, mat("#e8eef5", { metalness: 0.9, roughness: 0.25 }), 0.45, 0, 0));
  sword.add(box(0.06, 0.2, 0.2, "#c9a227", -0.82, 0, 0), box(0.8, 0.1, 0.13, mat(LIME, { roughness: 0.6 }), -1.25, 0, 0));
  katana.add(sword);
  addObject("katana", katana, { label: "Open source", panel: "opensource", focus: [1.2, 2.8, 1.4] });

  // téléphone : sonne jusqu'à ce qu'on décroche (contact)
  const PHONE_POS = new THREE.Vector3(2.9, 0, 1.6);
  const PHONE_RY = -0.35;
  const telephone = new THREE.Group();
  telephone.position.copy(PHONE_POS);
  telephone.rotation.y = PHONE_RY;
  telephone.add(box(0.6, 0.07, 1.15, "#15171c", 0, 0.035, 0));
  const phoneFace = (state: "idle" | "ring" | "call") =>
    canvasTex(260, 525, (g) => {
      const grad = g.createLinearGradient(0, 0, 0, 525);
      grad.addColorStop(0, state === "idle" ? "#0e1830" : "#13294f");
      grad.addColorStop(1, NIGHT);
      g.fillStyle = grad;
      g.fillRect(0, 0, 260, 525);
      g.textAlign = "center";
      g.fillStyle = "#e8edf5";
      if (state === "idle") {
        g.font = F(600, 64);
        g.fillText("23:47", 130, 150);
        g.font = F(400, 18);
        g.fillStyle = "#8b97ab";
        g.fillText("mode nuit", 130, 185);
        return;
      }
      g.font = F(400, 16);
      g.fillStyle = "#8b97ab";
      g.fillText(state === "ring" ? "Appel entrant…" : "En ligne · 00:07", 130, 70);
      g.fillStyle = LIME;
      g.beginPath();
      g.arc(130, 170, 54, 0, 7);
      g.fill();
      g.fillStyle = NIGHT;
      g.font = F(700, 40);
      g.fillText("?", 130, 185);
      g.fillStyle = "#e8edf5";
      g.font = F(600, 30);
      g.fillText("Recruteur", 130, 270);
      g.font = F(400, 16);
      g.fillStyle = "#8b97ab";
      g.fillText(`veut parler à ${o.ownerName}`, 130, 298);
      if (state === "ring") {
        (
          [
            ["#e74c3c", 70, "✕"],
            ["#2ecc71", 190, "✆"],
          ] as const
        ).forEach(([col, x, sym]) => {
          g.fillStyle = col;
          g.beginPath();
          g.arc(x, 440, 32, 0, 7);
          g.fill();
          g.fillStyle = "#fff";
          g.font = "26px sans-serif";
          g.fillText(sym, x, 449);
        });
      } else {
        g.fillStyle = LIME;
        g.font = F(600, 20);
        g.fillText("Appel décroché ✓", 130, 445);
      }
    });
  const PHONE = { idle: phoneFace("idle"), ring: phoneFace("ring"), call: phoneFace("call") };
  const phoneMat = new THREE.MeshBasicMaterial({ map: PHONE.idle, toneMapped: false });
  const phoneScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 1.05), phoneMat);
  phoneScreen.rotation.x = -Math.PI / 2;
  phoneScreen.position.y = 0.072;
  telephone.add(phoneScreen);
  const setPhone = (state: keyof typeof PHONE) => {
    phoneMat.map = PHONE[state];
    phoneMat.color.set(state === "idle" ? "#9aa6c0" : "#ffffff");
  };
  addObject("telephone", telephone, { label: "Contact", panel: "contact", focus: [4.2, 2.6, 3.6] });

  // lampe de bureau : allume / éteint (mode nuit)
  const lampe = new THREE.Group();
  lampe.position.set(-4.4, 0, -1.9);
  lampe.rotation.y = 0.5;
  lampe.add(cyl(0.35, 0.4, 0.1, "#222", 14, 0, 0.05, 0));
  const arm = box(0.08, 1.6, 0.08, "#222", 0.25, 0.85, 0.2);
  arm.rotation.x = 0.3;
  lampe.add(arm);
  const shade = cyl(0.12, 0.45, 0.45, mat(LIME, { side: THREE.DoubleSide }), 14, 0.55, 1.65, 0.6);
  shade.rotation.x = 0.9;
  lampe.add(shade);
  const bulbMat = new THREE.MeshBasicMaterial({ color: "#ffe3b3" });
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 6), bulbMat);
  bulb.position.set(0.6, 1.5, 0.78);
  lampe.add(bulb);
  addObject("lampe", lampe, { label: "Lampe", action: "lampe" });

  // casque audio
  const casque = new THREE.Group();
  casque.position.set(4, 0.18, -0.2);
  casque.rotation.set(-Math.PI / 2 + 0.25, 0, 0.4);
  casque.add(new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.07, 6, 16, Math.PI), mat("#1d1d24")));
  casque.add(cyl(0.22, 0.22, 0.16, "#ff7aa2", 12, -0.55, 0, 0).rotateZ(Math.PI / 2), cyl(0.22, 0.22, 0.16, "#ff7aa2", 12, 0.55, 0, 0).rotateZ(Math.PI / 2));
  casque.traverse((m) => (m.castShadow = true));
  addObject("casque", casque, { label: "Musique", action: "casque" });

  // mug de café (décor)
  {
    const mug = new THREE.Group();
    mug.position.set(1.9, 0, 2.1);
    const cer = new THREE.MeshStandardMaterial({ color: "#f4efe3", roughness: 0.5, side: THREE.DoubleSide });
    const paroi = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.2, 0.42, 24, 1, true), cer);
    paroi.position.y = 0.21;
    paroi.castShadow = true;
    const fond = new THREE.Mesh(new THREE.CircleGeometry(0.2, 24), cer);
    fond.rotation.x = -Math.PI / 2;
    fond.position.y = 0.01;
    const cafe = new THREE.Mesh(new THREE.CircleGeometry(0.205, 24), new THREE.MeshStandardMaterial({ color: "#3b2416", roughness: 0.2 }));
    cafe.rotation.x = -Math.PI / 2;
    cafe.position.y = 0.34;
    const anse = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.03, 8, 16, Math.PI), cer);
    anse.position.set(0.23, 0.22, 0);
    anse.rotation.z = -Math.PI / 2;
    const bande = new THREE.Mesh(new THREE.CylinderGeometry(0.222, 0.218, 0.06, 24, 1, true), new THREE.MeshStandardMaterial({ color: LIME, side: THREE.DoubleSide }));
    bande.position.y = 0.3;
    mug.add(paroi, fond, cafe, anse, bande);
    scene.add(mug);
  }

  // bol de ramen : chaque clic le pousse vers le bord… jusqu'à la chute
  const BOL_HOME = new THREE.Vector3(-4, 0, 1.4);
  const bol = new THREE.Group();
  bol.position.copy(BOL_HOME);
  {
    const prof: THREE.Vector2[] = [];
    for (let i = 0; i <= 12; i++) {
      const a = (i / 12) * (Math.PI / 2);
      prof.push(new THREE.Vector2(0.18 + Math.sin(a) * 0.36, 0.02 + (1 - Math.cos(a)) * 0.38));
    }
    const bowlM = new THREE.MeshStandardMaterial({ color: "#c0392b", roughness: 0.35, side: THREE.DoubleSide });
    const bowl = new THREE.Mesh(new THREE.LatheGeometry(prof, 32), bowlM);
    bowl.castShadow = true;
    const pied = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 24), bowlM);
    pied.position.y = 0.02;
    const bord = new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.018, 8, 40), new THREE.MeshStandardMaterial({ color: "#f4efe3", roughness: 0.4 }));
    bord.rotation.x = Math.PI / 2;
    bord.position.y = 0.4;
    const bouillon = new THREE.Mesh(new THREE.CircleGeometry(0.5, 32), new THREE.MeshStandardMaterial({ color: "#e8b56a", roughness: 0.25 }));
    bouillon.rotation.x = -Math.PI / 2;
    bouillon.position.y = 0.31;
    bol.add(bowl, pied, bord, bouillon);
    const nouilleM = new THREE.MeshStandardMaterial({ color: "#f6e3a3", roughness: 0.6 });
    for (let i = 0; i < 9; i++) {
      const pts: THREE.Vector3[] = [];
      for (let t = 0; t <= 20; t++) pts.push(new THREE.Vector3(-0.3 + t * 0.03, 0.318 + Math.sin(t * 0.9 + i) * 0.01, -0.22 + i * 0.05 + Math.sin(t * 0.6 + i) * 0.03));
      bol.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.012, 5), nouilleM));
    }
    const oeuf = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: "#fff7e8", roughness: 0.4 }));
    oeuf.scale.set(1, 0.5, 1.25);
    oeuf.position.set(0.22, 0.31, 0.12);
    const jaune = new THREE.Mesh(new THREE.CircleGeometry(0.055, 16), new THREE.MeshStandardMaterial({ color: "#f39c12", roughness: 0.3 }));
    jaune.rotation.x = -Math.PI / 2;
    jaune.position.set(0.22, 0.368, 0.12);
    const naruto = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.02, 20), new THREE.MeshStandardMaterial({ color: "#fdf5f5" }));
    naruto.position.set(-0.2, 0.325, 0.2);
    const spirale = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.01, 6, 16), new THREE.MeshStandardMaterial({ color: "#ff7aa2" }));
    spirale.rotation.x = Math.PI / 2;
    spirale.position.set(-0.2, 0.338, 0.2);
    const nori = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.26, 0.01), new THREE.MeshStandardMaterial({ color: "#1f3a2a", roughness: 0.8 }));
    nori.position.set(-0.05, 0.4, -0.38);
    nori.rotation.x = -0.35;
    bol.add(oeuf, jaune, naruto, spirale, nori);
    const boisM = new THREE.MeshStandardMaterial({ color: "#d9b77a", roughness: 0.6 });
    [-0.04, 0.04].forEach((dz) => {
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 1.15, 8), boisM);
      c.rotation.z = Math.PI / 2;
      c.rotation.y = 0.5;
      c.position.set(0.1, 0.43, -0.05 + dz);
      c.castShadow = true;
      bol.add(c);
    });
  }
  addObject("bol", bol, { label: "Ramen", action: "bol" });

  // PC tour : vitres, ventilateurs RGB et lumière intérieure, allumé / éteint au clic
  const pc = new THREE.Group();
  pc.position.set(4.3, 0, -1.95);
  pc.rotation.y = -0.35;
  const pcRGB: THREE.MeshStandardMaterial[] = [];
  const pcFans: THREE.Group[] = [];
  {
    const white = mat("#eef1f6", { roughness: 0.5 });
    pc.add(box(0.9, 0.06, 1.4, white, 0, 0.03, 0), box(0.9, 0.06, 1.4, white, 0, 1.57, 0));
    pc.add(box(0.06, 1.6, 1.4, white, 0.42, 0.8, 0), box(0.9, 1.6, 0.06, white, 0, 0.8, -0.67));
    const verre = new THREE.MeshPhysicalMaterial({ color: "#d6ecff", transparent: true, opacity: 0.16, roughness: 0.05, depthWrite: false });
    const front = box(0.9, 1.6, 0.03, verre, 0, 0.8, 0.69);
    const side = box(0.03, 1.6, 1.4, verre, -0.44, 0.8, 0);
    [front, side].forEach((g) => {
      g.castShadow = false;
      g.userData.noGlow = true;
    });
    pc.add(front, side);
    pc.add(box(0.03, 1.3, 1.1, "#1b2420", 0.38, 0.85, -0.05)); // carte mère
    pc.add(box(0.5, 0.14, 0.85, "#20242e", 0.12, 0.62, -0.05), box(0.51, 0.03, 0.86, mat(LIME), 0.12, 0.7, -0.05)); // carte graphique
    pc.add(cyl(0.12, 0.12, 0.25, "#2a2f3a", 12, 0.24, 1.15, -0.15).rotateZ(Math.PI / 2)); // ventirad
    const blade = new THREE.BoxGeometry(0.06, 0.17, 0.01);
    [0.35, 0.8, 1.25].forEach((y, i) => {
      const f = new THREE.Group();
      f.position.set(0, y, 0.6);
      const ringM = mat("#ff3df2", { emissive: "#ff3df2", emissiveIntensity: 1.4, flatShading: false });
      ringM.toneMapped = false;
      ringM.userData.phase = i * 0.15;
      pcRGB.push(ringM);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.022, 8, 28), ringM);
      ring.userData.noGlow = true;
      f.add(ring);
      const hub = new THREE.Group();
      for (let b = 0; b < 5; b++) {
        const m = new THREE.Mesh(blade, mat("#2a2f3a"));
        m.position.set(0, 0.09, 0);
        const arm = new THREE.Group();
        arm.rotation.z = (b / 5) * Math.PI * 2;
        m.rotation.y = 0.5;
        arm.add(m);
        hub.add(arm);
      }
      f.add(hub);
      pcFans.push(hub);
      pc.add(f);
    });
  }
  const pcLight = new THREE.PointLight("#8fb8ff", 7, 3.2, 1.6);
  pcLight.position.set(0, 0.9, 0);
  pc.add(pcLight);
  addObject("pc", pc, { label: "PC", action: "pc" });

  // briques Lego : un clic assemble une petite tour, un second la démonte
  const briques = new THREE.Group();
  {
    const brick = (studsX: number, color: string) => {
      const g = new THREE.Group();
      const m = mat(color, { roughness: 0.45, flatShading: false });
      const w = studsX * 0.16;
      g.add(box(w, 0.19, 0.32, m));
      for (let i = 0; i < studsX; i++) for (let j = 0; j < 2; j++) g.add(cyl(0.045, 0.045, 0.05, m, 10, -w / 2 + 0.08 + i * 0.16, 0.12, -0.08 + j * 0.16));
      return g;
    };
    const homes: [number, string, number, number, number][] = [
      [4, "#d63a2f", 4.05, 1.75, 0.3],
      [2, "#2f6fde", 4.6, 2.2, -0.4],
      [2, "#f2c230", 3.8, 2.35, 0.9],
      [4, "#f4f4f4", 4.3, 1.95, 0],
      [2, "#3fbf8f", 4.3, 1.95, 0],
    ];
    homes.forEach(([n, c, x, z, r], i) => {
      const b = brick(n, c);
      b.position.set(x, 0.095, z);
      b.rotation.y = r;
      b.userData.home = { p: b.position.clone(), r };
      if (i > 2) b.scale.setScalar(0.0001); // briques bonus : apparaissent à la construction
      briques.add(b);
    });
  }
  addObject("briques", briques, { label: "Lego", action: "lego" });

  /* ---------- caméra : cadrage, survol, focus ---------- */
  const home = new THREE.Vector3();
  const homeLook = new THREE.Vector3(0, 0.65, -0.25);
  const portrait = () => camera.aspect < 0.8;
  let focused: THREE.Group | null = null;
  let busy = false;
  let locked = false; // un panneau est ouvert
  let refocusTimer: ReturnType<typeof setTimeout> | undefined;
  function frame() {
    const w = innerWidth;
    const h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    if (portrait()) {
      // téléphone : vue de dessus, le bureau dans la longueur de l'écran
      camera.up.set(-1, 0, 0);
      home.set(0, 21, 1.8);
      homeLook.set(-0.4, 0, 0);
    } else {
      camera.up.set(0, 1, 0);
      const k = Math.max(1, 1.55 / camera.aspect); // recule pour que le bureau tienne en largeur
      home.set(0, 8 * k, 8.3 * k);
      homeLook.set(0, 0.65, -0.25);
    }
    const fog = scene.fog as THREE.Fog;
    const d = home.length();
    fog.near = d * 1.1;
    fog.far = d * 2.4;
    camera.updateProjectionMatrix();
    if (!focused) {
      look.copy(homeLook);
      camera.position.copy(home);
    } else {
      clearTimeout(refocusTimer);
      refocusTimer = setTimeout(() => focused && run(() => void focusObject(focused!.userData.key)), 200);
    }
  }
  addEventListener("resize", frame);

  const ray = new THREE.Raycaster();
  const ptr = new THREE.Vector2();
  const mouse = { x: 0, y: 0 };
  let hovered: THREE.Group | null = null;
  const pickables = [...objects.values()];
  function pick(e: PointerEvent | MouseEvent): THREE.Group | null {
    ptr.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
    ray.setFromCamera(ptr, camera);
    const hit = ray.intersectObjects(pickables, true)[0];
    return hit ? (hit.object.userData.root ?? null) : null;
  }
  function glow(group: THREE.Group, on: boolean) {
    group.traverse((m) => {
      const mesh = m as THREE.Mesh;
      const mt = mesh.material as THREE.MeshStandardMaterial;
      if (!mesh.isMesh || !mt?.emissive || mesh.userData.noGlow || pcRGB.includes(mt)) return;
      if (!mesh.userData.orig) {
        mesh.userData.orig = mt;
        const hl = mt.clone();
        hl.emissive.set(LIME);
        hl.emissiveIntensity = 0.18;
        mesh.userData.hl = hl;
      }
      mesh.material = on ? mesh.userData.hl : mesh.userData.orig;
    });
  }
  function setHover(g: THREE.Group | null) {
    if (g === hovered) return;
    if (hovered) glow(hovered, false);
    hovered = g;
    o.onHover(g ? g.userData.key : null);
    if (g) {
      glow(g, true);
      o.label.textContent = g.userData.label;
      o.label.classList.add("on");
      o.canvas.style.cursor = "pointer";
    } else {
      o.label.classList.remove("on");
      o.canvas.style.cursor = "";
    }
  }
  const tmp = new THREE.Vector3();
  const bb = new THREE.Box3();
  function placeLabel() {
    if (!hovered) return;
    bb.setFromObject(hovered);
    tmp.set((bb.min.x + bb.max.x) / 2, bb.max.y, (bb.min.z + bb.max.z) / 2).project(camera);
    o.label.style.left = ((tmp.x + 1) / 2) * innerWidth + "px";
    o.label.style.top = ((1 - tmp.y) / 2) * innerHeight + "px";
  }

  const onMove = (e: PointerEvent) => {
    mouse.x = (e.clientX / innerWidth) * 2 - 1;
    mouse.y = (e.clientY / innerHeight) * 2 - 1;
    if (e.pointerType === "mouse" && !focused) setHover(pick(e));
  };
  const onLeave = () => setHover(null);
  const onClick = (e: MouseEvent) => {
    const g = pick(e);
    if (g) go(g.userData.key);
  };
  o.canvas.addEventListener("pointermove", onMove);
  o.canvas.addEventListener("pointerleave", onLeave);
  o.canvas.addEventListener("click", onClick);

  function tweenCam(pos: THREE.Vector3, target: THREE.Vector3, dur: number) {
    return new Promise<void>((res) => {
      gsap.killTweensOf([camera.position, look]);
      if (reduce) {
        camera.position.copy(pos);
        look.copy(target);
        return res();
      }
      gsap.to(camera.position, { x: pos.x, y: pos.y, z: pos.z, duration: dur, ease: "power3.inOut" });
      gsap.to(look, { x: target.x, y: target.y, z: target.z, duration: dur, ease: "power3.inOut", onComplete: () => res() });
      timers.push(setTimeout(res, dur * 1000 + 250)); // onglet en arrière-plan : l'animation peut ne jamais finir
    });
  }

  let ringTl: gsap.core.Timeline | null = null;
  function stopRing() {
    ringTl?.kill();
    ringTl = null;
    telephone.position.copy(PHONE_POS);
    telephone.rotation.y = PHONE_RY;
  }
  function startRing() {
    stopRing();
    setPhone("ring");
    if (reduce) return;
    ringTl = gsap.timeline({ repeat: -1, repeatDelay: 0.45 });
    ringTl
      .to(telephone.rotation, { y: PHONE_RY + 0.09, duration: 0.035, yoyo: true, repeat: 23, ease: "none" }, 0)
      .to(telephone.position, { x: PHONE_POS.x + 0.032, duration: 0.03, yoyo: true, repeat: 27, ease: "none" }, 0)
      .to(telephone.position, { y: 0.012, duration: 0.06, yoyo: true, repeat: 13, ease: "none" }, 0);
  }

  const ANIM: Record<string, (open: boolean) => void> = {
    laptop: (open) => gsap.to(lid.rotation, { x: open ? -1.85 : 0, duration: 0.9, ease: "power2.inOut" }),
    clavier: (open) =>
      open &&
      keys.forEach((k, i) =>
        gsap.to(k.position, { y: k.userData.y0 - 0.05, duration: 0.08, delay: (i % 14) * 0.02 + Math.random() * 0.3, yoyo: true, repeat: 1 }),
      ),
    lego: (open) => gsap.to(lego.rotation, { y: open ? 0.2 : -0.5, duration: 0.8, ease: "back.out(2)" }),
    katana: (open) => gsap.to(sword.position, { y: open ? 0.8 : 0.55, duration: 0.6, ease: "power2.out" }),
    telephone: (open) => {
      if (open) {
        stopRing();
        setPhone("call");
      } else startRing();
    },
    mangas: (open) =>
      mangas.children.forEach((b, i) => gsap.to(b.position, { x: open ? (i % 2 ? 0.12 : -0.12) : 0, duration: 0.5, delay: i * 0.04 })),
  };

  async function focusObject(key: string) {
    const g = objects.get(key)!;
    focused = g;
    setHover(null);
    bb.setFromObject(g);
    const c = bb.getCenter(new THREE.Vector3());
    if (portrait()) {
      const off = new THREE.Vector3(1.5, 0, 0); // l'objet reste visible au-dessus du panneau
      await tweenCam(c.clone().add(off).add(new THREE.Vector3(0, 7.5, 0.8)), c.clone().add(off), 1.1);
      return;
    }
    const f = g.userData.focus as [number, number, number];
    const k = Math.max(1, 1.2 / camera.aspect);
    await tweenCam(new THREE.Vector3(f[0], f[1] * k, f[2] * k), c.clone().add(new THREE.Vector3(1.4, 0, 0)), 1.1);
  }

  /* ---------- actions des objets sans panneau ---------- */
  let lampOn = false; // mode nuit au démarrage
  let pcOn = true;
  let legoBuilt = false;
  let legoBusy = false;
  let bolBusy = false;

  function legoToggle() {
    if (legoBusy) return;
    legoBusy = true;
    legoBuilt = !legoBuilt;
    const site = briques.children[3].userData.home as { p: THREE.Vector3; r: number };
    const ry = site.r;
    const local = (x: number, y: number) => new THREE.Vector3(site.p.x + x * Math.cos(ry), y, site.p.z - x * Math.sin(ry));
    const target = [local(0, 0.095), local(-0.16, 0.285), local(0.16, 0.285), local(0, 0.475), local(0, 0.665)];
    const tl = gsap.timeline({ onComplete: () => void (legoBusy = false) });
    briques.children.forEach((b, i) => {
      const h = b.userData.home as { p: THREE.Vector3; r: number };
      const to = legoBuilt ? target[i] : h.p;
      const at = legoBuilt ? i * 0.28 : (4 - i) * 0.15;
      tl.to(b.position, { x: to.x, z: to.z, duration: 0.4, ease: "power2.inOut" }, at)
        .to(b.position, { keyframes: [{ y: Math.max(to.y, b.position.y) + 0.5, duration: 0.2 }, { y: to.y, duration: 0.22, ease: "bounce.out" }] }, at)
        .to(b.rotation, { y: legoBuilt ? ry : h.r, duration: 0.4 }, at);
      if (i > 2) {
        const s = legoBuilt ? 1 : 0.0001;
        tl.to(b.scale, { x: s, y: s, z: s, duration: 0.3, ease: legoBuilt ? "back.out(2)" : "power2.in" }, legoBuilt ? at : at + 0.25);
      }
    });
  }

  const DESK_LEFT = -DESK_W / 2;
  function bolPush() {
    if (bolBusy) return;
    bolBusy = true;
    const next = bol.position.x - 0.28;
    if (next > DESK_LEFT + 0.15) {
      gsap
        .timeline({ onComplete: () => void (bolBusy = false) })
        .to(bol.position, { x: next, duration: 0.35, ease: "power2.out" })
        .to(bol.rotation, { x: 0.06, duration: 0.08, yoyo: true, repeat: 3 }, 0);
      return;
    }
    gsap
      .timeline({ onComplete: () => run(shatter) })
      .to(bol.position, { x: DESK_LEFT - 0.35, duration: 0.3, ease: "power1.in" })
      .to(bol.rotation, { z: 1.4, duration: 0.55, ease: "power1.in" }, 0.15)
      .to(bol.position, { y: -2.95, duration: 0.55, ease: "power2.in" }, 0.3);
  }
  function shatter() {
    const at = bol.position.clone();
    at.y = -2.9;
    bol.visible = false;
    const shards = new THREE.Group();
    scene.add(shards);
    const mats = [mat("#c0392b"), mat("#f4efe3"), mat("#f6e3a3")];
    for (let i = 0; i < 16; i++) {
      const m = new THREE.Mesh(new THREE.TetrahedronGeometry(0.07 + Math.random() * 0.1), mats[i % 3]);
      m.position.copy(at);
      m.castShadow = true;
      shards.add(m);
      const a = Math.random() * Math.PI * 2;
      const d = 0.4 + Math.random() * 1.1;
      gsap
        .timeline()
        .to(m.position, { x: at.x + Math.cos(a) * d, z: at.z + Math.sin(a) * d * 0.7, duration: 0.6, ease: "power2.out" })
        .to(m.position, { keyframes: [{ y: at.y + 0.3 + Math.random() * 0.5, duration: 0.25, ease: "power2.out" }, { y: at.y - 0.02, duration: 0.35, ease: "bounce.out" }] }, 0)
        .to(m.rotation, { x: Math.random() * 6, y: Math.random() * 6, duration: 0.6 }, 0);
    }
    later(() => {
      gsap.to(shards.scale, { x: 0.0001, y: 0.0001, z: 0.0001, duration: 0.4, onComplete: () => void scene.remove(shards) });
      bol.position.copy(BOL_HOME);
      bol.rotation.set(0, 0, 0);
      bol.scale.setScalar(0.0001);
      bol.visible = true;
      gsap.to(bol.scale, { x: 1, y: 1, z: 1, duration: 0.5, ease: "back.out(2)", onComplete: () => void (bolBusy = false) });
    }, 3200);
  }

  const fanSpeed = { v: 1 };
  function setPC(on: boolean) {
    pcOn = on;
    pcRGB.forEach((m) => gsap.to(m, { emissiveIntensity: on ? 1.4 : 0, duration: on ? 0.6 : 0.25, overwrite: true }));
    gsap.to(fanSpeed, { v: on ? 1 : 0, duration: on ? 1.2 : 2, overwrite: true });
    gsap.to(pcLight, { intensity: on ? 7 : 0, duration: on ? 0.6 : 0.25, overwrite: true });
  }

  let casqueBusy = false;
  const ACTION = {
    lego: legoToggle,
    pc: () => setPC(!pcOn),
    bol: bolPush,
    lampe() {
      lampOn = !lampOn;
      gsap.to(lampLight, { intensity: lampOn ? 34 : 0, duration: 0.25, overwrite: true });
      gsap.to(amb, { intensity: lampOn ? 1.1 : 0.45, duration: 0.25, overwrite: true });
      gsap.to(fill, { intensity: lampOn ? 0.9 : 0.2, duration: 0.25, overwrite: true });
      bulbMat.color.set(lampOn ? "#ffe3b3" : "#333");
      setNight(!lampOn);
    },
    casque() {
      if (casqueBusy) return;
      casqueBusy = true;
      gsap.fromTo(casque.rotation, { z: 0.3 }, { z: 0.5, duration: 0.12, yoyo: true, repeat: 5, onComplete: () => void ((casque.rotation.z = 0.4), (casqueBusy = false)) });
    },
  };

  // point d'entrée commun : clic 3D ou bouton de la barre
  function go(key: string) {
    if (busy || locked) return;
    const g = objects.get(key);
    if (!g) return;
    const action = g.userData.action as keyof typeof ACTION | undefined;
    if (action) return run(() => ACTION[action]());
    busy = true;
    locked = true;
    o.onFocusStart?.();
    run(() => {
      ANIM[key]?.(true);
      focusObject(key)
        .then(() => !disposed && o.onOpen(g.userData.panel))
        .finally(() => void (busy = false));
    });
  }
  function close() {
    if (!locked) return;
    busy = true;
    run(() => {
      if (focused) ANIM[focused.userData.key]?.(false);
      focused = null;
      tweenCam(home, homeLook, 1).finally(() => {
        busy = false;
        locked = false;
      });
    });
  }

  /* ---------- aura : halo vert qui pulse sous chaque objet cliquable ---------- */
  const auraTex = canvasTex(128, 128, (g) => {
    const gr = g.createRadialGradient(64, 64, 6, 64, 64, 64);
    gr.addColorStop(0, "rgba(255,255,255,.95)");
    gr.addColorStop(0.35, "rgba(255,255,255,.4)");
    gr.addColorStop(0.7, "rgba(255,255,255,.08)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
  });
  const auras: { m: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>; g: THREE.Group; off: THREE.Vector3; phase: number }[] = [];
  objects.forEach((g) => {
    bb.setFromObject(g);
    if (bb.isEmpty()) return;
    const c = bb.getCenter(new THREE.Vector3());
    const size = Math.max(bb.max.x - bb.min.x, bb.max.z - bb.min.z) * 1.3 + 0.45;
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: auraTex, color: LIME, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }),
    );
    m.rotation.x = -Math.PI / 2;
    m.scale.set(size, size, 1);
    m.renderOrder = -1;
    m.position.set(c.x, 0.015, c.z);
    scene.add(m);
    auras.push({ m, g, off: new THREE.Vector3(c.x - g.position.x, 0, c.z - g.position.z), phase: Math.random() * 6 });
  });

  /* ---------- démarrage ---------- */
  frame();
  run(() => {
    // mode nuit : lampe éteinte, clair de lune
    lampLight.intensity = 0;
    amb.intensity = 0.45;
    fill.intensity = 0.2;
    bulbMat.color.set("#333");
    setNight(true);
    startRing();
    setPC(true);
    if (reduce) return;
    busy = true; // pas de clic ni de parallaxe pendant l'entrée
    camera.position.set(0, 22, 4);
    look.set(0, 0, 0);
    gsap.to(camera.position, { x: home.x, y: home.y, z: home.z, duration: 2.2, ease: "power3.out", onComplete: () => void (busy = false) });
    gsap.to(look, { x: homeLook.x, y: homeLook.y, z: homeLook.z, duration: 2.2 });
  });
  later(() => {
    if (!locked) busy = false; // filet de sécurité si l'entrée ne se termine pas
  }, 2500);

  const clock = new THREE.Clock();
  renderer.setAnimationLoop(() => {
    const dt = clock.getDelta();
    const t = clock.elapsedTime;
    if (!focused && !busy) {
      camera.position.x += (home.x + mouse.x * 0.6 - camera.position.x) * 0.04;
      camera.position.y += (home.y - mouse.y * 0.3 - camera.position.y) * 0.04;
    }
    camera.lookAt(look);
    (moon.material as THREE.MeshBasicMaterial).color.setHSL(0.15, 0.5, 0.88 + Math.sin(t * 0.7) * 0.04);
    if (!reduce) pcFans.forEach((f, i) => (f.rotation.z -= dt * fanSpeed.v * (11 + i)));
    pcRGB.forEach((m) => {
      const c = m.emissive.setHSL((t * 0.08 + m.userData.phase) % 1, 1, 0.55);
      m.color.copy(c);
    });
    placeLabel();
    for (const a of auras) {
      a.m.visible = a.g.visible && !focused;
      a.m.position.x = a.g.position.x + a.off.x;
      a.m.position.z = a.g.position.z + a.off.z;
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.2 + a.phase);
      a.m.material.opacity = a.g === hovered ? 0.95 : 0.22 + 0.28 * pulse;
    }
    renderer.render(scene, camera);
  });

  return {
    go: (key) => go(key),
    close,
    dispose() {
      disposed = true;
      renderer.setAnimationLoop(null);
      ctx.revert();
      ringTl?.kill();
      timers.forEach(clearTimeout);
      clearTimeout(refocusTimer);
      removeEventListener("resize", frame);
      o.canvas.removeEventListener("pointermove", onMove);
      o.canvas.removeEventListener("pointerleave", onLeave);
      o.canvas.removeEventListener("click", onClick);
      scene.traverse((m) => {
        const mesh = m as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry.dispose();
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mt) => {
          (mt as THREE.MeshStandardMaterial).map?.dispose();
          mt.dispose();
        });
      });
      drawn.forEach(({ t }) => t.dispose());
      renderer.dispose();
    },
  };
}
