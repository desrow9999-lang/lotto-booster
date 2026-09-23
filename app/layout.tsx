import './globals.css';

export const metadata = {
  title: 'Lotto Booster',
  description: 'AI確率予測 ＆ 買い目自動管理アプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-slate-900 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
