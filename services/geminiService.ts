import { GoogleGenAI, Type } from "@google/genai";
import type { FortuneResult } from "../types";

// ✅ Vite(フロント)ではこれで読む
const apiKey = import.meta.env.VITE_API_KEY as string | undefined;

// 文字列からユニークなハッシュ値を生成（決定的シード）
const generateSeed = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
};

const divinationDetailSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "簡潔なタイトル。" },
    content: { type: Type.STRING, description: "分析結果。要点を絞り、1〜2文（50文字程度）で簡潔に記述。" },
  },
  required: ["title", "content"],
};

const fiveElementsSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "簡潔なタイトル。" },
    content: { type: Type.STRING, description: "五行思想に基づく分析。名前の響きや干支の相性を踏まえ、80文字以内で簡潔に記述。" },
  },
  required: ["title", "content"],
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER, description: "0-100の整数。日付の運気により変動させること。" },
    title: { type: Type.STRING, description: "短いキャッチーなタイトル。" },
    reading: { type: Type.STRING, description: "総合的な相性占い結果。100文字以内で簡潔に記述してください。" },
    advice: { type: Type.STRING, description: "関係改善のための具体的アドバイス。40文字以内で簡潔に提案。" },
    luckyNumber: { type: Type.STRING, description: "本日のラッキーナンバー（数字）。" },
    luckyColor: { type: Type.STRING, description: "本日のラッキーカラー（例：パステルピンク、ミッドナイトブルーなど）。" },
    luckyItem: { type: Type.STRING, description: "本日のラッキーアイテム（具体的で身近なもの）。" },

    generalFortune: { ...divinationDetailSchema, description: "二人の総合的な運勢。簡潔に。" },
    nameCompatibility: { ...divinationDetailSchema, description: "姓名判断に基づく相性分析。50文字以内で簡潔に記述。" },
    constellationCompatibility: { ...divinationDetailSchema, description: "星座占い。60文字以内で簡潔に。" },
    bloodTypeCompatibility: { ...divinationDetailSchema, description: "血液型占い。60文字以内で簡潔に。" },
    fiveElementsCompatibility: { ...fiveElementsSchema, description: "五行思想。簡潔に。" },
    destinyAnalysis: { ...divinationDetailSchema, description: "運命的な繋がり。60文字以内で簡潔に。" },
  },
  required: [
    "score",
    "title",
    "reading",
    "advice",
    "luckyNumber",
    "luckyColor",
    "luckyItem",
    "generalFortune",
    "nameCompatibility",
    "constellationCompatibility",
    "bloodTypeCompatibility",
    "fiveElementsCompatibility",
    "destinyAnalysis",
  ],
};

export const getCompatibilityFortune = async (
  name1: string | null,
  name2: string | null,
  bloodType1: string | null,
  constellation1: string | null,
  eto1: string | null,
  dob1: string | null,
  bloodType2: string | null,
  constellation2: string | null,
  dob2: string | null,
  relationship: string,
  divinationDate: "today" | "tomorrow"
): Promise<FortuneResult> => {
  // ✅ ここでキー未設定なら分かりやすく落とす（画面クラッシュを避けたいならUI側でcatchして表示）
  if (!apiKey) {
    throw new Error("VITE_API_KEY is not set (Vercel Environment Variables を確認してください)");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
【役割と専門性】
あなたは、姓名判断、西洋占星術、血液型占い、そして東洋の五行思想・四柱推命・干支占いに精通した、世界最高の占い師です。

【決定的な回答】
同じ入力に対しては、常に同じ分析結果、スコア、ラッキーアイテムを出力してください。

【重要：文字数制限】
全ての出力文章は極めて簡潔に、短文で作成してください。
`.trim();

  // ✅ 日付は必ずゼロ埋め（環境差を減らす）
  const now = new Date();
  const targetDate = new Date(now);
  if (divinationDate === "tomorrow") targetDate.setDate(targetDate.getDate() + 1);

  const yyyy = targetDate.getFullYear();
  const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
  const dd = String(targetDate.getDate()).padStart(2, "0");
  const dateString = `${yyyy}-${mm}-${dd}`;

  const uniqueIdentityString = `${name1}-${name2}-${bloodType1}-${constellation1}-${eto1}-${dob1}-${relationship}-${divinationDate}-${dateString}`;
  const seedValue = generateSeed(uniqueIdentityString);

  const cacheKey = `fortune_v2_${seedValue}`;

  // キャッシュ（任意）
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached) as FortuneResult;
  } catch {}

  const prompt = `
以下の二人の【${dateString}】の運勢と相性を占ってください。
対象日: ${dateString}

あなた:
名前: ${name1 || "不明"}
血液型: ${bloodType1 || "不明"}
星座: ${constellation1 || "不明"}
干支: ${eto1 || "不明"}
生年月日: ${dob1 || "不明"}

お相手:
名前: ${name2 || "不明"}
血液型: ${bloodType2 || "不明"}
星座: ${constellation2 || "不明"}
生年月日: ${dob2 || "不明"}

関係性: ${relationship}
`.trim();

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0,
      seed: seedValue,
    },
  });

  const result = JSON.parse(response.text) as FortuneResult;

  try {
    localStorage.setItem(cacheKey, JSON.stringify(result));
  } catch {}

  return result;
};
