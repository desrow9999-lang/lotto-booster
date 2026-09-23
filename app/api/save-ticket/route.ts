import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { lotto_type, numbers } = await request.json();

    const SUPABASE_URL = 'https://mwurdtuqkgnqlaqscrg.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_YVaA4UIJA_G3qIXtM4Bg_Q_rjViZTpG';

    const response = await fetch(`${SUPABASE_URL}/rest/v1/saved_tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ lotto_type, numbers })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: errorText }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
