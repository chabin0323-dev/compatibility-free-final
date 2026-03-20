export type DivinationDate = 'today' | 'tomorrow';
export type ActiveTabKey = 'name' | 'star' | 'blood' | 'five';

export interface FortuneInput {
  yourBloodType?: string | null;
  yourEto?: string | null;
  yourConstellation?: string | null;
  yourDob?: string | null;
  partnerName?: string | null;
  relationship?: string | null;
  selectedDate?: DivinationDate | string | null;
}

export interface FortuneDetail {
  title: string;
  content: string;
}

export interface BiorhythmItem {
  date: string;
  score: number;
  note: string;
  activeStars: number;
  inactiveStars: number;
}

export interface FortuneBundle {
  displayDate: string;
  finalScore: number;
  confessionRate: number;
  intimacyLevel: number;
  advice: string;
  luckyNumber: number;
  luckyColor: string;
  generalFortune: FortuneDetail;
  destinyAnalysis: FortuneDetail;
  tabs: Record<ActiveTabKey, FortuneDetail>;
  biorhythmData: BiorhythmItem[];
  actionGuide: string;
  partnerName: string;
  relationship: string;
  seedKey: string;
}

const LUCKY_COLORS = [
  'シャンパンゴールド',
  'ロイヤルブルー',
  'ローズクォーツ',
  'エメラルドグリーン',
  'ラベンダーグレー',
  'サンセットオレンジ',
  'スノーホワイト',
  'ミッドナイトブラック',
  'ターコイズブルー',
  'コーラルピンク',
  'レモンイエロー',
  'バイオレット',
];

const RELATIONSHIP_LABELS: Record<string, string> = {
  lover: '恋人',
  crush: '片思い',
  married: '夫婦',
  friend: '友人',
  coworker: '仕事仲間',
  business: '商談相手',
  boss: '上司',
};

const RELATIONSHIP_BASE: Record<string, number> = {
  恋人: 8,
  片思い: -2,
  夫婦: 10,
  友人: 4,
  仕事仲間: 3,
  商談相手: 2,
  上司: 1,
};

const BLOOD_BASE: Record<string, number> = {
  A型: 5,
  B型: 1,
  O型: 6,
  AB型: 4,
};

const STAR_BASE: Record<string, number> = {
  牡羊座: 4,
  牡牛座: 6,
  双子座: 3,
  蟹座: 6,
  獅子座: 5,
  乙女座: 6,
  天秤座: 5,
  蠍座: 7,
  射手座: 4,
  山羊座: 6,
  水瓶座: 3,
  魚座: 7,
};

const ETO_BASE: Record<string, number> = {
  子: 5,
  丑: 4,
  寅: 6,
  卯: 5,
  辰: 6,
  巳: 4,
  午: 5,
  未: 6,
  申: 4,
  酉: 5,
  戌: 6,
  亥: 7,
};

const HIDDEN_FEELINGS = [
  '実はもっとあなたに甘えたい、頼ってほしいという願望を隠し持っているようです。',
  'あなたの前では強がっていますが、内心では自分をどう思っているか不安でたまらない様子です。',
  '言葉にはしませんが、あなたの存在が日々の大きな支えになっていると確信しています。',
];

const PAST_LIFE_STORIES = [
  '前世では深い信頼で結ばれた師弟関係でした。今世でも、あなたが相手を導いたり、逆に教えられたりする不思議な縁があります。',
  '遠い異国で共に旅をしていた仲間だったようです。初対面でもどこか懐かしく感じるのは、共に困難を乗り越えた記憶が魂にあるからです。',
  'かつては同じ志を持つライバルのような関係でした。切磋琢磨し合うことで、お互いを一番高め合える最強のパートナーになれる相性です。',
  '言葉を交わさずとも理解し合える、双子の兄弟のような縁でした。理屈を超えた安心感があり、一緒にいるだけで運気が安定する特別な二人です。',
];

function safeString(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pick<T>(seed: string, list: T[]): T {
  const index = hashString(seed) % list.length;
  return list[index];
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function normalizeRelationship(raw: string): string {
  if (!raw) return '気になる相手';
  return RELATIONSHIP_LABELS[raw] || raw;
}

function normalizeInput(raw: any): Required<FortuneInput> {
  const yourBloodType =
    safeString(raw?.yourBloodType) ||
    safeString(raw?.bloodType) ||
    safeString(raw?.bloodType1);

  const yourEto =
    safeString(raw?.yourEto) ||
    safeString(raw?.eto) ||
    safeString(raw?.eto1);

  const yourConstellation =
    safeString(raw?.yourConstellation) ||
    safeString(raw?.constellation) ||
    safeString(raw?.constellation1);

  const yourDob =
    safeString(raw?.yourDob) ||
    safeString(raw?.dob) ||
    safeString(raw?.dob1) ||
    [
      safeString(raw?.year1 || raw?.year),
      safeString(raw?.month1 || raw?.month),
      safeString(raw?.day1 || raw?.day),
    ]
      .filter(Boolean)
      .join('-');

  const partnerName =
    safeString(raw?.partnerName) ||
    safeString(raw?.name2) ||
    safeString(raw?.partner) ||
    'お相手';

  const relationship = normalizeRelationship(
    safeString(raw?.relationship) || safeString(raw?.relation)
  );

  const selectedDate =
    safeString(raw?.selectedDate) === 'tomorrow' ? 'tomorrow' : 'today';

  return {
    yourBloodType,
    yourEto,
    yourConstellation,
    yourDob,
    partnerName,
    relationship,
    selectedDate,
  };
}

function getTargetDate(selectedDate: DivinationDate): Date {
  const now = new Date();
  const target = new Date(now);
  if (selectedDate === 'tomorrow') {
    target.setDate(target.getDate() + 1);
  }
  return target;
}

function formatDisplayDate(date: Date): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}年${m}月${d}日`;
}

function formatDateSeed(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatBiorhythmLabel(date: Date): string {
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  return `${date.getMonth() + 1}/${date.getDate()}(${weekdays[date.getDay()]})`;
}

function buildSeedKey(input: Required<FortuneInput>): string {
  return [
    input.yourBloodType || 'none',
    input.yourEto || 'none',
    input.yourConstellation || 'none',
    input.yourDob || 'none',
    input.partnerName || 'none',
    input.relationship || 'none',
  ].join('|');
}

function getBaseScore(input: Required<FortuneInput>, seedKey: string): number {
  const targetDate = getTargetDate(input.selectedDate as DivinationDate);
  const dateSeed = formatDateSeed(targetDate);

  const blood = BLOOD_BASE[input.yourBloodType] ?? 3;
  const eto = ETO_BASE[input.yourEto] ?? 3;
  const star = STAR_BASE[input.yourConstellation] ?? 3;
  const relation = RELATIONSHIP_BASE[input.relationship] ?? 2;
  const dobInfluence = input.yourDob ? hashString(input.yourDob) % 8 : 3;
  const nameInfluence = hashString(input.partnerName) % 10;
  const dailyInfluence = hashString(`${seedKey}|${dateSeed}|daily-base`) % 14;

  return clamp(
    58 + blood + eto + star + relation + dobInfluence + nameInfluence + dailyInfluence,
    62,
    98
  );
}

function buildAdvice(score: number, relationship: string, seedKey: string): string {
  const emotion = pick(`${seedKey}-emotion`, [
    '相手の反応を急がず、まず安心感を渡す言葉を選ぶこと。',
    '思いを伝える前に、相手の立場を一度受け止める姿勢が大切です。',
    '押しすぎず引きすぎず、自然な距離感を守るほど流れが整います。',
    '自分の本音を柔らかく表現すると、相手の心も開きやすくなります。',
  ]);

  if (relationship === '片思い') {
    return score >= 85
      ? `今は追い風です。${emotion}`
      : `関係を急進させるより、信頼を育てる行動が先です。${emotion}`;
  }

  if (relationship === '恋人' || relationship === '夫婦') {
    return score >= 85
      ? `絆を深める好機です。感謝と愛情を言葉で見せるほど運気が上がります。`
      : `近さに甘えず、丁寧な対話を意識すると誤解を防げます。`;
  }

  if (relationship === '仕事仲間' || relationship === '商談相手' || relationship === '上司') {
    return `感情より順序を大切にすると信頼が強まります。結論を急がず、相手の意図を確認してください。`;
  }

  return `自然体のやり取りが運気を整えます。無理に距離を詰めず、安心感を積み重ねることが鍵です。`;
}

function buildOverallText(score: number, input: Required<FortuneInput>, seedKey: string): string {
  const hiddenFeeling = pick(`${seedKey}-hidden`, HIDDEN_FEELINGS);

  if (score >= 90) {
    return `二人の総合運勢は極めて強く、気持ちと流れが噛み合いやすい最上位帯です。${input.partnerName}さんとの関係は、少しの行動でも大きな進展に繋がりやすく、${hiddenFeeling}`;
  }

  if (score >= 78) {
    return `二人の総合運勢は非常に安定しており、信頼を積み重ねるほど結果が大きく育つ流れです。派手さよりも自然な会話や気遣いが強く効き、関係性に確かな温度が生まれています。`;
  }

  return `二人の総合運勢は発展途上ですが、学びの多いご縁です。焦って答えを出すより、やり取りの質を高めるほど相性は伸びていきます。今は土台作りが未来の強い結びつきに変わる段階です。`;
}

function buildDestinyText(score: number, input: Required<FortuneInput>, seedKey: string): string {
  const pastLife = pick(`${seedKey}-pastlife`, PAST_LIFE_STORIES);

  if (score >= 88) {
    return `${pastLife} 今回のご縁は偶然ではなく、再会に近い力を感じます。${input.relationship}という今の立場を超えて、魂の深い部分で引き合いやすい相性です。`;
  }

  if (score >= 75) {
    return `${pastLife} 今世では、支え合いながら関係を育てることで強い意味を持つご縁です。急展開より、理解を深める過程に運命の意味があります。`;
  }

  return `${pastLife} ただし今は試練も混ざりやすく、相手を理解する姿勢が運命の扉を開きます。難しさの中にこそ、この関係の本当の価値が隠れています。`;
}

function buildTabDetails(score: number, input: Required<FortuneInput>, seedKey: string): Record<ActiveTabKey, FortuneDetail> {
  const partnerNameShort = input.partnerName || 'お相手';
  const starHint = input.yourConstellation || 'あなたの星座';
  const bloodHint = input.yourBloodType || 'あなたの血液型';
  const etoHint = input.yourEto || 'あなたの干支';
  const hiddenFeeling = pick(`${seedKey}-tab-hidden`, HIDDEN_FEELINGS);

  const name: FortuneDetail =
    score >= 85
      ? {
          title: '姓名判断：強い引力の縁',
          content: `${partnerNameShort}さんの名前の波動とあなたの運気は強く共鳴しています。呼びかけやメッセージなど「名前を丁寧に扱う」ほど親密運が上がり、関係の進展が早まりやすい相です。`,
        }
      : score >= 72
      ? {
          title: '姓名判断：信頼育成型',
          content: `${partnerNameShort}さんとの縁は、名前が持つ響きによって安定感が育つ相です。派手な展開より、丁寧なやり取りや継続した接点が大きな意味を持ちます。`,
        }
      : {
          title: '姓名判断：距離調整の相',
          content: `今は名前の波動にやや揺れがあり、気持ちの温度差が出やすい時期です。呼び方や言い方を柔らかくすると空気が整い、関係は改善しやすくなります。`,
        };

  const star: FortuneDetail =
    score >= 85
      ? {
          title: '占星術：恋愛運上昇配置',
          content: `${starHint}の運気は${input.selectedDate === 'tomorrow' ? '明日' : '本日'}、対人面で大きく追い風です。想いを伝える・距離を縮める・本音を共有する流れに強く、自然体ほど魅力が伝わります。`,
        }
      : score >= 72
      ? {
          title: '占星術：安定交流配置',
          content: `${starHint}は、急進より信頼形成に強い配置です。共通点を見つける会話や、相手の話を受け止める姿勢が関係運を底上げします。`,
        }
      : {
          title: '占星術：慎重成長配置',
          content: `${starHint}は今、相手との距離感を整える学びの時です。無理に動くより、タイミングを読む冷静さが後の好転を呼び込みます。`,
        };

  const blood: FortuneDetail =
    score >= 85
      ? {
          title: '血液型：情感共鳴',
          content: `${bloodHint}の特性が良い形で働き、相手に安心感と印象の強さを同時に残せる相です。${hiddenFeeling}`,
        }
      : score >= 72
      ? {
          title: '血液型：補完バランス',
          content: `${bloodHint}らしい性質が、相手との間で補完関係を作りやすい流れです。押し引きのバランスを意識すると親密度が安定して伸びます。`,
        }
      : {
          title: '血液型：理解深耕型',
          content: `${bloodHint}の特徴が強く出やすく、相手との違いを感じやすい時です。ですが違いは弱点ではなく、対話によって絆へ変えられる材料になります。`,
        };

  const five: FortuneDetail =
    score >= 85
      ? {
          title: '五行思想：強運循環',
          content: `${etoHint}が持つ気の流れは${partnerNameShort}さんとの関係で活性化しやすく、出会い・再接近・信頼深化に良い循環が出ています。行動するほど運気が巡る配置です。`,
        }
      : score >= 72
      ? {
          title: '五行思想：安定循環',
          content: `${etoHint}の気は今、穏やかに育つ運勢です。急激な進展より、日常のやり取りや小さな信頼で関係を安定させるほど五行の巡りが整います。`,
        }
      : {
          title: '五行思想：調律の時',
          content: `${etoHint}の気と相手側の流れに一時的なズレがあります。焦らず生活リズムや心の余裕を整えると、相性の流れは少しずつ好転していきます。`,
        };

  return { name, star, blood, five };
}

function buildActionGuide(score: number, relationship: string, selectedDate: DivinationDate): string {
  const dayWord = selectedDate === 'tomorrow' ? '明日' : '今日';

  if (relationship === '片思い') {
    return score >= 85
      ? `${dayWord}は想いを前に進める好機です。短くても良いので、相手が安心できる一言を先に届けてください。`
      : `${dayWord}は距離を詰めすぎず、心地よい会話の余韻を残すことが最優先です。`;
  }

  if (relationship === '恋人' || relationship === '夫婦') {
    return score >= 85
      ? `${dayWord}は愛情表現が強く届きます。感謝・労い・未来の話のどれかを一つ言葉にしてください。`
      : `${dayWord}は小さなすれ違いを防ぐ日です。相手の話を途中で遮らず、最後まで聞く意識が運命を整えます。`;
  }

  if (relationship === '仕事仲間' || relationship === '商談相手' || relationship === '上司') {
    return `${dayWord}は結論を急がず、確認を丁寧に。相手の立場を尊重した一言が評価と信頼を大きく押し上げます。`;
  }

  return `${dayWord}は自然な笑顔と柔らかい返答が鍵です。無理に印象を作るより、安心感を渡すことを優先してください。`;
}

function getStarCount(score: number): number {
  if (score >= 88) return 5;
  if (score >= 72) return 4;
  if (score >= 56) return 3;
  if (score >= 40) return 2;
  return 1;
}

function buildBiorhythmNote(score: number, cautionSeed: number): string {
  const cautionType = cautionSeed % 4;

  if (score >= 88) {
    if (cautionType === 0) {
      return '最高潮の日。流れは非常に良いですが、勢いで結論を急ぎすぎると温度差が出やすいので一呼吸置いて進めてください。';
    }
    if (cautionType === 1) {
      return '最高潮の日。想いは伝わりやすい反面、言いすぎには注意。優しさを先に乗せると運気を最大限活かせます。';
    }
    if (cautionType === 2) {
      return '最高潮の日。大きな進展が期待できますが、相手の都合を無視しないことが成功の決め手です。';
    }
    return '最高潮の日。魅力が強く届く一方、自分本位に見えないよう丁寧な言葉選びを意識すると完璧です。';
  }

  if (score >= 72) {
    if (cautionType === 0) {
      return '好調日。会話や接近に向く流れですが、焦って距離を詰めすぎると逆効果なので自然体を守ると吉です。';
    }
    if (cautionType === 1) {
      return '好調日。信頼が深まりやすい一方、思い込みで判断せず相手の反応を見ながら進めると安定します。';
    }
    if (cautionType === 2) {
      return '好調日。気持ちは通じやすいですが、細かな配慮を忘れないことがさらに運気を押し上げます。';
    }
    return '好調日。良い流れがありますが、期待を上げすぎず穏やかに接するほど長続きする運勢です。';
  }

  if (score >= 56) {
    return '安定日。無理に強い行動を起こさなくても大丈夫です。丁寧な返答と自然な気遣いがそのまま好印象になります。';
  }

  if (score >= 40) {
    return '調整日。言葉の選び方ひとつで印象が変わりやすいので、結論を急がず落ち着いた対応を心がけてください。';
  }

  return '慎重日。今は答えを急ぐより、自分の気持ちと相手の状況を整えることが優先です。静かな行動が流れを立て直します。';
}

function getBiorhythmScoreForDate(seedKey: string, date: Date): number {
  const dateSeed = formatDateSeed(date);
  const base = 28;
  const spread = hashString(`${seedKey}|${dateSeed}|bio-score`) % 69;
  return clamp(base + spread, 22, 96);
}

function buildBiorhythmData(seedKey: string, selectedDate: DivinationDate): BiorhythmItem[] {
  const startDate = getTargetDate(selectedDate);

  return Array.from({ length: 7 }).map((_, index) => {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + index);

    const dateSeed = formatDateSeed(d);
    const weighted = getBiorhythmScoreForDate(seedKey, d);
    const activeStars = getStarCount(weighted);
    const inactiveStars = 5 - activeStars;
    const note = buildBiorhythmNote(
      weighted,
      hashString(`${seedKey}|${dateSeed}|bio-note`)
    );

    return {
      date: formatBiorhythmLabel(d),
      score: weighted,
      note,
      activeStars,
      inactiveStars,
    };
  });
}

export function buildFortuneBundle(rawInput: any): FortuneBundle {
  const input = normalizeInput(rawInput);
  const seedKey = buildSeedKey(input);
  const targetDate = getTargetDate(input.selectedDate as DivinationDate);
  const displayDate = formatDisplayDate(targetDate);

  const finalScore = getBaseScore(input, seedKey);
  const confessionRate = clamp(
    finalScore + (hashString(`${seedKey}|${formatDateSeed(targetDate)}|confession`) % 9) - 4,
    45,
    100
  );
  const intimacyLevel = clamp(
    finalScore - 5 + (hashString(`${seedKey}|${formatDateSeed(targetDate)}|intimacy`) % 11) - 5,
    38,
    100
  );

  const advice = buildAdvice(finalScore, input.relationship, seedKey);
  const luckyNumber = (hashString(`${seedKey}|${formatDateSeed(targetDate)}|lucky-number`) % 99) + 1;
  const luckyColor = pick(`${seedKey}|${formatDateSeed(targetDate)}|lucky-color`, LUCKY_COLORS);

  const generalFortune: FortuneDetail = {
    title: '⬢ 二人の総合運勢',
    content: buildOverallText(finalScore, input, seedKey),
  };

  const destinyAnalysis: FortuneDetail = {
    title: '🔗 運命分析',
    content: buildDestinyText(finalScore, input, seedKey),
  };

  const tabs = buildTabDetails(finalScore, input, seedKey);
  const biorhythmData = buildBiorhythmData(seedKey, input.selectedDate as DivinationDate);
  const actionGuide = buildActionGuide(finalScore, input.relationship, input.selectedDate as DivinationDate);

  return {
    displayDate,
    finalScore,
    confessionRate,
    intimacyLevel,
    advice,
    luckyNumber,
    luckyColor,
    generalFortune,
    destinyAnalysis,
    tabs,
    biorhythmData,
    actionGuide,
    partnerName: input.partnerName || 'お相手',
    relationship: input.relationship || '気になる相手',
    seedKey,
  };
}
