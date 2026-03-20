
export interface DivinationDetail {
  title: string;
  content: string;
}

export interface FortuneResult {
  score: number;
  title:string;
  reading: string;
  advice: string;
  luckyNumber: string;
  luckyColor: string;
  luckyItem: string;
  generalFortune: DivinationDetail;
  nameCompatibility: DivinationDetail;
  constellationCompatibility: DivinationDetail;
  bloodTypeCompatibility: DivinationDetail;
  fiveElementsCompatibility: DivinationDetail;
  destinyAnalysis: DivinationDetail;
}