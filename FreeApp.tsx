import React, { useState, useCallback, useEffect, useRef } from 'react';
import LoadingSpinner from './components/LoadingSpinner';
import DOBInput from './components/DOBInput';
import CosmicConnection from './components/CosmicConnection';
import UsageManual from './components/UsageManual';

interface FreeDisplayedResult {
  names: { name1: string; name2: string };
  dateStr: string;
  title: string;
  summary: string;
  feeling: string;
  future: string;
  advice: string;
  hidden: string;
}

const DAILY_LIMIT = 5;

const STORAGE_KEYS = {
  fixedData: 'free_person1FixedData',
  pastNames: 'free_pastFortuneNames',
  latestResult: 'free_latest_fortune_result',
  usageDate: 'free_usageDate',
  usageCount: 'free_usageCount',
};

const NOTE_URL = 'https://note.com/like_swan6953/n/nf547dbe67453';

const bloodTypes = ['A', 'B', 'O', 'AB'];
const constellations = [
  '牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座',
  '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座'
];
const etos = [
  '子 (ね)', '丑 (うし)', '寅 (とら)', '卯 (う)', '辰 (たつ)', '巳 (み)',
  '午 (うま)', '未 (ひつじ)', '申 (さる)', '酉 (とり)', '戌 (いぬ)', '亥 (い)'
];
const relationships = ['恋人', '片思い', '夫婦', '友人', '仕事仲間', '商談相手'];

const zodiacElementMap: Record<string, 'fire' | 'earth' | 'air' | 'water'> = {
  牡羊座: 'fire',
  獅子座: 'fire',
  射手座: 'fire',
  牡牛座: 'earth',
  乙女座: 'earth',
  山羊座: 'earth',
  双子座: 'air',
  天秤座: 'air',
  水瓶座: 'air',
  蟹座: 'water',
  蠍座: 'water',
  魚座: 'water',
};

const etoGroupMap: Record<string, string> = {
  '子 (ね)': 'A',
  '辰 (たつ)': 'A',
  '申 (さる)': 'A',
  '丑 (うし)': 'B',
  '巳 (み)': 'B',
  '酉 (とり)': 'B',
  '寅 (とら)': 'C',
  '午 (うま)': 'C',
  '戌 (いぬ)': 'C',
  '卯 (う)': 'D',
  '未 (ひつじ)': 'D',
  '亥 (い)': 'D',
};

const bloodCompatibility: Record<string, Record<string, number>> = {
  A: { A: 8, B: 5, O: 7, AB: 6 },
  B: { A: 5, B: 7, O: 8, AB: 6 },
  O: { A: 7, B: 8, O: 7, AB: 6 },
  AB: { A: 6, B: 6, O: 6, AB: 8 },
};

function makeSeed(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickBySeed<T>(items: T[], seed: number): T {
  return items[seed % items.length];
}

function getBloodScore(a: string, b: string) {
  if (!a || !b) return 0;
  return bloodCompatibility[a]?.[b] ?? 0;
}

function getZodiacScore(a: string, b: string) {
  if (!a || !b) return 0;
  const ea = zodiacElementMap[a];
  const eb = zodiacElementMap[b];
  if (!ea || !eb) return 0;
  if (ea === eb) return 9;

  const goodPairs = [
    ['fire', 'air'],
    ['air', 'fire'],
    ['earth', 'water'],
    ['water', 'earth'],
  ];

  const mixedPairs = [
    ['fire', 'water'],
    ['water', 'fire'],
    ['earth', 'air'],
    ['air', 'earth'],
  ];

  if (goodPairs.some(([x, y]) => x === ea && y === eb)) return 7;
  if (mixedPairs.some(([x, y]) => x === ea && y === eb)) return 5;
  return 6;
}

function getEtoScore(a: string, b: string) {
  if (!a || !b) return 0;
  if (a === b) return 8;
  if (etoGroupMap[a] && etoGroupMap[a] === etoGroupMap[b]) return 8;
  return 6;
}

function getDobScore(dob: string) {
  if (!dob) return 0;
  return 4;
}

function getRelationshipScore(relationship: string) {
  switch (relationship) {
    case '恋人':
      return 8;
    case '片思い':
      return 6;
    case '夫婦':
      return 9;
    case '友人':
      return 6;
    case '仕事仲間':
      return 5;
    case '商談相手':
      return 4;
    default:
      return 0;
  }
}

function getOverallScore(
  bloodType1: string,
  constellation1: string,
  eto1: string,
  dob1: string,
  relationship: string,
  divinationDate: 'today' | 'tomorrow'
) {
  const dateBonus = divinationDate === 'tomorrow' ? 2 : 0;

  const score =
    45 +
    getBloodScore(bloodType1, bloodType1) +
    getZodiacScore(constellation1, constellation1) +
    getEtoScore(eto1, eto1) +
    getDobScore(dob1) +
    getRelationshipScore(relationship) +
    dateBonus;

  return Math.min(92, score);
}

function getScoreLabel(score: number, divinationDate: 'today' | 'tomorrow') {
  if (divinationDate === 'tomorrow') {
    if (score >= 82) return '進展が起こりやすいご縁';
    if (score >= 74) return '動き出しやすい相性';
    if (score >= 66) return '距離が縮まりやすい流れ';
    if (score >= 58) return '関係を進めやすい相性';
    return 'きっかけを作るほど伸びる相性';
  }

  if (score >= 82) return '非常に強いご縁';
  if (score >= 74) return '深く結ばれやすい相性';
  if (score >= 66) return 'かなり良い相性';
  if (score >= 58) return '育てるほど深まる相性';
  return '距離感を整えるほど伸びる相性';
}

function buildRelationshipText(relationship: string, name2: string) {
  switch (relationship) {
    case '恋人':
      return `${name2}さんとは、すでに気持ちが通い合っている一方で、言葉にしきれない感情も残りやすい関係です。`;
    case '片思い':
      return `${name2}さんとのご縁は、まだ形になっていないぶんだけ、水面下で印象が育ちやすい流れです。`;
    case '夫婦':
      return `${name2}さんとの関係は、恋愛感情だけでなく、安心感や信頼まで含めて深まりやすいご縁です。`;
    case '友人':
      return `${name2}さんとは、気軽さの中に特別な意味が育ちやすく、今後の空気が変わりやすい関係です。`;
    case '仕事仲間':
      return `${name2}さんとの関係は理性的に見えても、内面では印象が静かに積み重なりやすい流れです。`;
    case '商談相手':
      return `${name2}さんとのご縁は、誠実さや信頼を土台にしながら、少しずつ人としての相性が見えてきます。`;
    default:
      return `${name2}さんとの関係は、今見えている以上に心の奥で影響し合いやすい流れがあります。`;
  }
}

function buildBloodText(bloodType1: string) {
  switch (bloodType1) {
    case 'A':
      return 'あなたの誠実さと慎重さは、相手に安心感を与えやすい魅力です。';
    case 'B':
      return 'あなたの自然体な魅力は、相手の印象に残りやすく、心を動かしやすい流れです。';
    case 'O':
      return 'あなたの包容力は、相手の緊張をほどき、心を開かせやすい力になっています。';
    case 'AB':
      return 'あなたの理性と感性のバランスは、相手にとって魅力的で少し特別に映りやすいでしょう。';
    default:
      return 'あなたの気質には、相手の心に静かに残る魅力があります。';
  }
}

function buildZodiacText(constellation1: string, divinationDate: 'today' | 'tomorrow') {
  const element = zodiacElementMap[constellation1];

  if (divinationDate === 'tomorrow') {
    if (element === 'fire') return '明日はあなたの積極性が恋のきっかけを作りやすい流れです。';
    if (element === 'earth') return '明日はあなたの落ち着きと誠実さが関係を前進させやすい日です。';
    if (element === 'air') return '明日は会話や連絡の流れが関係を近づけやすい日です。';
    if (element === 'water') return '明日はやさしい気配りや空気感が相手の心を動かしやすい日です。';
    return '明日は関係が少し動きやすい追い風があります。';
  }

  if (element === 'fire') return '今はあなたの情熱や前向きさが、恋の流れを動かしやすい時期です。';
  if (element === 'earth') return '今はあなたの安定感や誠実さが、ご縁を育てる重要な鍵になっています。';
  if (element === 'air') return '今は会話や軽やかなやり取りが、関係を自然に近づけやすい流れです。';
  if (element === 'water') return '今は言葉以上に、雰囲気ややさしさが相手の心に深く届きやすい時期です。';
  return '今のご縁には、静かな追い風が吹いています。';
}

function buildDivinationDateText(divinationDate: 'today' | 'tomorrow') {
  if (divinationDate === 'today') {
    return '今日は表面の動きよりも、水面下の感情が大きく働きやすい日です。';
  }
  return '明日は停滞していた空気が少し動きやすく、新しいきっかけが生まれやすい日です。';
}

function buildFeelingText(
  score: number,
  name2: string,
  relationship: string,
  seed: number,
  divinationDate: 'today' | 'tomorrow'
) {
  const todayStrong = [
    `${name2}さんは、あなたに対して単なる好印象以上の意識を持っている可能性が高いです。今日は特に、表に出していない気持ちが内側で強まりやすい流れがあります。`,
    `${name2}さんの心の中には、あなたへの関心が静かに根を張っています。今日は慎重さが前に出やすいものの、本音そのものは軽くありません。`,
  ];
  const todayMiddle = [
    `${name2}さんは、あなたを気になる存在として見ています。ただし今日は感情をはっきり示すより、様子を見ながら距離感を測っている段階に近いでしょう。`,
    `${name2}さんの本音はまだ表に出切っていませんが、今日はあなたへの印象が内面で深まりやすい日です。`,
  ];
  const todaySoft = [
    `${name2}さんの気持ちは、まだ明確な形に固まり切っていないように見えます。ただ今日は、表面以上に内側で考えが進みやすい流れです。`,
    `${name2}さんは今の関係を慎重に見つめています。今日は動く前に確かめたい気持ちが強く出やすいでしょう。`,
  ];

  const tomorrowStrong = [
    `${name2}さんは、あなたへの意識を少し表に出しやすくなる流れです。明日は反応や接点の中に、気持ちの変化が見えやすくなる可能性があります。`,
    `${name2}さんの心の中にある関心は、明日になると行動や言葉ににじみやすくなります。今日は静かでも、明日は少し空気が変わりやすいでしょう。`,
  ];
  const tomorrowMiddle = [
    `${name2}さんは、あなたを気になる存在として見ています。そして明日は、その気持ちが今日より少し表面化しやすい流れです。`,
    `${name2}さんの本音はまだ慎重ですが、明日はやり取りの中で距離が縮まりやすく、反応が柔らかくなる可能性があります。`,
  ];
  const tomorrowSoft = [
    `${name2}さんの気持ちはまだ定まり切っていませんが、明日は関係を進める小さなきっかけが生まれやすい日です。`,
    `${name2}さんは今の関係を慎重に見ていますが、明日は普段より少しだけ心を開きやすい流れがあります。`,
  ];

  const strong = divinationDate === 'today' ? todayStrong : tomorrowStrong;
  const middle = divinationDate === 'today' ? todayMiddle : tomorrowMiddle;
  const soft = divinationDate === 'today' ? todaySoft : tomorrowSoft;

  let baseText =
    score >= 74 ? pickBySeed(strong, seed) :
    score >= 62 ? pickBySeed(middle, seed) :
    pickBySeed(soft, seed);

  if (relationship === '片思い') {
    baseText += divinationDate === 'today'
      ? ' 片思いでは、今日は今見える態度だけで判断しすぎないことが大切です。'
      : ' 片思いでは、明日の小さな反応や会話の変化を見逃さないことが大切です。';
  } else if (relationship === '恋人') {
    baseText += divinationDate === 'today'
      ? ' 恋人関係では、今日は言葉より表情や空気の中に本音が出やすいでしょう。'
      : ' 恋人関係では、明日は素直なやり取りが増えやすい流れです。';
  }

  return baseText;
}

function buildFutureText(
  score: number,
  relationship: string,
  divinationDate: 'today' | 'tomorrow',
  seed: number
) {
  const todayStrong = [
    '今日の流れでは、このご縁は静かに深まるほど強くなる相性です。大きく動かすより、安心感と信頼を積み重ねることが最も重要になります。',
    '今日は少し見えにくい感情が、水面下で育ちやすい流れです。今すぐの変化より、後から効いてくる接点を大切にする日です。',
  ];
  const todayMiddle = [
    '今日の流れは悪くありませんが、相手のペースを尊重することがかなり重要です。押しすぎると慎重さが強まりやすい日です。',
    '今日は“気づけば印象が深く残っていた”という形になりやすい流れです。焦らず、落ち着いたやり取りが未来につながります。',
  ];
  const todaySoft = [
    '今日は関係を大きく動かす日というより、土台を整える日です。今は確信を急がず、好印象を安定して積み重ねることが先決になります。',
    '今日の運気では、勢いで押すほど空回りしやすく、丁寧さを見せるほど後の流れが整いやすくなります。',
  ];

  const tomorrowStrong = [
    '明日の流れでは、このご縁は静かな関係から一歩進みやすい相性です。小さな接点や会話が、大きな進展のきっかけになる可能性があります。',
    '明日は、今まで見えにくかった気持ちが少し形になりやすい流れです。タイミングが合えば、空気が一段やわらかく変わるでしょう。',
  ];
  const tomorrowMiddle = [
    '明日の流れは悪くありません。相手のペースを尊重しながらも、今日より一歩だけ近づく意識を持つと関係が動きやすくなります。',
    '明日は“きっかけ作り”に向いている日です。急展開ではなくても、距離が縮まり始めるサインが出やすいでしょう。',
  ];
  const tomorrowSoft = [
    '明日は関係を少し前に進めるチャンスがあります。強く押すより、自然な会話や柔らかい接点が流れを変えやすい日です。',
    '明日の運気では、慎重な関係でも停滞を抜ける小さな変化が起きやすくなります。今はきっかけを作る意識が大切です。',
  ];

  const strong = divinationDate === 'today' ? todayStrong : tomorrowStrong;
  const middle = divinationDate === 'today' ? todayMiddle : tomorrowMiddle;
  const soft = divinationDate === 'today' ? todaySoft : tomorrowSoft;

  let text =
    score >= 74 ? pickBySeed(strong, seed) :
    score >= 62 ? pickBySeed(middle, seed) :
    pickBySeed(soft, seed);

  if (relationship === '夫婦') {
    text += divinationDate === 'today'
      ? ' 夫婦では、今日は安心して戻れる居場所をどう整えるかが鍵になります。'
      : ' 夫婦では、明日は素直な言葉や小さな気づかいが関係を温めやすいでしょう。';
  } else if (relationship === '友人') {
    text += divinationDate === 'today'
      ? ' 友人関係では、今日は自然さを保つことが特に重要です。'
      : ' 友人関係では、明日は自然さを保ったまま距離を縮めやすい流れです。';
  }

  return text;
}

function buildAdviceText(score: number, bloodType1: string, relationship: string, divinationDate: 'today' | 'tomorrow') {
  let advice = '';

  if (divinationDate === 'today') {
    if (score >= 74) {
      advice = '今日は、駆け引きを増やすより“安心して話せる空気”を作る方が結果につながります。';
    } else if (score >= 62) {
      advice = '今日は答えを急がず、会話の温度や返し方を丁寧に整えることが大切です。';
    } else {
      advice = '今日は結果を急がず、心地よい距離感を守ることがいちばん重要です。';
    }
  } else {
    if (score >= 74) {
      advice = '明日は、少しだけ素直さや前向きな反応を見せることで関係が進みやすくなります。';
    } else if (score >= 62) {
      advice = '明日は小さな接点を増やす意識が大切です。短い会話や軽いリアクションでも十分効果があります。';
    } else {
      advice = '明日は強く押すより、自然なきっかけ作りを意識すると流れが整いやすくなります。';
    }
  }

  if (bloodType1 === 'A') {
    advice += divinationDate === 'today'
      ? ' あなたは我慢を言葉にしない傾向があるため、落ち着いた本音を少し見せると良いでしょう。'
      : ' あなたは慎重になりやすいため、明日は少しだけ分かりやすい好意を見せると流れが動きやすくなります。';
  } else if (bloodType1 === 'B') {
    advice += divinationDate === 'today'
      ? ' あなたの自然体は魅力ですが、今日は落ち着きも添えると印象が深まりやすくなります。'
      : ' あなたの自然体は魅力なので、明日はそのままの軽やかさを活かすと距離が縮まりやすくなります。';
  } else if (bloodType1 === 'O') {
    advice += divinationDate === 'today'
      ? ' 包容力に頼りすぎず、ときにはあなた自身の本音も出した方が心の結びつきは深まります。'
      : ' 明日はあなたの包容力が相手の緊張をほどきやすい日です。やさしい一言が効果的です。';
  } else if (bloodType1 === 'AB') {
    advice += divinationDate === 'today'
      ? ' 今日は関心や好意を少し分かりやすく伝えるほど、流れが整いやすくなるでしょう。'
      : ' 明日は読みにくさより親しみやすさを意識すると、相手が近づきやすくなります。';
  }

  if (relationship === '片思い') {
    advice += divinationDate === 'today'
      ? ' 片思いでは特に、“重さ”ではなく“余韻”を残すことが鍵です。'
      : ' 片思いでは、明日の小さな接点を前向きに使うことが鍵です。';
  }

  return advice;
}

function buildHiddenText(name2: string, score: number, seed: number, divinationDate: 'today' | 'tomorrow') {
  const todayIntros = [
    `${name2}さんがまだ表に出していない本音には、あなたが想像しているよりも深い感情が隠れています。`,
    `${name2}さんとのご縁には、今日の静かな流れの中で大きく意味を持つ“決定的な感情”が潜んでいます。`,
  ];

  const tomorrowIntros = [
    `${name2}さんとのご縁には、明日から流れを変える“決定的なきっかけ”が控えています。`,
    `${name2}さんが明日見せやすくなる本音には、関係を前へ進める大切なヒントが隠れています。`,
  ];

  const middles = [
    '完全版では、相手の本音、今後の進展、関係が動く時期まで詳しく読み解けます。',
    '完全版では、このご縁が恋愛として深まる可能性と、避けるべき行動まで具体的に分かります。',
    '完全版では、相手が心の中で何をためらっているのか、そして次に起こりやすい展開まで深掘りできます。',
  ];

  const closers =
    score >= 74
      ? '今の相性が強いからこそ、最後の一手を知ることが大切です。'
      : 'このご縁を良い流れへ変えるためには、核心部分の読み解きが鍵になります。';

  const intros = divinationDate === 'today' ? todayIntros : tomorrowIntros;

  return `${pickBySeed(intros, seed)}\n\n${pickBySeed(middles, seed + 5)}\n\n${closers}`;
}

function createFreePremiumStyleFortune(params: {
  name2: string;
  bloodType1: string;
  constellation1: string;
  eto1: string;
  dob1: string;
  relationship: string;
  divinationDate: 'today' | 'tomorrow';
}): Omit<FreeDisplayedResult, 'names' | 'dateStr'> {
  const {
    name2,
    bloodType1,
    constellation1,
    eto1,
    dob1,
    relationship,
    divinationDate,
  } = params;

  const seed = makeSeed(
    `${name2}|${bloodType1}|${constellation1}|${eto1}|${dob1}|${relationship}|${divinationDate}`
  );

  const score = getOverallScore(
    bloodType1,
    constellation1,
    eto1,
    dob1,
    relationship,
    divinationDate
  );

  const label = getScoreLabel(score, divinationDate);

  const title =
    divinationDate === 'today'
      ? `今日の二人は「${label}」の流れに入っています`
      : `明日の二人は「${label}」の流れに入っています`;

  const summary = [
    divinationDate === 'today'
      ? `${name2}さんとの相性は、今日は水面下で深まりやすい流れがあります。`
      : `${name2}さんとの相性は、明日に向けて少し動きやすい流れがあります。`,
    buildRelationshipText(relationship, name2),
    buildBloodText(bloodType1),
    `${buildZodiacText(constellation1, divinationDate)} ${buildDivinationDateText(divinationDate)}`,
  ].join('\n');

  const feeling = buildFeelingText(score, name2, relationship, seed + 1, divinationDate);
  const future = buildFutureText(score, relationship, divinationDate, seed + 2);
  const advice = buildAdviceText(score, bloodType1, relationship, divinationDate);
  const hidden = buildHiddenText(name2, score, seed + 3, divinationDate);

  return { title, summary, feeling, future, advice, hidden };
}

function getMissingFields(params: {
  bloodType1: string;
  constellation1: string;
  eto1: string;
  dob1: string;
  name2: string;
  relationship: string;
}) {
  const missing: string[] = [];

  if (!params.bloodType1) missing.push('血液型');
  if (!params.constellation1) missing.push('星座');
  if (!params.eto1) missing.push('干支');
  if (!params.dob1) missing.push('生年月日');
  if (!params.name2.trim()) missing.push('お相手の名前');
  if (!params.relationship) missing.push('現在の関係性');

  return missing;
}

const FreeApp: React.FC = () => {
  const [bloodType1, setBloodType1] = useState<string>('');
  const [constellation1, setConstellation1] = useState<string>('');
  const [eto1, setEto1] = useState<string>('');
  const [dob1, setDob1] = useState<string>('');
  const [isPerson1Fixed, setIsPerson1Fixed] = useState<boolean>(false);

  const [name2, setName2] = useState<string>('');
  const [pastNames, setPastNames] = useState<string[]>([]);

  const [relationship, setRelationship] = useState<string>('');
  const [divinationDate, setDivinationDate] = useState<'today' | 'tomorrow'>('today');
  const [displayedResult, setDisplayedResult] = useState<FreeDisplayedResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isManualOpen, setIsManualOpen] = useState<boolean>(false);
  const [usageCount, setUsageCount] = useState<number>(0);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string>('');
  const submitLockRef = useRef(false);

  useEffect(() => {
    try {
      const fixedDataString = localStorage.getItem(STORAGE_KEYS.fixedData);
      if (fixedDataString) {
        const fixedData = JSON.parse(fixedDataString);
        if (fixedData.isFixed) {
          setIsPerson1Fixed(true);
          setBloodType1(fixedData.bloodType || '');
          setConstellation1(fixedData.constellation || '');
          setEto1(fixedData.eto || '');
          setDob1(fixedData.dob || '');
        }
      }

      const storedNames = localStorage.getItem(STORAGE_KEYS.pastNames);
      if (storedNames) {
        setPastNames(JSON.parse(storedNames));
      }

      const savedResult = localStorage.getItem(STORAGE_KEYS.latestResult);
      if (savedResult) {
        setDisplayedResult(JSON.parse(savedResult));
        setLastSaved('復元済み');
      }

      const today = new Date().toLocaleDateString();
      const lastDate = localStorage.getItem(STORAGE_KEYS.usageDate);
      const count = parseInt(localStorage.getItem(STORAGE_KEYS.usageCount) || '0', 10);

      if (lastDate !== today) {
        localStorage.setItem(STORAGE_KEYS.usageDate, today);
        localStorage.setItem(STORAGE_KEYS.usageCount, '0');
        setUsageCount(0);
      } else {
        setUsageCount(count);
      }
    } catch (e) {
      console.error('Failed to load state', e);
    }
  }, []);

  useEffect(() => {
    if (displayedResult) {
      localStorage.setItem(STORAGE_KEYS.latestResult, JSON.stringify(displayedResult));
      setLastSaved(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    }
  }, [displayedResult]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isLoading || (name2 && !displayedResult)) {
        e.preventDefault();
        e.returnValue = '入力内容や鑑定結果が消去されますがよろしいですか？';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isLoading, name2, displayedResult]);

  useEffect(() => {
    try {
      if (isPerson1Fixed) {
        const fixedData = {
          isFixed: true,
          bloodType: bloodType1,
          constellation: constellation1,
          eto: eto1,
          dob: dob1,
        };
        localStorage.setItem(STORAGE_KEYS.fixedData, JSON.stringify(fixedData));
      } else {
        localStorage.removeItem(STORAGE_KEYS.fixedData);
      }
    } catch (e) {
      console.error('Failed to save fixed data', e);
    }
  }, [isPerson1Fixed, bloodType1, constellation1, eto1, dob1]);

  useEffect(() => {
    const existingScript = document.getElementById('busuanzi-script');
    if (existingScript) return;

    const script = document.createElement('script');
    script.id = 'busuanzi-script';
    script.src = '//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleRelationshipChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRelationship(e.target.value);
    setError(null);
  };

  const handleDeleteHistory = useCallback((nameToDelete: string) => {
    const newPastNames = pastNames.filter((name) => name !== nameToDelete);
    setPastNames(newPastNames);
    localStorage.setItem(STORAGE_KEYS.pastNames, JSON.stringify(newPastNames));
  }, [pastNames]);

  const handleFortuneTell = useCallback(async () => {
    if (submitLockRef.current) return;
    if (usageCount >= DAILY_LIMIT) return;

    const missingFields = getMissingFields({
      bloodType1,
      constellation1,
      eto1,
      dob1,
      name2,
      relationship,
    });

    if (missingFields.length > 0) {
      setError(`未入力です：${missingFields.join('、')}`);
      return;
    }

    submitLockRef.current = true;
    setIsLoading(true);
    setError(null);
    setStatusText(
      divinationDate === 'today'
        ? '本日の運命の流れを読み解いています...'
        : '明日の運命の流れを読み解いています...'
    );

    const targetDate = new Date();
    if (divinationDate === 'tomorrow') {
      targetDate.setDate(targetDate.getDate() + 1);
    }
    const dateStr = `${targetDate.getFullYear()}年${targetDate.getMonth() + 1}月${targetDate.getDate()}日`;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      const generated = createFreePremiumStyleFortune({
        name2,
        bloodType1,
        constellation1,
        eto1,
        dob1,
        relationship,
        divinationDate,
      });

      const resultData: FreeDisplayedResult = {
        ...generated,
        names: { name1: 'あなた', name2: name2 || 'お相手' },
        dateStr,
      };

      setDisplayedResult(resultData);
      setStatusText('');

      if (name2 && !pastNames.includes(name2)) {
        const newPastNames = [name2, ...pastNames].slice(0, 10);
        setPastNames(newPastNames);
        localStorage.setItem(STORAGE_KEYS.pastNames, JSON.stringify(newPastNames));
      }

      const newCount = usageCount + 1;
      setUsageCount(newCount);
      localStorage.setItem(STORAGE_KEYS.usageCount, newCount.toString());
    } catch (err) {
      console.error(err);
      setStatusText('');
      setError('鑑定結果の生成に失敗しました。もう一度お試しください。');
    } finally {
      setIsLoading(false);
      window.setTimeout(() => {
        submitLockRef.current = false;
      }, 800);
    }
  }, [
    name2,
    bloodType1,
    constellation1,
    eto1,
    dob1,
    relationship,
    divinationDate,
    pastNames,
    usageCount
  ]);

  const getFormattedDate = (type: 'today' | 'tomorrow') => {
    const date = new Date();
    if (type === 'tomorrow') date.setDate(date.getDate() + 1);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const createStars = (count: number) => {
    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 2 + 1;
      return (
        <div
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `twinkle ${Math.random() * 5 + 3}s linear infinite`,
          }}
        />
      );
    });
  };

  const inputBaseClasses =
    'w-full px-4 py-3 bg-gray-900/40 border border-fuchsia-900/50 focus:border-fuchsia-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500/50 transition-all duration-300 disabled:opacity-50 disabled:bg-gray-800/80 hover:border-fuchsia-700/50';

  return (
    <div className="relative min-h-screen w-full bg-[#05020a] text-white flex flex-col items-center justify-center p-4 overflow-x-hidden font-sans">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#581c87] via-[#1e1b4b] to-[#000000] z-0"></div>
      <div className="absolute inset-0 z-0 opacity-60">{createStars(150)}</div>

      <style>{`
        @keyframes twinkle {
          0% { opacity: 0; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0; transform: scale(0.8); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        select {
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23a78bfa%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
          background-repeat: no-repeat;
          background-position: right 1rem center;
          background-size: .65em auto;
          padding-right: 2.5rem;
        }
      `}</style>

      <UsageManual isOpen={isManualOpen} onClose={() => setIsManualOpen(false)} />

      <main className="z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-fade-in-up">
          <div className="w-full lg:w-3/5 p-6 md:p-10 relative z-10">
            <header className="mb-8 flex justify-between items-start">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-[linear-gradient(to_right,#f87171,#fb923c,#facc15,#4ade80,#60a5fa,#818cf8,#c084fc)] mb-2">
                  AI相性占い
                </h1>
                <p className="text-fuchsia-200/60 text-sm tracking-wider">
                  二人の星が織りなす、運命の物語
                </p>
              </div>

              <div className="flex flex-col items-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualOpen(true)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className="p-2 bg-fuchsia-900/40 rounded-full border border-fuchsia-500/30 text-fuchsia-300 transition-all group-hover:bg-fuchsia-800/60 shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
                    </svg>
                  </div>
                  <span className="text-[10px] text-fuchsia-300/70">取説</span>
                </button>

                {lastSaved && (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-green-900/20 border border-green-500/30 rounded text-[10px] text-green-300 animate-pulse">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    自動保存済み {lastSaved !== '復元済み' && `(${lastSaved})`}
                  </div>
                )}
              </div>
            </header>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2 mb-2">
                    <h3 className="text-lg font-semibold text-fuchsia-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-fuchsia-400 shadow-[0_0_10px_rgba(232,121,249,0.8)]"></span>
                      あなた
                    </h3>
                    <div className="flex items-center">
                      <input
                        id="fix-person1"
                        type="checkbox"
                        checked={isPerson1Fixed}
                        onChange={(e) => setIsPerson1Fixed(e.target.checked)}
                        className="h-5 w-5 rounded text-fuchsia-600 bg-transparent cursor-pointer"
                      />
                      <label htmlFor="fix-person1" className="ml-2 text-sm md:text-base text-slate-300 cursor-pointer font-medium">
                        情報を固定
                      </label>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={bloodType1}
                        onChange={(e) => {
                          setBloodType1(e.target.value);
                          setError(null);
                        }}
                        className={inputBaseClasses}
                        disabled={isLoading}
                      >
                        <option value="" disabled>血液型</option>
                        {bloodTypes.map((bt) => <option key={bt} value={bt}>{bt}型</option>)}
                      </select>

                      <select
                        value={eto1}
                        onChange={(e) => {
                          setEto1(e.target.value);
                          setError(null);
                        }}
                        className={inputBaseClasses}
                        disabled={isLoading}
                      >
                        <option value="" disabled>干支</option>
                        {etos.map((e) => <option key={e} value={e}>{e}</option>)}
                      </select>
                    </div>

                    <select
                      value={constellation1}
                      onChange={(e) => {
                        setConstellation1(e.target.value);
                        setError(null);
                      }}
                      className={inputBaseClasses}
                      disabled={isLoading}
                    >
                      <option value="" disabled>星座</option>
                      {constellations.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>

                    <DOBInput value={dob1} onChange={(value) => {
                      setDob1(value);
                      setError(null);
                    }} disabled={isLoading} ariaLabel="あなたの生年月日" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-b border-white/10 pb-2 mb-2">
                    <h3 className="text-lg font-semibold text-fuchsia-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"></span>
                      お相手
                    </h3>
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <input
                        type="text"
                        value={name2}
                        onChange={(e) => {
                          setName2(e.target.value);
                          setError(null);
                        }}
                        placeholder="お名前を入力"
                        list="past-names-list"
                        className={`${inputBaseClasses} pl-10`}
                        disabled={isLoading}
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <datalist id="past-names-list">{pastNames.map((name) => <option key={name} value={name} />)}</datalist>
                    </div>

                    {pastNames.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                        {pastNames.map((historyName) => (
                          <div key={historyName} className="flex items-center gap-1 bg-fuchsia-900/20 border border-fuchsia-500/30 px-2 py-1 rounded-full">
                            <button
                              type="button"
                              onClick={() => {
                                setName2(historyName);
                                setError(null);
                              }}
                              className="text-xs text-fuchsia-100 truncate max-w-[80px]"
                            >
                              {historyName}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteHistory(historyName)}
                              className="text-red-400 text-xs px-1"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2">
                      <select
                        id="relationship-select"
                        value={relationship}
                        onChange={handleRelationshipChange}
                        className={inputBaseClasses}
                        disabled={isLoading}
                      >
                        <option value="" disabled>現在の関係性</option>
                        {relationships.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <div className="flex items-center gap-4 mb-6 flex-wrap">
                  <div className="flex gap-2 bg-black/20 p-1 rounded-lg border border-white/5">
                    {['today', 'tomorrow'].map((d) => (
                      <button
                        type="button"
                        key={d}
                        onClick={() => {
                          setDivinationDate(d as 'today' | 'tomorrow');
                          setError(null);
                        }}
                        className={`px-4 py-1.5 rounded-md text-sm transition-all ${
                          divinationDate === d ? 'bg-fuchsia-600 text-white' : 'text-slate-400'
                        }`}
                      >
                        {d === 'today' ? '本日' : '明日'} ({getFormattedDate(d as 'today' | 'tomorrow')})
                      </button>
                    ))}
                  </div>

                  <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-xs text-fuchsia-200">
                    無料版 本日の残り：
                    <span className="font-bold text-yellow-400">{Math.max(0, DAILY_LIMIT - usageCount)}</span>
                    回
                  </div>
                </div>

                {usageCount >= DAILY_LIMIT && (
                  <div className="mb-4 p-3 bg-red-900/40 border border-red-500/50 rounded-lg text-center text-red-200 text-sm font-bold">
                    本日の無料利用上限に達しました。明日またお試しください。
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-4 bg-red-900/30 border border-red-500/50 rounded-xl text-red-100 text-center text-sm leading-7">
                    {error}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleFortuneTell}
                  disabled={isLoading || usageCount >= DAILY_LIMIT}
                  className={`group relative w-full py-4 text-lg font-bold text-white rounded-xl overflow-hidden shadow-xl transition-all ${
                    isLoading || usageCount >= DAILY_LIMIT
                      ? 'bg-gray-700 cursor-not-allowed'
                      : 'hover:scale-[1.01]'
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 ${usageCount >= DAILY_LIMIT ? 'opacity-20' : ''}`}></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {isLoading ? '鑑定中...' : '運命を占う'}
                  </span>
                </button>

                {isLoading && (
                  <div className="mt-6 flex flex-col items-center gap-3">
                    <LoadingSpinner />
                    <div className="text-sm text-fuchsia-100/80">{statusText || '鑑定中です...'}</div>
                  </div>
                )}

                {displayedResult && (
                  <div className="mt-8 animate-fade-in-up">
                    <div className="mb-3 flex items-center justify-between gap-3 flex-wrap">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-fuchsia-900/20 border border-fuchsia-500/30 text-xs text-fuchsia-100">
                        <span className="inline-block w-2 h-2 rounded-full bg-pink-400"></span>
                        無料版ダイジェスト表示
                      </div>
                      <a
                        href={NOTE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-violet-600 shadow-lg hover:opacity-90 transition"
                      >
                        完全版を見る
                      </a>
                    </div>

                    <div className="rounded-3xl border border-fuchsia-500/20 bg-[#12081f]/90 shadow-[0_20px_60px_rgba(0,0,0,0.45)] overflow-hidden">
                      <div className="p-6 md:p-8">
                        <div className="text-xs md:text-sm text-fuchsia-200/70 mb-2">
                          {displayedResult.dateStr} / {displayedResult.names.name1} × {displayedResult.names.name2}
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-6">
                          {displayedResult.title}
                        </h2>

                        <div className="space-y-6 text-[15px] md:text-base leading-8 text-fuchsia-50/95">
                          <section>
                            <div className="text-fuchsia-300 font-bold mb-2 text-lg">総合鑑定</div>
                            <p className="whitespace-pre-line">{displayedResult.summary}</p>
                          </section>

                          <section>
                            <div className="text-fuchsia-300 font-bold mb-2 text-lg">相手の気持ち</div>
                            <p className="whitespace-pre-line">{displayedResult.feeling}</p>
                          </section>

                          <section>
                            <div className="text-fuchsia-300 font-bold mb-2 text-lg">今後の流れ</div>
                            <p className="whitespace-pre-line">{displayedResult.future}</p>
                          </section>

                          <section>
                            <div className="text-fuchsia-300 font-bold mb-2 text-lg">アドバイス</div>
                            <p className="whitespace-pre-line">{displayedResult.advice}</p>
                          </section>
                        </div>
                      </div>

                      <div className="border-t border-white/10 bg-black/30 px-6 md:px-8 py-8">
                        <div className="mb-4 rounded-2xl border border-yellow-400/25 bg-yellow-500/10 px-4 py-3 text-center">
                          <div className="text-sm md:text-base font-bold text-yellow-200">
                            この下に「相手の本音・未来・決定的な転機」が続いています
                          </div>
                        </div>

                        <div className="relative rounded-2xl border border-white/10 bg-black/20 p-5 md:p-6 overflow-hidden min-h-[420px]">
                          <div className="blur-[6px] select-none pointer-events-none text-[15px] md:text-base leading-8 text-fuchsia-100/85 whitespace-pre-line">
                            {displayedResult.hidden}
                          </div>

                          <div className="absolute inset-0 flex items-center justify-center p-4">
                            <div className="w-full max-w-md rounded-2xl border border-white/15 bg-black/40 backdrop-blur-md px-5 py-6 text-center shadow-2xl">
                              <div className="text-lg md:text-xl font-extrabold text-white mb-2">
                                続きは完全版でご覧いただけます
                              </div>

                              <div className="text-sm md:text-base text-fuchsia-100/90 leading-7 mb-4">
                                相手の本音・今後の展開・二人の未来、
                                <br />
                                そして関係が動く時期まで確認できます。
                              </div>

                              <div className="grid grid-cols-1 gap-2 text-xs md:text-sm text-fuchsia-100/85 mb-5">
                                <div className="rounded-lg bg-white/5 px-3 py-2">相手が本当に考えていること</div>
                                <div className="rounded-lg bg-white/5 px-3 py-2">二人の未来</div>
                                <div className="rounded-lg bg-white/5 px-3 py-2">関係が動くタイミング</div>
                              </div>

                              <a
                                href={NOTE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center w-full px-6 py-3 rounded-full text-sm md:text-base font-bold text-white bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 shadow-lg hover:scale-[1.02] transition"
                              >
                                完全版を今すぐ見る
                              </a>

                              <div className="mt-3 text-[11px] text-fuchsia-100/65">
                                いちばん大切な部分だけ、この先で公開しています
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-2/5 relative border-t lg:border-t-0 lg:border-l border-white/10 min-h-[400px]">
            <CosmicConnection />
          </div>
        </div>

        <footer className="w-full flex flex-col items-center pb-12 mt-12 opacity-100">
          <div className="flex items-end gap-3 scale-110 md:scale-125">
            <div className="relative flex items-center">
              <span className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-[linear-gradient(to_right,#ff8a00,#e5ff00,#33ff00,#00ffcc,#00c2ff,#0071ff,#235ad1,#44107a,#af002d,#ff2000,#ff8a00)] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                m
                <span className="relative inline-block">
                  i
                  <span className="absolute -top-3 md:-top-5 left-1/2 -translate-x-1/2 text-yellow-400 text-xl md:text-3xl drop-shadow-[0_0_10px_rgba(250,204,21,1)]">
                    ★
                  </span>
                </span>
                ke
              </span>
            </div>
            <span className="text-lg md:text-xl text-gray-500 mb-1 font-bold italic tracking-tighter">
              ver.3.1 free
            </span>
          </div>

          <div className="mt-4 text-[11px] md:text-xs text-gray-500/80 text-center leading-6">
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
              <span id="busuanzi_container_site_pv" style={{ display: 'none' }}>
                累計アクセス <span id="busuanzi_value_site_pv"></span>
              </span>
              <span id="busuanzi_container_site_uv" style={{ display: 'none' }}>
                訪問ユーザー <span id="busuanzi_value_site_uv"></span>
              </span>
              <span id="busuanzi_container_page_pv" style={{ display: 'none' }}>
                このページ閲覧 <span id="busuanzi_value_page_pv"></span>
              </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default FreeApp;
