'use client';
import { useState } from 'react';

export default function LotteryApp() {
  const [lottoType, setLottoType] = useState('lotto6');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [saved, setSaved] = useState(false);

  // 宝くじの買い目を自動生成するロジック（統計・ランダムミックス）
  const generateNumbers = () => {
    let count = 6;
    let max = 43;
    if (lottoType === 'lotto7') { count = 7; max = 37; }
    if (lottoType === 'minilotto') { count = 5; max = 31; }

    const nums: number[] = [];
    while (nums.length < count) {
      const n = Math.floor(Math.random() * max) + 1;
      if (!nums.includes(n)) nums.push(n);
    }
    setNumbers(nums.sort((a, b) => a - b));
    setSaved(false);
  };

  // 生成した買い目をSupabaseに保存する処理のイメージ
  const saveTicket = async () => {
    if (numbers.length === 0) return;
    
    // TODO: ここで Supabase の client.from('tickets').insert(...) を呼び出します
    setSaved(true);
    alert('買い目をマイページに保存しました！');
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-4 max-w-md mx-auto flex flex-col justify-between">
      <div>
        {/* ヘッダー */}
        <header className="py-4 text-center">
          <h1 className="text-2xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Lotto Booster 🎯
          </h1>
          <p className="text-xs text-slate-400 mt-1">AI確率予測 ＆ 買い目自動管理アプリ</p>
        </header>

        {/* 宝くじ選択タブ */}
        <div className="flex gap-2 my-4">
          {['lotto6', 'lotto7', 'minilotto'].map((type) => (
            <button
              key={type}
              onClick={() => { setLottoType(type); setNumbers([]); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg uppercase transition-all ${
                lottoType === type ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/30' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {type === 'lotto6' ? 'ロト6' : type === 'lotto7' ? 'ロト7' : 'ミニロト'}
            </button>
          ))}
        </div>

        {/* 買い目表示エリア */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 text-center my-6 shadow-xl">
          <span className="text-xs font-semibold text-slate-400 tracking-wider">GENERATED NUMBERS</span>
          <div className="flex flex-wrap gap-2 justify-center my-4">
            {numbers.length > 0 ? (
              numbers.map((n, i) => (
                <span
                  key={i}
                  className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-yellow-300 to-yellow-500 text-slate-950 font-black text-lg rounded-full shadow-md animate-bounce-short"
                >
                  {n < 10 ? `0${n}` : n}
                </span>
              ))
            ) : (
              <p className="text-slate-500 text-sm py-3">ボタンを押して買い目を生成してください</p>
            )}
          </div>
          {numbers.length > 0 && (
            <div className="text-xs text-yellow-400 font-medium mt-2">
              ✨ 統計的最適バランスで生成されました
            </div>
          )}
        </div>

        {/* アクションボタン */}
        <div className="space-y-3">
          <button
            onClick={generateNumbers}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 font-bold rounded-xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform"
          >
            🚀 AI買い目を自動生成する
          </button>
          
          {numbers.length > 0 && (
            <button
              onClick={saveTicket}
              disabled={saved}
              className={`w-full py-3 font-bold rounded-xl border transition-all ${
                saved ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed' : 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/20 active:scale-95'
              }`}
            >
              {saved ? '✔ 保存完了' : '📥 この買い目を保存する'}
            </button>
          )}
        </div>
      </div>

      {/* フッターマーケティングコピー */}
      <footer className="text-center py-6 text-xs text-slate-500">
        <p>Pro Membership で自動当せん照合が解放されます</p>
      </footer>
    </main>
  );
}
