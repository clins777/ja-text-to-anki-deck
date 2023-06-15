const wachigaki = require("wakachigaki");
const fs = require("fs");
const axios = require("axios");
const apiUrl = "https://jisho.org/api/v1/search/words?keyword=";

const content =
  "私のプログラミング歴は10年以上です。ブラジルで2年、日本で3年以上のプログラミング専門職での経験を積み、デジタルイノベーション、自動車、銀行/フィンテック業界で働いた経験があります。前向きな考え方、高いコミュニケーション能力、そしてエンジニアリング能力を持ち合わせているので、お客様のIT課題解決に貢献できます。" +
  "2年ほど自動車業界で働きました。最初は、ブラジル大手の自動車バッテリー会社の配送サービスのバックエンドを構築しました。その後、チャットボットの開発、大手自動車会社フィアットのデータレイクパイプラインの管理を担当しました。また、三菱ふそうでは、販売後の部品価格を管理するために、複数のデータソースからデータを引き出すダッシュボードを構築しました。" +
  "銀行/フィンテック業界で3年以上、金融データモデリング、スクレイピング＆アグリゲーションそして銀行APIインテグレーションなどに携わってきました。これらのシステムは非常に多くの金融データを読み込むため、データリライアビリティエンジニアとして、信頼性を確保することが私の任務でした。カスタマーサポートとバックエンドチーム、金融機関、データプロバイダーなどの、社内外の様々なステークホルダーと協力しました。また、課題を把握、解決策の設計、金融データ集約パイプラインに必要な変更を実装できるようになりました。";

const kanjis = new Set([...content].filter((c) => wachigaki.isKanji(c)));

const wachigakiTokens = new Set(
  wachigaki
    .tokenize(content)
    .filter((t) => !kanjis.has(t))
    .filter((t) => !wachigaki.isHiragana(t))
    .filter((t) => !wachigaki.isKatakana(t))
    .filter((t) => !wachigaki.isNumeral(t))
    .filter((t) => !wachigaki.isAlphabet(t))
    .filter((t) => wachigaki.isKanji(t))
);

console.log(`kanji count: ${kanjis.size}`);
console.log(`wachigaki token count: ${wachigakiTokens.size}`);

const tokens = [...kanjis, ...wachigakiTokens];

const promises = tokens.map((token) => {
  const url = apiUrl + token;
  return axios.get(url).then(({ data }) => {
    let relevant = data.data.filter(
      ({ slug }) => slug === token || slug === `${token}-1`
    );

    if (relevant.length === 0) relevant = [data.data[0]];

    console.log(`Building tokenWithContent for ${token}`);
    return relevant.reduce(
      (accumulator, current) => {
        if (current === undefined || current.japanese === undefined) {
          console.log(`${token} ${current}`);
          return accumulator;
        }
        const { japanese, senses } = current;
        const readings = [
          ...new Set(japanese.map(({ reading }) => reading)),
        ].join(" ● ");
        const meanings = senses[0].english_definitions.join(", ");
        if (accumulator.content === "") {
          accumulator.content = `「${readings}」(${meanings})`;
        } else {
          accumulator.content += ` | 「${readings}」(${meanings})`;
        }
        return accumulator;
      },
      { token, content: "" }
    );
  });
});

axios.all(promises).then((tokensWithReading) => {
  fs.writeFile(
    "anki.txt",
    tokensWithReading
      .map(({ token, content }) => `${token};${content}`)
      .join("\n"),
    "utf8",
    (err) => {
      if (err) {
        console.error("an error occurred while writing to the file:", err);
      } else {
        console.log("text has been written to the file successfully.");
      }
    }
  );
});
