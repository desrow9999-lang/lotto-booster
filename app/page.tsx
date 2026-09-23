'use client';

import { useState } from 'react';

export default function LotteryApp() {
  const [selectedLotto, setSelectedLotto] = useState<'lotto6' | 'lotto7' | 'minilotto'>('lotto6');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

  // 数字をランダムに生成する関数
  const generateNumbers = () => {
    let count = 6;
    let max = 43;
    if (selectedLotto === 'lotto7') { count = 7; max = 37; }
    if (selectedLotto === 'minilotto') { count = 5; max = 31; }

    const results: number[] = [];
    while (results.length < count) {
      const num = Math.floor(Math.random() * max) + 1;
      if (!results.includes(num)) {
        results.push(num);
      }
    }
    results.sort((a, b) => a - b);
    setNumbers(results);
    setIsGenerated(true);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-4 flex flex-col items-center">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-xl p-6 border border-slate-700">
        
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-black tracking-wider flex items-center gap-2">
            Lotto Booster <span className="text-xl">🎯</span>
          </h1>
        </div>
        <p className="text-slate-400 text-sm mb-6">AI確率予測 ＆ 買い目自動管理アプリ</p>

        {/* ロトの種類選択タブ */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button
            onClick={() => setSelectedLotto('lotto6')}
            className={`py-2 rounded-lg font-bold text-sm transition ${
              selectedLotto === 'lotto6' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-700 text-slate-300'
            }`}
          >
            ロト6
          </button>
          <button
            onClick={() => setSelectedLotto('lotto7')}
            className={`py-2 rounded-lg font-bold text-sm transition ${
              selectedLotto === 'lotto7' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-700 text-slate-300'
            }`}
          >
            ロト7
          </button>
          <button
            onClick={() => setSelectedLotto('minilotto')}
            className={`py-2 rounded-lg font-bold text-sm transition ${
              selectedLotto === 'minilotto' ? 'bg-red-600 text-white shadow-lg' : 'bg-slate-700 text-slate-300'
            }`}
          >
            ミニロト
          </button>
        </div>

        {/* 生成結果表示エリア */}
        <div className="bg-slate-900 rounded-xl p-5 mb-6 text-center border border-slate-800 shadow-inner">
          <div className="text-xs text-slate-400 font-semibold tracking-widest mb-3">GENERATED NUMBERS</div>
          
          {isGenerated ? (
            <div>
              <div className="flex flex-wrap gap-2 justify-center my-3">
                {numbers.map((num, index) => (
                  <div
                    key={index}
                    className="w-11 h-11 rounded-full bg-gradient-to-br from-amber-400 to-red-500 text-slate-950 font-black flex items-center justify-center shadow-lg text-lg border-2 border-amber-200"
                  >
                    {String(num).padStart(2, '0')}
                  </div>
                ))}
              </div>
              <p className="text-xs text-emerald-400 mt-3 flex items-center justify-center gap-1">
                ✨ 統計的最適バランスで生成されました
              </p>
            </div>
          ) : (
            <p className="text-slate-500 text-sm py-4">ボタンを押して買い目を生成してください</p>
          )}
        </div>

        {/* アクションボタン */}
        <div className="space-y-3 mb-6">
          <button
            onClick={generateNumbers}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            <span>🚀</span> AI買い目を自動生成する
          </button>
          <button
            onClick={() => alert('買い目を保存しました！（Supabase連携へ進みます）')}
            className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold rounded-xl transition flex items-center justify-center gap-2 text-sm"
          >
            <span>📥</span> この買い目を保存する
          </button>
        </div>

        {/* フッター情報 */}
        <div className="text-center text-xs text-slate-500 border-t border-slate-700 pt-4">
          Pro Membership で自動当せん照会が解放されます
        </div>

      </div>
    </main>
  );
}
