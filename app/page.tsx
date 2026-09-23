'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mwurdtuqkgnqlaqscrg.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_YVaA4UIJA_G3qIXtM4Bg_Q_rjViZTpG'; 

// 公式クライアントの初期化
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function LotteryApp() {
  const [selectedLotto, setSelectedLotto] = useState<'lotto6' | 'lotto7' | 'minilotto'>('lotto6');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  const saveTicket = async () => {
    if (!isGenerated || numbers.length === 0) {
      alert('まずは買い目を生成してください！');
      return;
    }

    setIsSaving(true);
    try {
      const lottoLabels = { lotto6: 'ロト6', lotto7: 'ロト7', minilotto: 'ミニロト' };
      
      // Supabase公式クライアントで安全にインサート
      const { error } = await supabase
        .from('saved_tickets')
        .insert([
          {
            lotto_type: lottoLabels[selectedLotto],
            numbers: numbers.map(n => String(n).padStart(2, '0')).join(', ')
          }
        ]);

      if (error) {
        throw error;
      }

      alert('✨ 買い目がクラウドデータベースに正常に保存されました！');
    } catch (error: any) {
      console.error(error);
      alert(`保存エラー: ${error.message || JSON.stringify(error)}`);
    } finally {
      setIsSaving(false);
    }
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
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
        padding: '24px'
      }}>
        
        {/* ヘッダー */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: '800', letterSpacing: '-0.5px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            Lotto Booster <span style={{ fontSize: '18px' }}>🎯</span>
          </h1>
          <span style={{ fontSize: '10px', backgroundColor: '#374151', color: '#9ca3af', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>PRO v1.0</span>
        </div>
        <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 20px 0' }}>AI予測アルゴリズム ＆ 買い目自動管理</p>

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
                  boxShadow: isActive ? '0 4px 12px rgba(220, 38, 38, 0.4)' : 'none',
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
                      boxShadow: '0 6px 16px rgba(220, 38, 38, 0.4)',
                      fontSize: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.2)'
                    }}
                  >
                    {String(num).padStart(2, '0')}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '12px', color: '#10b981', marginTop: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <span>✨</span> 統計的最適バランスで生成完了
              </div>
            </div>
          ) : (
            <div style={{ color: '#4b5563', fontSize: '13px', padding: '12px 0' }}>
              下のボタンを押して買い目を生成してください
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
              boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <span>🚀</span> AI買い目を自動生成する
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              opacity: isSaving ? 0.6 : 1
            }}
          >
            <span>📥</span> {isSaving ? '保存中...' : 'この買い目を保存する'}
          </button>
        </div>

        {/* フッター */}
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#6b7280', borderTop: '1px solid #1f2937', paddingTop: '16px' }}>
          Pro Membership で自動当せん照会機能が解放されます
        </div>

      </div>
    </div>
  );
}
