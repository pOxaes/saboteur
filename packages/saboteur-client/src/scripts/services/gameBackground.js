import liane1_001_svg from "../../assets/bg/001-liane-1.svg";
import liane2_001_svg from "../../assets/bg/001-liane-2.svg";
import liane1_002_svg from "../../assets/bg/002-liane-1.svg";
import liane2_002_svg from "../../assets/bg/002-liane-2.svg";
import liane1_003_svg from "../../assets/bg/003-liane-1.svg";
import liane2_003_svg from "../../assets/bg/003-liane-2.svg";
import liane1_004_svg from "../../assets/bg/004-liane-1.svg";
import liane2_004_svg from "../../assets/bg/004-liane-2.svg";
import liane1_005_svg from "../../assets/bg/005-liane-1.svg";
import liane2_005_svg from "../../assets/bg/005-liane-2.svg";
import branch_01_svg from "../../assets/bg/01-branch.svg";
import branche_02_svg from "../../assets/bg/02-branche.svg";
import leaves_03_svg from "../../assets/bg/03-leaves.svg";
import leaf_04_svg from "../../assets/bg/04-leaf.svg";
import leaf_05_svg from "../../assets/bg/05-leaf.svg";
import leaf_06_svg from "../../assets/bg/06-leaf.svg";
import leaf_07_svg from "../../assets/bg/07-leaf.svg";
import leaf_08_svg from "../../assets/bg/08-leaf.svg";
import branch_09_svg from "../../assets/bg/09-branch.svg";
import branch_10_svg from "../../assets/bg/10-branch.svg";

const elements = [
  { file: liane1_001_svg, x: -12, y: -10 },
  { file: liane2_001_svg, x: -1, y: -30 },
  { file: liane1_002_svg, x: 93, y: 0 },
  { file: liane2_002_svg, x: 93, y: 0 },
  { file: liane1_003_svg, x: 0, y: 5 },
  { file: liane2_003_svg, x: 0, y: 5 },
  { file: liane1_004_svg, x: -25, y: -3 },
  { file: liane2_004_svg, x: -25, y: -3 },
  { file: liane1_005_svg, x: 70, y: 0 },
  { file: liane2_005_svg, x: 70, y: 0 },
  { file: branch_01_svg, x: 90, y: 80 },
  { file: branche_02_svg, x: -5, y: 30 },
  { file: leaves_03_svg, x: 90, y: 85 },
  { file: leaf_04_svg, x: 10, y: 85 },
  { file: leaf_05_svg, x: 50, y: 89 },
  { file: leaf_06_svg, x: 20, y: -10 },
  { file: leaf_07_svg, x: 80, y: -20 },
  { file: leaf_08_svg, x: 30, y: 90 },
  { file: branch_09_svg, x: 5, y: 70 },
  { file: branch_10_svg, x: 70, y: 75 }
];

const flatElements = [
  {
    color: "#4a444e",
    offsetX: 2,
    points: [[100, 0], [100, 100], [90, 100], [75, 0]]
  },
  {
    color: "#46404a",
    offsetX: 12,
    points: [[100, 40], [100, 100], [50, 100]]
  },
  {
    color: "#46404a",
    offsetX: -7,
    points: [[0, 0], [47, 0], [0, 45]]
  },
  {
    color: "#4a444e",
    offsetX: -1,
    points: [[0, 30], [25, 100], [0, 100]]
  }
];
// TODO: load images outside

export function draw(ctx, { width, height }) {
  ctx.fillStyle = "#504a54";
  ctx.fillRect(0, 0, width, height);

  const gradient = ctx.createLinearGradient(0, height, 0, 0);
  gradient.addColorStop(0, "#5c5660");
  gradient.addColorStop(1, "#5a545e");
  ctx.beginPath();
  ctx.arc(width / 1.9, height / 2, height / 1.9, 0, 2 * Math.PI, false);
  ctx.fillStyle = gradient;
  ctx.fill();

  flatElements.forEach(element => {
    ctx.fillStyle = element.color;
    ctx.beginPath();
    const startPos = element.points[0];
    ctx.moveTo(startPos[0] / 100 * width, startPos[1] / 100 * height);
    element.points.forEach(([x, y], index) => {
      if (!index) {
        return;
      }
      ctx.lineTo((x + element.offsetX) / 100 * width, y / 100 * height);
    });
    ctx.closePath();
    ctx.fill();
  });

  elements.reverse().forEach(element => {
    if (!element.x && !element.y) {
      return;
    }
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, element.x / 100 * width, element.y / 100 * height);
    };
    img.src = element.file;
  });
}
