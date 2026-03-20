import React from "react";

const PaidPage: React.FC = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 20px",
        textAlign: "center",
        color: "white",
        background:
          "radial-gradient(circle at top, #2b1055 0%, #12001f 45%, #05020a 100%)",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>完全相性鑑定</h1>

      <p style={{ marginTop: "30px", fontSize: "18px", opacity: 0.9 }}>
        二人の運命を詳しく鑑定しています...
      </p>

      <div
        style={{
          margin: "40px auto 0",
          maxWidth: "700px",
          padding: "30px",
          background: "rgba(42,17,68,0.9)",
          borderRadius: "20px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
        }}
      >
        <h2 style={{ fontSize: "24px" }}>相手の気持ち</h2>

        <p style={{ marginTop: "20px", lineHeight: 1.8 }}>
          あなたのことを意識しています。
        </p>

        <p style={{ marginTop: "10px", lineHeight: 1.8 }}>
          しかし本音はまだ隠されています。
        </p>

        <p style={{ marginTop: "30px", lineHeight: 1.9 }}>
          本当はあなたに伝えたい気持ちがあります。
        </p>

        <p style={{ marginTop: "12px", lineHeight: 1.9 }}>
          ただ、今は自分の立場や関係性を慎重に見極めているため、
          すぐには行動に移せない状態です。
        </p>

        <p style={{ marginTop: "12px", lineHeight: 1.9 }}>
          あなたから優しく歩み寄ることで、二人の距離は一気に縮まる可能性があります。
        </p>
      </div>
    </div>
  );
};

export default PaidPage;
