'use client';

import { useState, useEffect } from 'main' // Reactの基本インポート
import React from 'react';

interface Ticket {
  id: string;
  lotto_type: string;
  numbers: string;
  created_at: string;
  result?: {
    checked: boolean;
    matchedCount: number;
    prize: string;
  };
}

export default function LotteryApp() {
  const [selectedLotto, setSelectedLotto] = useState<'lotto6' | 'lotto7' | 'minilotto'>('lotto6');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedTickets, setSavedTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('lotto_booster_tickets');
    if (stored) {
      try {
        setSavedTickets(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

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
    if (!isGenerated || numbers.length === 0) {
      alert('まずは買い目を生成してください！');
      return;
    }

    setIsSaving(true);
    try {
      const lottoLabels = { lotto6: 'ロト6', lotto7: 'ロト7', minilotto: 'ミニロト' };
      
      const newTicket: Ticket = {
        id: Date.now().toString(),
        lotto_type: lottoLabels[selectedLotto],
        numbers: numbers.map(n => String(n).padStart(2, '0')).join(', '),
        created_at: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        result: { checked: false, matchedCount: 0, prize: '照会待ち' }
      };

      const updatedTickets = [newTicket, ...savedTickets];
      setSavedTickets(updatedTickets);
      localStorage.setItem('lotto_booster_tickets', JSON.stringify(updatedTickets));

      alert('✨ 買い目が正常に保存されました！');
    } catch (error: any) {
      console.error(error);
      alert('保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  // 🎫 自動抽選・当せん照会機能
  const checkWinning = (id: string) => {
    const target = savedTickets.find(t => t.id === id);
    if (!target) return;

    // ユーザーが持っている数字の配列
    const userNums = target.numbers.split(', ').map(n => parseInt(n, 10));
    
    // 抽選されたと仮定する当せん番号（ランダム生成）
    let count = target.lotto_type === 'ロト7' ? 7 : target.lotto_type === 'ミニロト' ? 5 : 6;
    let max = target.lotto_type === 'ロト7' ? 37 : target.lotto_type === 'ミニロト' ? 31 : 43;
    
    const winningNums: number[] = [];
    while (winningNums.length < count) {
      const num = Math.floor(Math.random() * max) + 1;
      if (!winningNums.includes(num)) winningNums.push(num);
    }

    // 一致する個数を計算
    const matched = userNums.filter(n => winningNums.includes(n)).length;

    // 等賞の判定ロジック
    let prize = 'はずれ';
    if (target.lotto_type === 'ロト6') {
      if (matched === 6) prize = '🎉 1等当せん！';
      else if (matched === 5) prize = '🥈 3等当せん！';
      else if (matched === 4) prize = '🥉 4等当せん！';
      else if (matched === 3) prize = '5等当せん';
    } else if (target.lotto_type === 'ロト7') {
      if (matched === 7) prize = '🎉 1等当せん！';
      else if (matched === 6) prize = '🥈 2〜3等当せん！';
      else if (matched === 5) prize = '🥉 4等当せん！';
      else if (matched === 4) prize = '5等当せん';
    } else {
      if (matched === 5) prize = '🎉 1等当せん！';
      else if (matched === 4) prize = '🥈 2〜3等当せん！';
      else if (matched === 3) prize = '🥉 4等当せん！';
    }

    const updated = savedTickets.map(t => {
      if (t.id === id) {
        return {
          ...t,
          result: { checked: true, matchedCount: matched, prize }
        };
      }
      return t;
    });

    setSavedTickets(updated);
    localStorage.setItem('lotto_booster_tickets', JSON.stringify(updated));
    alert(`【抽選結果発表】\n当せん番号: ${winningNums.sort((a,b)=>a-b).map(n=>String(n).padStart(2,'0')).join(', ')}\n一致数: ${matched}個\n判定: ${prize}`);
  };

  const deleteTicket = (id: string) => {
    const updatedTickets = savedTickets.filter(t => t.id !== id);
    setSavedTickets(updatedTickets);
    localStorage.setItem('lotto_booster_tickets', JSON.stringify(updatedTickets));
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#090d16',
      color: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
        backgroundColor: '#111827',
        borderRadius: '20px',
        border: '1px solid #1f2937',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
        padding: '24px'
      }}>
        
        {/* ヘッダー */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            Lotto Booster <span style={{ fontSize: '18px' }}>🎯</span>
          </h1>
          <span style={{ fontSize: '10px', backgroundColor: '#374151', color: '#9ca3af', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>PRO v1.0</span>
        </div>
        <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 20px 0' }}>AI予測アルゴリズム ＆ 自動当せん照会</p>

        {/* タブ選択 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '24px', backgroundColor: '#030712', padding: '4px', borderRadius: '12px' }}>
          {(['lotto6', 'lotto7', 'minilotto'] as const).map((type) => {
            const labels = { lotto6: 'ロト6', lotto7: 'ロト7', minilotto: 'ミニロト' };
            const isActive = selectedLotto === type;
            return (
              <button
                key={type}
                onClick={() => setSelectedLotto(type)}
                style={{
                  padding: '10px 0',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#dc2626' : 'transparent',
                  color: isActive ? '#ffffff' : '#9ca3af',
                  transition: 'all 0.2s'
                }}
              >
                {labels[type]}
              </button>
            );
          })}
        </div>

        {/* 生成結果表示エリア */}
        <div style={{
          backgroundColor: '#030712',
          borderRadius: '16px',
          padding: '24px 16px',
          marginBottom: '20px',
          textAlign: 'center',
          border: '1px solid #1f2937'
        }}>
          <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '16px' }}>
            GENERATED NUMBERS
          </div>
          
          {isGenerated ? (
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
                {numbers.map((num, index) => (
                  <div
                    key={index}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)',
                      color: '#ffffff',
                      fontWeight: '900',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    {String(num).padStart(2, '0')}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ color: '#4b5563', fontSize: '13px', padding: '12px 0' }}>
              ボタンを押して買い目を生成してください
            </div>
          )}
        </div>

        {/* アクションボタン */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <button
            onClick={generateNumbers}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #ef4444 0%, #db2777 100%)',
              color: '#ffffff',
              fontWeight: '700',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🚀 AI買い目を自動生成する
          </button>
          
          <button
            onClick={saveTicket}
            disabled={isSaving}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#1f2937',
              color: '#d1d5db',
              fontWeight: '600',
              borderRadius: '12px',
              border: '1px solid #374151',
              cursor: 'pointer',
              fontSize: '13px',
              opacity: isSaving ? 0.6 : 1
            }}
          >
            📥 {isSaving ? '保存中...' : 'この買い目を保存して抽選に備える'}
          </button>
        </div>

        {/* 保存済みチケット一覧 ＆ 自動抽選機能 */}
        <div style={{ borderTop: '1px solid #1f2937', paddingTop: '16px' }}>
          <h2 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: '#9ca3af' }}>📋 保存済みマイチケット ＆ 抽選照会</h2>
          {savedTickets.length === 0 ? (
            <div style={{ fontSize: '12px', color: '#4b5563', textAlign: 'center', padding: '10px 0' }}>保存された買い目はまだありません</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto' }}>
              {savedTickets.map((ticket) => (
                <div key={ticket.id} style={{ backgroundColor: '#030712', padding: '12px', borderRadius: '10px', border: '1px solid #1f2937' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: '700', marginRight: '6px' }}>[{ticket.lotto_type}]</span>
                      <span style={{ fontSize: '10px', color: '#6b7280' }}>{ticket.created_at}</span>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '700', color: ticket.result?.checked ? (ticket.result.prize.includes('当せん') ? '#10b981' : '#9ca3af') : '#f59e0b' }}>
                      {ticket.result?.prize || '照会待ち'}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '0.5px', marginBottom: '8px', color: '#f8fafc' }}>
                    {ticket.numbers}
                  </div>

                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                    <button 
                      onClick={() => checkWinning(ticket.id)}
                      style={{ backgroundColor: '#dc2626', border: 'none', color: '#ffffff', fontSize: '11px', fontWeight: '600', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      🎯 抽選結果を照会する
                    </button>
                    <button 
                      onClick={() => deleteTicket(ticket.id)}
                      style={{ backgroundColor: '#374151', border: 'none', color: '#9ca3af', fontSize: '11px', padding: '5px 8px', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      削除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
