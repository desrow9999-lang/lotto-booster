'use client';

import { useState } from 'react';

export default function LotteryApp() {
  const [selectedLotto, setSelectedLotto] = useState<'lotto6' | 'lotto7' | 'minilotto'>('lotto6');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);

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

  const saveTicket = () => {
    if (!isGenerated) {
      alert('まずは買い目を生成してください！');
      return;
    }
    // 通信エラーを100%起こさない純粋なポップアップテスト
    alert('🎉 保存ボタンが正常に動作しました！（テスト成功）');
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#090d16', color: '#fff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '20px', marginBottom: '16px' }}>Lotto Booster テスト画面</h1>
      
      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => setSelectedLotto('lotto6')} style={{ marginRight: '8px', padding: '8px' }}>ロト6</button>
        <button onClick={() => setSelectedLotto('lotto7')} style={{ marginRight: '8px', padding: '8px' }}>ロト7</button>
        <button onClick={() => setSelectedLotto('minilotto')} style={{ padding: '8px' }}>ミニロト</button>
      </div>

      <div style={{ marginBottom: '16px', fontSize: '18px' }}>
        {isGenerated ? numbers.join(', ') : '未生成'}
      </div>

      <button onClick={generateNumbers} style={{ display: 'block', width: '100%', padding: '12px', marginBottom: '12px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '8px' }}>
        買い目を生成する
      </button>

      <button onClick={saveTicket} style={{ display: 'block', width: '100%', padding: '12px', backgroundColor: '#374151', color: '#fff', border: 'none', borderRadius: '8px' }}>
        この買い目を保存する
      </button>
    </div>
  );
}
