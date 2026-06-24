/**
 * Photo data for the birthday photo wall.
 * To add or replace photos, put images in public/photos/ and update this array.
 *
 * Each entry:
 *   src      - path relative to public/ (or absolute URL)
 *   caption  - shown below the polaroid
 *   flipText - hidden text revealed when the photo is flipped (Easter Egg #2)
 */
const BASE_URL = import.meta.env.BASE_URL;

const photos = [
  {
    src: `${BASE_URL}photos/1.png`,
    caption: '纵横四海,飞跃巅峰',
    flipText: '黄总威武',
  },
  {
    src: `${BASE_URL}photos/2.jpg`,
    caption: '美味大黄蟹',
    flipText: '大螃蟹黄总',
  },
  {
    src: `${BASE_URL}photos/3.jpg`,
    caption: '感恩的心~',
    flipText: '谢谢大小姐带我上百星。',
  },
  {
    src: `${BASE_URL}photos/4.jpg`,
    caption: 'Merry Christmas',
    flipText: '黄总的手绘圣诞，好看好看',
  },
  {
    src: `${BASE_URL}photos/5.jpg`,
    caption: '致敬传奇把妹王',
    flipText: '提一嘴就满足我，嘻嘻',
  },
  {
    src: `${BASE_URL}photos/6.jpg`,
    caption: '蛋糕投喂',
    flipText: '好吃,嘻嘻',
  },
];

export default photos;
