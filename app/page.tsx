{/* 生成された数字を丸いボール風に綺麗に並べる例 */}
<div className="flex flex-wrap gap-2 justify-center my-4">
  {generatedNumbers.map((num, index) => (
    <div 
      key={index} 
      className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white font-bold flex items-center justify-center shadow-lg text-lg"
    >
      {String(num).padStart(2, '0')}
    </div>
  ))}
</div>
